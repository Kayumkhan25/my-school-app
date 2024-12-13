import db from '../../lib/db';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    try {
      const [rows] = await db.execute('SELECT id, name, address, city, image FROM schools');
      res.status(200).json(rows);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching data' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
