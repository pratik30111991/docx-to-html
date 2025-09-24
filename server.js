const express = require("express");
const multer = require("multer");
const mammoth = require("mammoth");
const path = require("path");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));
app.use(express.json());

// DOCX upload endpoint
app.post("/upload", upload.single("docxFile"), async (req, res) => {
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

    const htmlContent = result.value.replace(/\n/g, "<br>");
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

// Text paste conversion
app.post("/convert-text", (req, res) => {
  const text = req.body.text || "";
  // Simple conversion: headings, line breaks, bold markers (**text**), italic (*text*)
  let html = text
    .split("\n")
    .map(line => {
      if (line.match(/^Varmora Granito Unlisted Shares Price/)) return `<h1>${line}</h1>`;
      if (line.match(/Key Highlights|Investment Insights|Selling Shareholders|Why Are Investors Watching/)) return `<h2>${line}</h2>`;
      if (line.trim() === "") return "<br>";
      return `<p>${line}</p>`;
    })
    .join("");

  res.send(html);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
