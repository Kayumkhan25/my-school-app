const formidable = require('formidable');
const cloudinary = require('cloudinary').v2;
const db = require('../../lib/db'); // Make sure this is correct based on your setup

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // Disable default body parser for file upload
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    // Create a new instance of formidable form
    const form = new formidable.IncomingForm({
      keepExtensions: true,
      maxFileSize: 5 * 1024 * 1024, // 5MB max file size
    });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        return res.status(500).json({ message: 'Error parsing form data', error: err });
      }

      // Example validation (ensure all fields are included)
      const { name, address, city, state, contact, email_id } = fields;
      if (!name || !address || !city || !state || !contact || !email_id) {
        return res.status(400).json({ message: 'All fields are required' });
      }

      // Upload the image to Cloudinary
      if (!files.image) {
        return res.status(400).json({ message: 'No image file provided' });
      }

      const imageFile = files.image[0];
      try {
        // Upload image to Cloudinary
        const cloudinaryResponse = await cloudinary.uploader.upload(imageFile.filepath);
        const imageUrl = cloudinaryResponse.secure_url;

        // Insert school data into the database
        await db.execute(
          'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [name, address, city, state, contact, imageUrl, email_id]
        );

        return res.status(200).json({ message: 'School added successfully' });
      } catch (cloudinaryError) {
        console.error('Error uploading image to Cloudinary:', cloudinaryError);
        return res.status(500).json({ message: 'Error uploading image to Cloudinary', error: cloudinaryError });
      }
    });
  } else {
    // Method not allowed
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
