const express = require("express");
const router = express.Router();
const multer = require("multer");
const { uploadFile } = require("../controller/uploadFile.controller");

const upload = multer({ 
  dest: "uploads/",
  limits: { 
    fileSize: 10 * 1024 * 1024 // 10MB máximo
  },
  fileFilter: (req, file, cb) => {
    // Solo acepta PDFs
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF'));
    }
  }
});

router.post("/", upload.single("pdf"), uploadFile);

module.exports = router;