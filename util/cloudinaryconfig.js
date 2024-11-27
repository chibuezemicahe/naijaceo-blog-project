// Require the cloudinary library
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

if (process.env.CLOUDINARY_URL) {
  // Manually parse the CLOUDINARY_URL
  const [, api_key, api_secret, cloud_name] = process.env.CLOUDINARY_URL.match(
    /cloudinary:\/\/([^:]+):([^@]+)@(.+)/
  );

  cloudinary.config({
    cloud_name,
    api_key,
    api_secret,
  });
} else {
  console.error('CLOUDINARY_URL is not defined in .env');
}


module.exports = cloudinary;
