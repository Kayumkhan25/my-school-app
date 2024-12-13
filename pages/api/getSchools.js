// getSchools.js
import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      console.log('Fetching data from MySQL...'); // Log when the request is received

      const [rows] = await db.execute('SELECT id, name, address, city, image FROM schools');
      console.log('Data fetched:', rows); // Log the fetched data to check what is returned

      if (rows.length === 0) {
        return res.status(404).json({ message: 'No schools found' }); // Return 404 if no schools are found
      }

      res.status(200).json(rows);
    } catch (error) {
      console.error('Error on fetching data:', error); // Log any errors for debugging
      res.status(500).json({ message: 'Error fetching data' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' }); // Handle other HTTP methods
  }
}
