const cloudinary = require('cloudinary').v2;

const cloudinaryFileUpload = async (filePath) => {
  try {
    // Configuration
    cloudinary.config({
      cloud_name: 'colbalt9',
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    const uploadedFile = await cloudinary.uploader.upload(filePath, {
      folder: 'inventory_app',
      resource_type: 'image',
    });

    return uploadedFile.secure_url;
  } catch (error) {
    res.status(500);
    console.log(error);
    const cloudinaryError = new Error();
    cloudinaryError.message = error.message;
    cloudinaryError.stack = error.stack;
    cloudinaryError.name = error.name;
    throw cloudinaryError;
  }
};

module.exports = cloudinaryFileUpload;
