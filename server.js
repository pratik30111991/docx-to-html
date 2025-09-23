const express = require('express');
const multer = require('multer');
const fs = require('fs');
const docx4js = require('docx4js');

const app = express();
const port = process.env.PORT || 3000;

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Serve static files
app.use(express.static('public'));

// DOCX → HTML conversion
app.post('/convert', upload.single('docxFile'), async (req, res) => {
  try {
    const buffer = req.file.buffer;

    // Load docx content
    const doc = await docx4js.load(buffer);

    // Extract HTML content
    const html = docx4js.html(doc);

    // Optional: Add minimal CSS for tables
    const finalHtml = `
      <style>
        table { border-collapse: collapse; width: 100%; margin: 10px 0; }
        table, th, td { border: 1px solid #000; padding: 5px; }
        h1,h2,h3 { margin: 10px 0; }
        p { margin: 5px 0; }
      </style>
      ${html}
    `;

    res.send(finalHtml);

  } catch (err) {
    console.error(err);
    res.status(500).send('Error converting file: ' + err.message);
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
