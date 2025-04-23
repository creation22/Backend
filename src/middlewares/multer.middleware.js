import path from 'path';
import fs from 'fs';
import multer from 'multer';

const uploadPath = path.join('public', 'temp');

// Check if the directory exists, and if not, create it
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadPath); // Use the relative path here
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`); // Prevent overwriting files
  },
});

export const upload = multer({ storage });
