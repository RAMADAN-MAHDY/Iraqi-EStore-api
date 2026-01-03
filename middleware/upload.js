import multer from 'multer';

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const ext = file.mimetype.split('/')[1];
    if (ext === 'jpeg' || ext === 'png' || ext === 'jpg') {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

export default upload;
