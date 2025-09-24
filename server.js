const express = require("express");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const { JSDOM } = require("jsdom");
const htmlDocx = require("html-docx-js");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));

// Upload endpoint
app.post("/upload", upload.single("docxFile"), async (req, res) => {
  try {
    const filePath = req.file.path;
    console.log("File uploaded:", filePath);

    const docBuffer = fs.readFileSync(filePath);
    const htmlContent = htmlDocx.asHTML(docBuffer);

    // Optional: clean temp file
    fs.unlinkSync(filePath);

    res.send(htmlContent);
  } catch (err) {
    console.error("Conversion error:", err);
    res.status(500).send("Error converting DOCX file.");
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
