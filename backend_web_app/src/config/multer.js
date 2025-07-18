import multer from "multer";
import cloudinary from 'cloudinary';
import {CloudinaryStorage} from 'multer-storage-cloudinary'

const {v2} = cloudinary;

v2.config({
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECTRET,
    cloud_name:process.env.CLOUND_NAME
});

const storage = new CloudinaryStorage({
    cloudinary:v2,
    params:{
        folder:"Auth"
    }
});

const upload = multer({storage});

export default upload;