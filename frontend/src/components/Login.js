// import { useState } from "react";
// import axios from "axios";

// const Login = () => {
//   const [formData, setFormData] = useState({ email: "", password: "" });

//   const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//         try {
//             const response = await axios.post("http://192.168.181.235:5000/login", formData);
//             localStorage.setItem("token", response.data.token); // Store JWT in localStorage
//             alert("Login successful!");
//         } catch (error) {
//             alert(error.response?.data?.message || "Something went wrong!");
//         }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input name="email" placeholder="Email" onChange={handleChange} required />
//       <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
//       <button type="submit">Login</button>
//     </form>
//   );
// };

// export default Login;

import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import React from 'react';
import { Box, Paper, TextField, Typography, Button, Stack } from '@mui/material';
import bgImage from './bg.jpg';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/sessions");
        } catch (error) {
            alert("Invalid credentials");
        }
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
                    backgroundColor: 'rgba(255, 255, 255, 0.85)',
                    boxShadow: '0px 6px 30px rgba(0, 0, 0, 0.3)',
                }}
            >
                <Typography variant="h5" gutterBottom align="center">
                    Login
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Stack spacing={2}>
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
                            Login
                        </Button>
                    </Stack>
                </form>
            </Paper>
        </Box>
    );
};

export default Login;
