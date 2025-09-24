const express = require("express");
const multer = require("multer");
const mammoth = require("mammoth");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

// serve frontend files
app.use(express.static("public"));

// upload endpoint
app.post("/upload", upload.single("docxFile"), async (req, res) => {
  console.log("File uploaded:", req.file.path);

  try {
    const result = await mammoth.convertToHtml(
      { path: req.file.path },
      {
        styleMap: [
          "p[style-name='Heading 1'] => h1:fresh",
          "p[style-name='Heading 2'] => h2:fresh",
          "p[style-name='Normal'] => p:fresh",
          "table => table.table-bordered",
          "b => strong",
          "i => em"
        ]
      }
    );

    const htmlContent = result.value;
    console.log("Conversion successful. Length:", htmlContent.length);

    res.send(`
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Converted HTML</title>
        <link rel="stylesheet" href="/style.css">
      </head>
      <body>
        <h1>Converted DOCX to HTML</h1>
        <div class="output">${htmlContent}</div>
      </body>
      </html>
    `);
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("Error converting DOCX file.");
  }
});

// render logs endpoint (help for debugging future issues)
app.get("/logs", (req, res) => {
  res.send("Check Render logs above in Deploy Logs. If error -> see console logs printed.");
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
