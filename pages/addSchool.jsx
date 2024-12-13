import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast, ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"; // Import the toast styles
import "../styles/globals.css";
import Head from 'next/head';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

export default function AddSchool() {
  const [loading, setLoading] = useState(false); // State to track loading
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    const formData = new FormData();
    formData.append('name', data.name);  // Ensure single value, not an array
    formData.append('address', data.address);
    formData.append('city', data.city);
    formData.append('state', data.state);
    formData.append('contact', data.contact);  // Ensuring it's a single value, not an array
    formData.append('email_id', data.email_id);
  
    // Handling the file input correctly
    if (data.image && data.image[0]) {
      formData.append('image', data.image[0]); // Pass the file correctly
      console.log("data", data);
    } else {
      console.error('No image uploaded');
      toast.error('Please upload an image');
      return;
    }

    setLoading(true); // Set loading to true when the form is submitted

    try {
      // Cloudinary API URL (make sure the endpoint is correct for your backend)
      const response = await fetch('./api/addSchool', {
        method: 'POST',
        body: formData,
      });
  
      const result = await response.json();
      if (response.ok) {
        toast.success(result.message);
        reset(); // Reset the form on success
      } else {
        toast.error(result.message || 'Error adding school!');
      }
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error in adding school');
    } finally {
      setLoading(false); // Set loading to false after submission (success or failure)
    }
  };

  return (
    <>
      <Head>
        <title>Add School</title>
      </Head>
      <div>
        <div>
          <Navbar />
        </div>
        <div className="max-w-xl sm:max-w-2xl md:max-w-3xl mx-auto md:mx-auto p-3 md:p-6 md:m-5 m-2 border shadow-xl rounded-lg">
          <div>
            <Link href="/showSchools">
              <button 
                className="bg-green-500 border mb-3 border-green-600 text-white p-2 rounded-lg hover:bg-green-600 transition duration-200">
                View Schools
              </button>
            </Link>
            <h2 className="text-3xl font-semibold text-center uppercase mb-6">Add School</h2>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            encType="multipart/form-data"
            className="space-y-6"
          >
            {/* Name Field */}
            <div className="flex flex-col">
              <label htmlFor="name" className="text-lg mb-2">School Name<sup className="text-red-500 font-semibold" >*</sup></label>
              <input 
                id="name"
                {...register('name', { required: "Name is required" })}
                placeholder="Enter the name of the school" 
                className="border text-black border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              {errors.name && <span className="text-red-500 text-sm">{errors.name.message}</span>}
            </div>

            {/* Address Field */}
            <div className="flex flex-col">
              <label htmlFor="address" className="text-lg mb-2">Address<sup className="text-red-500 font-semibold" >*</sup></label>
              <input 
                id="address"
                {...register('address', { required: "Address is required" })}
                placeholder="Enter the school address" 
                className="border text-black border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              {errors.address && <span className="text-red-500 text-sm">{errors.address.message}</span>}
            </div>

            {/* City Field */}
            <div className="flex flex-col">
              <label htmlFor="city" className="text-lg mb-2">City<sup className="text-red-500 font-semibold" >*</sup></label>
              <input
                id="city"
                {...register('city', { required: "City is required" })}
                placeholder="Enter the city"
                className="border text-black border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              {errors.city && <span className="text-red-500 text-sm">{errors.city.message}</span>}
            </div>

            {/* State Field */}
            <div className="flex flex-col">
              <label htmlFor="state" className="text-lg mb-2">State<sup className="text-red-500 font-semibold" >*</sup></label>
              <input
                id="state"
                {...register('state', { required: "State is required" })}
                placeholder="Enter the state"
                className="border text-black border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              {errors.state && <span className="text-red-500 text-sm">{errors.state.message}</span>}
            </div>

            {/* Contact Field */}
            <div className="flex flex-col">
              <label htmlFor="contact" className="text-lg mb-2">Contact<sup className="text-red-500 font-semibold" >*</sup></label>
              <input 
                id="contact"
                {...register('contact', { required: "Contact is required", pattern: { value: /^[0-9]{10}$/, message: "Contact must be a 10-digit number" } })}
                placeholder="Enter 10-digit contact number"
                type="tel"
                className="border text-black border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              {errors.contact && <span className="text-red-500 text-sm">{errors.contact.message}</span>}
            </div>

            {/* Email Field */}
            <div className="flex flex-col">
              <label htmlFor="email_id" className="text-lg mb-2">Email<sup className="text-red-500 font-semibold" >*</sup></label>
              <input 
                id="email_id"
                {...register('email_id', { required: "Email is required", pattern: { value: /^\S+@\S+$/, message: "Email is not valid" } })}
                placeholder="Enter email address"
                type="email"
                className="border text-black border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              {errors.email_id && <span className="text-red-500 text-sm">{errors.email_id.message}</span>}
            </div>

            {/* Image Field */}
            <div className="flex flex-col">
              <label htmlFor="image" className="text-lg mb-2">Upload Image<sup className="text-red-500 font-semibold" >*</sup></label>
              <input 
                id="image"
                {...register('image', { required: "Image is required" })}
                type="file"
                accept="image/png, image/jpeg, image/jpg, image/webp, image/svg"
                className=" text-black p-3 rounded-lg max-w-min focus:outline-none focus:ring-2 focus:ring-green-300"
              />
              {errors.image && <span className="text-red-500 text-sm">{errors.image.message}</span>}
            </div>

            {/* Submit Button */}
            <div className="px-1 flex justify-center">
              <button 
                type="submit" 
                className="bg-blue-500 border border-blue-600 text-white p-3 rounded-lg hover:bg-blue-600 transition duration-200">
                {loading ? 'Submitting...' : 'Add School'}
              </button>
            </div>
          </form>

          {/* Toast Container */}
          <ToastContainer position="top-center" autoClose={3000} hideProgressBar={true} />
        </div>
      </div>
    </>
  );
}
