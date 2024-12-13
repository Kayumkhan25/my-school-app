import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/globals.css';
import Link from 'next/link';
import Head from 'next/head';

// DataNotFound Component
const DataNotFound = () => {
  return (
    <>
 
    <div className="min-h-screen flex flex-col items-center justify-center gap-y-5 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-3xl font-semibold italic text-red-500">🥺No Data Found</h2>
      <p className="text-gray-500">Please add some schools data to display here.</p>
      <Link href="/addSchool">
        <button className='px-3 py-2 bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-700 transition duration-200'>Add School</button>
      </Link>
    </div></>
  );
};

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [reload, setReload] = useState(false); // State to trigger re-fetching
  const l = ['[', ']', '"'] ;

  // Function to fetch schools from the API
  const fetchSchools = async () => {
    try {
      const response = await axios.get('/api/getSchools');
      setSchools(response.data); // Update schools state
    } catch (error) {
      console.error('Error fetching schools:', error);
    }
  };

  // Re-fetch the data when the component mounts or when `reload` state changes
  useEffect(() => {
    fetchSchools();
  }, [reload]); // Depend on `reload` state to trigger re-fetching

  // Function to handle when a new school is added (trigger re-fetching)
  const handleSchoolAdded = () => {
    setReload(!reload); // Toggle the reload state to trigger data refresh
  };

  return (
    <>
      <Head>
      <title>Show School</title>
      </Head>
      <div className="p-6 bg-red-300">

        {/* Conditional Rendering */}
        {schools.length > 0 ? (
          <div className="bg-green-300">
           <h1 className="text-2xl font-bold mb-4">School List</h1>
           <div className=" bg-cyan-300 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-[55rem]">
            {schools.map((school) => (
              <div key={school.id} className="bg-lime-400 border p-4 rounded shadow">
                <img
                  src={`/schoolImages/${school.image}`}
                  alt={school.name}
                  className="w-full h-40 object-cover rounded"
                />
                <p>{school.city.replace(/["\[\]]/g, '')}</p>
                <h2 className="text-lg font-bold mt-2">{school.name.replace(/["\[\]]/g, '')}</h2>
                <p>{school.address.replace(/["\[\]]/g, '')}</p>
              </div>
            ))}
            </div>
          </div>
        ) : (
          <DataNotFound />
        )}
      </div>
   </>
  );
}
