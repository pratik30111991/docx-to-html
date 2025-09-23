const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');

const app = express();
const port = process.env.PORT || 3000;

// Multer in-memory storage
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Serve static files
app.use(express.static('public'));

// DOCX → HTML conversion
app.post('/convert', upload.single('docxFile'), async (req, res) => {
  try {
    const buffer = req.file.buffer;

    // Mammoth options for table preservation
    const options = {
      includeDefaultStyleMap: true,
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "table => table.table",
        "tr => tr",
        "tc => td"
      ]
    };

    const result = await mammoth.convertToHtml({ buffer, styleMap: options.styleMap });
    
    // Add minimal CSS for tables
    const html = `
      <style>
        table.table { border-collapse: collapse; width: 100%; margin: 10px 0; }
        table.table, table.table th, table.table td { border: 1px solid #000; padding: 5px; }
      </style>
      ${result.value}
    `;

    res.send(html);
  } catch (err) {
    res.status(500).send('Error converting file: ' + err.message);
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
