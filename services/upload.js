import cloudinary from "../config/cloudinary.js";

// Upload Image to Cloudinary
export const uploadToCloudinary = async (fileBuffer, folder = "doctors") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ resource_type: "auto", folder }, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      })
      .end(fileBuffer);
  });
};

// Delete Image from Cloudinary
export const deleteFromCloudinary = async (publicId) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.destroy(publicId, (error, result) => {
      if (error) reject(error);
      else resolve(result);
    });
  });
};
