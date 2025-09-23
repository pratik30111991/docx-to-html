const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');

const app = express();
const port = process.env.PORT || 3000;

// Multer in-memory storage (Render friendly)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Serve frontend
app.use(express.static('public'));

// DOCX → HTML conversion
app.post('/convert', upload.single('docxFile'), async (req, res) => {
  try {
    const buffer = req.file.buffer;

    // Mammoth options: preserve headings, bold, italic, tables
    const options = {
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "p[style-name='Heading 4'] => h4:fresh",
        "b => strong",
        "i => em",
        "u => u",
        "table => table.table",
        "tr => tr",
        "tc => td"
      ]
    };

    const result = await mammoth.convertToHtml({ buffer, styleMap: options.styleMap });

    // Add CSS for proper table formatting and spacing
    const html = `
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.5; margin: 10px; }
        h1, h2, h3, h4 { margin-top: 20px; margin-bottom: 10px; }
        p { margin: 5px 0; }
        table.table { border-collapse: collapse; width: 100%; margin: 15px 0; }
        table.table, table.table th, table.table td { border: 1px solid #000; padding: 8px; text-align: left; }
        strong { font-weight: bold; }
        em { font-style: italic; }
        u { text-decoration: underline; }
      </style>
      ${result.value}
    `;

    res.send(html);
  } catch (err) {
    res.status(500).send('Error converting file: ' + err.message);
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
