import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // For navigation and linking
import axios from "axios"; // For making HTTP requests
import { ToastContainer, toast } from "react-toastify"; // For showing notifications
import "react-toastify/dist/ReactToastify.css"; // Toast styles

const Login = () => {
    const navigate = useNavigate(); // React Router hook to 
    
    // State to manage form input values
    const [inputValue, setInputValue] = useState({
        email: "",
        password: "",
  });

  // Destructure input values for easier access
  const { email, password } = inputValue;

    // Handle input field changes
    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setInputValue({
          ...inputValue,
          [name]: value,
        });
      };

    // Show error toast
    const handleError = (err) =>
        toast.error(err, {
        position: "bottom-left",
    });

    // Show success toast and navigate after delay
    const handleSuccess = (msg) => {
        toast.success(msg, {
        position: "bottom-left",
    });
    setTimeout(() => {
    navigate("/"); // Redirect to home page on success
    }, 1000);
  };
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission

        // Simple validation
        if (!email || !password) {
            handleError("Both email and password are required!");
            return;
        }
        
        try {
            // Send login request to backend
            const { data } = await axios.post(
              "http://localhost:4000/login", // Replace with your actual backend login route
              {
                ...inputValue,
              },
              { withCredentials: true } // Include cookies in request
            );
      
            console.log("Login response:", data); // Debug line
      
            const { success, message } = data;
            if (success) {
              handleSuccess(message); // If login is successful, show message and redirect
            } else {
              handleError(message); // If login fails, show error
            }
          } catch (error) {
            console.error("Login error:", error); // Log error to console
            handleError("An error occurred. Please try again."); // Show generic error message
          }

         // Reset input fields
            setInputValue({
                email: "",
                password: "",
        });  
    };

    return(
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
      {/* Login card */}
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
          Login to Your Account
        </h2>
    )

}