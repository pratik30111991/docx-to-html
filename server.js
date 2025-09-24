const express = require("express");
const multer = require("multer");
const mammoth = require("mammoth");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");

const app = express();
const upload = multer({ dest: "uploads/" });

app.use(express.static("public"));

// API endpoint to convert DOCX -> HTML
app.post("/convert", upload.single("docx"), async (req, res) => {
  const filePath = req.file.path;

  try {
    // First try Mammoth (good for clean text, headings)
    const result = await mammoth.convertToHtml({ path: filePath });
    let html = result.value;

    // If tables are missing -> fallback to LibreOffice
    if (!html.includes("<table")) {
      const outPath = filePath + ".html";
      exec(`soffice --headless --convert-to html ${filePath} --outdir uploads`, (err) => {
        if (err) {
          console.error("LibreOffice error:", err);
          return res.status(500).send("Conversion failed");
        }
        const htmlContent = fs.readFileSync(outPath, "utf8");
        res.send(htmlContent);

        // cleanup
        fs.unlinkSync(filePath);
        fs.unlinkSync(outPath);
      });
    } else {
      res.send(html);
      fs.unlinkSync(filePath);
    }
  } catch (e) {
    console.error("Error in conversion:", e);
    res.status(500).send("Conversion failed");
  }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
