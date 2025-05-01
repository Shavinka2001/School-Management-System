import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = () => {
    const navigate = useNavigate(); // Hook to 
    
     // State to handle input values for the form
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
    username: "",
  });

  const { email, password, username } = inputValue; 

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });

    const handleSuccess = (msg) =>
        toast.success(msg, {
          position: "bottom-right",
        });
    
        const handleSubmit = async (e) => {
            e.preventDefault();

            try {
                // Send signup data to the backend
                const { data } = await axios.post(
                  "http://localhost:4000/signup", // Your backend signup endpoint
                  {
                    ...inputValue,
                  },
                  { withCredentials: true } // Allow sending/receiving cookies
                );   
                const { success, message } = data;

      if (success) {
        handleSuccess(message); // Show success message
        // Redirect to login page after a short delay
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      } else {
        handleError(message); // Show error message if backend responds with error
      }
    } catch (error) {
      console.log(error); // Log error for debugging
    }
    // Reset input fields
    setInputValue({
        ...inputValue,
        email: "",
        password: "",
        username: "",
      });
    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Signup card container */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Create Your Account
        </h2>
        {/* Signup form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email input field */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={email}
              placeholder="Enter your email"
              onChange={handleOnChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            />
          </div>

          {/* Username input field */}
          <div>
            <label
              htmlFor="username"
              className="block text-sm font-medium text-gray-700"
            >
              Username
            </label>
            <input
              type="text"
              name="username"
              value={username}
              placeholder="Enter your username"
              onChange={handleOnChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            />
          </div>

          {/* Password input field */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={password}
              placeholder="Enter your password"
              onChange={handleOnChange}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Sign Up
          </button>
        </form>
    )

}  