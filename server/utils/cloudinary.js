import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config(); // Make sure dotenv is called before accessing process.env

cloudinary.config({
    api_key: "317715138838673",
    api_secret: "Qgjod1DrLaZsG17odZCXp9aRVYQ",
    cloud_name: "dkwneuxhf",
});

// console.log('API_KEY:', process.env.API_KEY);
// console.log('API_SECRET:', process.env.API_SECRET);
// console.log('CLOUD_NAME:', process.env.CLOUD_NAME);

export const uploadMedia = async (file) => {
    try {
        const uploadResponse = await cloudinary.uploader.upload(file, {
            resource_type: "auto",
        });
        return uploadResponse; // Return the full upload response, including the secure URL
    } catch (error) {
        console.error("Error uploading file to Cloudinary:", error);
        throw new Error("Cloudinary upload failed");
    }
};
export const deleteMediaFromCloudinary = async (publicId) => {
    try {
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.log(error);
    }
}

export const deleteVideoFromCloudinary = async () => {
    try {
        await cloudinary.uploader.destroy(publicId, {resource_type : "video"});
    } catch (error) {
        console.log(error);
        
    }
}