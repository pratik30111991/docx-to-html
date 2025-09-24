const express = require("express");
const multer = require("multer");
const mammoth = require("mammoth");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));

// DOCX upload + convert API
app.post("/convert", upload.single("docx"), async (req, res) => {
  const filePath = req.file.path;

  try {
    // First try Mammoth
    const result = await mammoth.convertToHtml({ path: filePath });
    let html = result.value;

    // If tables missing → fallback to libreoffice converter
    if (!html.includes("<table")) {
      const outPath = filePath + ".html";
      exec(`soffice --headless --convert-to html ${filePath} --outdir uploads`, (err) => {
        if (err) {
          console.error("LibreOffice error:", err);
          return res.status(500).send("Conversion failed");
        }
        const htmlContent = fs.readFileSync(outPath, "utf8");
        res.send(htmlContent);
        fs.unlinkSync(filePath);
        fs.unlinkSync(outPath);
      });
    } else {
      res.send(html);
      fs.unlinkSync(filePath);
    }
  } catch (e) {
    console.error(e);
    res.status(500).send("Conversion failed");
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
