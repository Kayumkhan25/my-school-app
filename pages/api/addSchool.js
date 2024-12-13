const formidable = require('formidable');
const path = require('path');
const db = require('../../lib/db'); // Correct path for DB connection

export const config = {
  api: {
    bodyParser: false,  // Disable default body parsing to handle multipart form data
  },
};

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const form = new formidable.IncomingForm({
      uploadDir: path.join(process.cwd(), '/public/schoolImages'),
      keepExtensions: true,
      allowEmptyFiles: false,
      maxFileSize: 5 * 1024 * 1024, // Limit file size to 5MB
    });

    form.parse(req, async (err, fields, files) => {
      console.log('Fields:', fields);
      console.log('Files:', files);
      
      if (err) {
        console.error('Error parsing the form:', err);
        return res.status(500).json({ message: 'Error parsing the form data' });
      }

   

      if (!files.image || !files.image[0]?.filepath) {
        console.error('Filepath is undefined or image is missing');
        return res.status(400).json({ message: 'Invalid file upload' });
      }

      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp', 'image/svg'];
      if (!allowedTypes.includes(files.image[0].mimetype)) {
        console.error('Invalid file type:', files.image[0].mimetype);
        return res.status(400).json({ message: 'Only JPG, PNG, WebP, and SVG images are allowed' });
      }

      try {
        const { name, address, city, state, contact, email_id } = fields;
        const image = path.basename(files.image[0].filepath);

        // Check if school with similar details exists
        const [existingSchool] = await db.execute(
          'SELECT * FROM schools WHERE name = ? AND city = ? AND (email_id = ? OR contact = ?)',
          [name, city, email_id, contact]
        );

        if (existingSchool.length > 0) {
          return res.status(400).json({ message: 'A school with the similar details already exists.' });
        }

        // Insert new school data
        await db.execute(
          'INSERT INTO schools (name, address, city, state, contact, image, email_id) VALUES (?, ?, ?, ?, ?, ?, ?)',
          [name, address, city, state, contact, image, email_id]
        );

        res.status(200).json({ message: 'School added successfully' });
      } catch (dbError) {
        console.error('Database error:', dbError);
        res.status(500).json({ message: 'Error saving school to the database' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
  