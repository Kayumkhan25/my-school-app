import Link from "next/link";
import "../styles/globals.css";

export default function DataNotFound () {
    return (
      <>
   
      <div className="min-h-screen flex flex-col items-center justify-center gap-y-5 bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-3xl font-semibold italic text-red-500">🥺No Data Found</h2>
        <p className="text-gray-500 text-center">Please add some schools data to display here.</p>
        <Link href="/addSchool">
          <button className='px-3 py-2 bg-sky-500 text-white font-medium rounded-lg hover:bg-sky-700 transition duration-200'>Add School</button>
        </Link>
      </div></>
    );
  };
  