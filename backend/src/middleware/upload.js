import multer from "multer";
import path from "path";
import crypto from "crypto";
import fs from "fs";

export const UPLOAD_DIR = path.resolve("uploads");
fs.mkdirSync(UPLOAD_DIR, { recursive: true });

const ALLOWED = {
    ".txt": ["text/plain"],
    ".md": ["text/markdown", "text/plain"],
    ".csv": ["text/csv", "application/vnd.ms-excel", "text/plain"],
    ".pdf": ["application/pdf"],
    ".png": ["image/png"],
    ".jpg": ["image/jpeg"],
    ".jpeg": ["image/jpeg"],
    ".webp": ["image/webp"],
    ".gif": ["image/gif"],
    ".docx": ["application/vnd.openxmlformats-officedocument.wordprocessingml.document"],
    ".xlsx": ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
};

export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const storage = multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (_req, file, cb) =>
        cb(null, crypto.randomUUID() + path.extname(file.originalname).toLowerCase()),
});

const upload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE, files: 5 },
    fileFilter: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const mimes = ALLOWED[ext];
        if (!mimes || !mimes.includes(file.mimetype)) {
            return cb(new Error(`File type not allowed: ${ext || "unknown"}`));
        }
        cb(null, true);
    },
});

export const uploadFiles = (req, res, next) =>
    upload.array("files", 5)(req, res, (err) => {
        if (err) return res.status(400).json({ message: err.message });
        next();
    });