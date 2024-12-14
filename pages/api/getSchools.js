import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      console.log('Fetching data from MySQL...');

      const [rows] = await db.execute('SELECT id, name, address, city, image FROM schools');
      console.log('Data fetched:', rows);

      if (rows.length === 0) {
        return res.status(404).json({ message: 'No schools found' });
      }

      res.status(200).json(rows);
    } catch (error) {
      console.error('Error on fetching data:', error);
      res.status(500).json({ message: 'Error fetching data' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
