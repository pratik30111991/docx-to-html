const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');

const app = express();
const port = process.env.PORT || 3000;

// In-memory upload storage (Render friendly)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Serve frontend
app.use(express.static('public'));

// DOCX → HTML conversion
app.post('/convert', upload.single('docxFile'), async (req, res) => {
  try {
    const buffer = req.file.buffer;

    // Mammoth options for table and style preservation
    const result = await mammoth.convertToHtml({ 
      buffer,
      includeDefaultStyleMap: true, // include Word's default formatting
      styleMap: [
        "p[style-name='Heading 1'] => h1:fresh",
        "p[style-name='Heading 2'] => h2:fresh",
        "p[style-name='Heading 3'] => h3:fresh",
        "table => table.table",
        "tr => tr",
        "tc => td"
      ]
    });

    // Return HTML
    res.send(result.value);
  } catch (err) {
    res.status(500).send('Error converting file: ' + err.message);
  }
});


app.listen(port, () => console.log(`Server running on port ${port}`));
