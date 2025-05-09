import express from 'express';
import upload from '../utils/multer.js';
import { uploadMedia } from '../utils/cloudinary.js';

const router = express.Router();
router.route("/upload-video").post(upload.single("file"), async (req, res) => {
    try {
        const result = await uploadMedia(req.file.path);
        res.status(200).json({
            message: "File uplaoded Successfully",
            success : true,
            data: result
        })
    } catch (error) {
        console.log("error from Media Routre - ", error)
        res.status(500).json({
            success: false,
            message: "Error uplaoding file"
        })
    }
})

export default router;