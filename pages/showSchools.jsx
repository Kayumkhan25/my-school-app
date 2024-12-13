import { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/globals.css';
import Head from 'next/head';
import Loading from '@/components/Loading';
import DataNotFound from '@/components/DataNotFound';
import Navbar from '@/components/Navbar';

export default function ShowSchools() {
  const [schools, setSchools] = useState([]);
  const [reload, setReload] = useState(false); // State to trigger re-fetching

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
        <title>Show Schools</title>
      </Head>
      <div className='overflow-hidden'>

        {/* Conditional Rendering */}
        {schools.length > 0 ? (
          <div>
            <div>
              <Navbar />
            </div>
            <div>
              <div className="px-5 md:px-16 mx-auto">
                <div className="mx-auto text-3xl text-center justify-center mt-10 font-semibold bg-gradient-to-r from-sky-600 fron-30% to-cyan-600 to-70% text-transparent bg-clip-text">
                  View Schools
                </div>
                <div className="mx-auto p-10 m-8 shadow-xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-3 rounded-lg border-x">
                  {schools.map((school) => (
                    <div key={school.id} className="mx-auto relative border rounded-xl m-3 mt-5 shadow-xl max-w-[260px] overflow-hidden">
                      <div className='overflow-hidden rounded-t-xl'>
                        {
                          school.image ? 
                          (
                            // If the image is uploaded to Cloudinary, use the Cloudinary URL
                            <img
                              src={school.image}  // Cloudinary image URL
                              alt={school.name}
                              className="w-[260px] h-[17rem] mx-auto hover:scale-110 transition-all duration-200 cursor-pointer"
                            />
                          ) : (
                            <div className="w-[260px] h-[17rem] flex justify-center items-center">
                              <Loading />
                            </div>
                          )
                        }
                      </div>
                      <div className='px-5 pt-4 pb-12 flex flex-col gap-1'>
                        <p className="text-sky-400 font-light">{school.city.replace(/["\[\]]/g, '')}</p>
                        <h2 className="text-lg font-bold">{school.name.replace(/["\[\]]/g, '')}</h2>
                        <p className='text-slate-500 mt-3'>{school.address.replace(/["\[\]]/g, '')}</p>
                      </div>
                      <a href="#" className='absolute bottom-0 left-0 right-0'>
                        <button className='bg-green-600 hover:bg-green-700 transition-all duration-200 text-white px-2 py-2 min-w-full '>Apply Now</button>
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
        ) : (
          <DataNotFound />
        )}
      </div>
    </>
  );
}
