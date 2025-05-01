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
    }

}  