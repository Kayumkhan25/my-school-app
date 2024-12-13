const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const db = require('../../lib/db'); // Your database connection

// Configure Cloudinary with your credentials
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // Disable default body parsing to handle multipart form data
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm({
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // Limit file size to 5MB
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Error parsing the form:', err);
        return res.status(500).json({ message: 'Error parsing the data' });
      }

      // Check if the image file is present
      if (!files.image || !files.image[0]?.filepath) {
        return res.status(400).json({ message: 'Image is missing' });
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg'];
      if (!allowedTypes.includes(files.image[0].mimetype)) {
        return res.status(400).json({ message: 'Invalid file type' });
      }

      // Upload image to Cloudinary
      const imageFile = files.image[0];
      try {
        const cloudinaryResponse = await cloudinary.uploader.upload(imageFile.filepath, {
          folder: 'schoolImages', // Optional: specify a folder
        });
        const imageUrl = cloudinaryResponse.secure_url; // Get the URL of the uploaded image

        // Save the school details to the database, including the image URL
        const { name, address, city, state, contact, email_id } = fields;

        // Check if the school already exists
        const [existingSchool] = await db.execute(
          'SELECT * FROM schools WHERE name = ? AND city = ? AND (email_id = ? OR contact = ?)',
          [name, city, email_id, contact]
        );

        if (existingSchool.length > 0) {
          return res.status(400).json({ message: 'A school with similar details already exists.' });
        }

        // Insert new school into the database
        await db.execute(
          'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [name, address, city, state, contact, imageUrl, email_id]
        );

        res.status(200).json({ message: 'School added successfully' });
      } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        res.status(500).json({ message: 'Error uploading image to Cloudinary' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
