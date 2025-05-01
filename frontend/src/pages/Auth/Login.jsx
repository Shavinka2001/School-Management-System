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

}