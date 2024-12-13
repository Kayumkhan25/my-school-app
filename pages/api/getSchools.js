import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      console.log('Fetching data from MySQL...'); // Add this log to confirm the request is received

      const [rows] = await db.execute('SELECT id, name, address, city, image FROM schools');
      console.log('Data fetched:', rows); // Log the fetched data to check what is returned

      res.status(200).json(rows);
    } catch (error) {
      console.error('Error on fetching data:', error); // Log any errors for debugging
      res.status(500).json({ message: 'Error fetching data' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
