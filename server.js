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
  try {
    const result = await mammoth.convertToHtml({ path: req.file.path }, {
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Normal'] => p:fresh",
        "table => table.table-bordered",
        "b => strong",
        "i => em"
      ]
    });
    const htmlContent = result.value;
    res.send(htmlContent);
  } catch (err) {
    console.error(err);
    res.status(500).send("Conversion error");
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
