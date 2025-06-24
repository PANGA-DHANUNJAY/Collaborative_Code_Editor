// import { useState } from "react";
// import axios from "axios";

// const Register = () => {
//   const [formData, setFormData] = useState({ name: "", email: "", password: "" });

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await axios.post("http://localhost:5000/register", formData);
//     alert("Registration Successful");
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="name" placeholder="Name" onChange={handleChange} required />
//       <input name="email" placeholder="Email" onChange={handleChange} required />
//       <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
//       <button type="submit">Register</button>
//     </form>
//   );
// };

// export default Register;

import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Box, Paper, Typography, TextField, Button, Stack, Link } from '@mui/material';
// import { useNavigate } from 'react-router-dom'; // If you're using React Router
import bgImage from './bg.jpg';

const Register = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { register } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatePassword(password)) {
            alert("Password must be at least 8 characters long and include an uppercase letter, a number, and a special character.");
            return;
        }
        try {
            await register(name, email, password);
            navigate("/login");
        } catch (error) {
            console.error("Full Error Object:", error);
            console.error("Error Response:", error.response);
            console.error("Error Data:", error.response?.data);
            console.error("Error Message:", error.message);

            alert(error.response?.data?.message || error.message || "Registration failed");
        }
    };

    const validatePassword = (password) => {
        const minLength = /.{8,}/;
        const hasUpper = /[A-Z]/;
        const hasNumber = /[0-9]/;
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/;
    
        return (
            minLength.test(password) &&
            hasUpper.test(password) &&
            hasNumber.test(password) &&
            hasSpecial.test(password)
        );
    };
    

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: `url(${bgImage}) center/cover no-repeat`,
                backdropFilter: 'blur(6px)',
                backgroundAttachment: 'fixed',
                px: 2,
            }}
        >
            <Paper
                elevation={6}
                sx={{
                    p: 5,
                    width: 370,
                    borderRadius: 4,
                    backgroundColor: 'rgb(255, 255, 255)',
                    boxShadow: '0px 6px 30px rgba(0, 0, 0, 0.3)',
                }}
            >
                <Typography variant="h5" gutterBottom align="center">
                    Register
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
                        <TextField
                            label="Name"
                            variant="outlined"
                            fullWidth
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                        <TextField
                            label="Email"
                            type="email"
                            variant="outlined"
                            fullWidth
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                        <TextField
                            label="Password"
                            type="password"
                            variant="outlined"
                            fullWidth
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Register
                        </Button>

                        <Typography variant="body2" align="center">
                            Already have an account?{' '}
                            <Link
                                component="button"
                                onClick={() => navigate('/login')}
                                underline="hover"
                                color="primary"
                            >
                                Login
                            </Link>
                        </Typography>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

export default Register;






