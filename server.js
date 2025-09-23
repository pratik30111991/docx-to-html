const express = require('express');
const multer = require('multer');
const mammoth = require('mammoth');
const path = require('path');

const app = express();
const port = 3000;

// File storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname))
});
const upload = multer({ storage });

// Serve static files
app.use(express.static('.'));

// DOCX to HTML endpoint
app.post('/convert', upload.single('docxFile'), async (req, res) => {
  try {
    const { path: filePath } = req.file;
    const result = await mammoth.convertToHtml({ path: filePath });
    res.send(result.value);
  } catch (err) {
    res.status(500).send('Error converting file: ' + err.message);
  }
});

app.listen(port, () => console.log(`Server running at http://localhost:${port}`));
