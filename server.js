const express = require('express');
const multer = require('multer');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const app = express();
const upload = multer({ dest: 'uploads/' });

const imageMimeTypes = ['image/jpeg', 'image/png'];
const pdfMimeType = 'application/pdf';
const docxMimeType = 'application/vnd.openxmlformats-officedocument.wordprocessingml.document';

const MAX_FILE_SIZE_BYTES = 2354510;

app.post('/upload', upload.array('files'), (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).send('No se ha seleccionado ningún archivo.');
  }

  const fileInfo = req.files.map(file => ({
    filename: file.filename,
    originalname: file.originalname,
    size: file.size,
    mimetype: file.mimetype
  }));

  if (fileInfo.some(file => file.mimetype === docxMimeType)) {
    return res.status(400).send('Archivo no permitido. Los archivos .docx no están permitidos.');
  }

  // Verificar el tamaño de cada archivo
  const oversizedFiles = fileInfo.filter(file => file.size > MAX_FILE_SIZE_BYTES);
  if (oversizedFiles.length > 0) {
    const filenames = oversizedFiles.map(file => file.originalname).join(', ');
    return res.status(400).send(`El/los archivo(s) ${filenames} excede(n) el tamaño permitido.`);
  }

  res.json(fileInfo); // Enviamos la información en formato JSON
});

app.use(express.static('uploads'));

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});
