const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');

const app = express();
const port = process.env.PORT || 3000;

// In-memory upload storage (Render friendly)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Serve frontend
app.use(express.static('.'));

// DOCX → HTML conversion
app.post('/convert', upload.single('docxFile'), async (req, res) => {
  try {
    const buffer = req.file.buffer;
    const result = await mammoth.convertToHtml({ buffer });
    res.send(result.value);
  } catch (err) {
    res.status(500).send('Error converting file: ' + err.message);
  }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
