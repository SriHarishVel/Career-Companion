import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDirectory = path.join(
    process.cwd(),
    "uploads",
    "resources"
);

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, {
        recursive: true,
    });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },

    filename: (req, file, cb) => {
        const extension = path.extname(file.originalname);

        const uniqueName = `${Date.now()}-${Math.round(
            Math.random() * 1e9
        )}${extension}`;

        cb(null, uniqueName);
    },
});

const allowedMimeTypes = [
    "video/mp4",
    "video/webm",
    "video/ogg",

    "audio/mpeg",
    "audio/mp3",
    "audio/wav",
    "audio/ogg",

    "application/pdf",

    "image/jpeg",
    "image/png",
    "image/gif",
    "image/webp",
];

const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(
            new Error(
                "Unsupported file type. Please upload a video, audio, PDF, or image."
            ),
            false
        );
    }
};

const uploadResourceFile = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024,
    },
});

export default uploadResourceFile;