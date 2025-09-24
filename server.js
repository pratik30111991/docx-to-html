const express = require("express");
const multer = require("multer");
const mammoth = require("mammoth");
const juice = require("juice");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

// Serve frontend files
app.use(express.static("public"));

// Upload endpoint
app.post("/upload", upload.single("docxFile"), async (req, res) => {
  console.log("File uploaded:", req.file.path);

  try {
    const result = await mammoth.convertToHtml(
      { path: req.file.path },
      {
        styleMap: [
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
          "p[style-name='Heading 3'] => h3:fresh",
          "p[style-name='Normal'] => p:fresh",
          "table => table",
          "b => strong",
          "i => em"
        ]
      }
    );

    const rawHtml = result.value;

    // Define default CSS
    const css = `
      table { border-collapse: collapse; width: 100%; margin: 20px 0; }
      th, td { border: 1px solid #333; padding: 5px; text-align: left; }
      h1, h2, h3 { color: #2c3e50; margin-top: 20px; }
      p { margin: 10px 0; }
    `;

    // Convert CSS to inline styles
    const htmlWithInlineStyles = juice.inlineContent(rawHtml, css);

    // Send HTML content with inline styles
    res.send(htmlWithInlineStyles);
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("Error converting DOCX file.");
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
