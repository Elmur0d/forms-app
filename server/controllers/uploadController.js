import { UploadClient } from '@uploadcare/upload-client';

const client = new UploadClient({
    publicKey: process.env.UPLOADCARE_PUBLIC_KEY,
    secretKey: process.env.UPLOADCARE_SECRET_KEY,
});

export const uploadImage = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ msg: 'Файл не загружен' });
        }

        const result = await client.uploadFile(req.file.buffer, {
            fileName: req.file.originalname,
            contentType: req.file.mimetype,
        });

        res.json({ secure_url: result.cdnUrl });

    } catch (error) {
        console.error('Image upload failed:', error);
        res.status(500).json({ msg: 'Ошибка при загрузке изображения' });
    }
};