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

// import React from "react";
// import {
//   Container,
//   Grid,
//   Box,
//   Typography,
//   Button,
//   Paper,
//   List,
//   ListItem,
//   ListItemIcon,
//   ListItemText,
// } from "@mui/material";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import LightbulbIcon from "@mui/icons-material/Lightbulb";
// import { useNavigate } from "react-router-dom";
// // import "./HomePage.css"; // Optional for extra effects

// const Register = () => {
//   const navigate = useNavigate();

//   const features = [
//     "Real-time collaborative coding using Socket.IO",
//     "Monaco editor with syntax highlighting",
//     "Dynamic code execution with live output",
//     "Integrated chat for communication",
//     "Multi-user presence display",
//     "Create or join sessions instantly",
//     "HTML/CSS/JS project support",
//     "JWT-based authentication and secure sessions",
//   ];

//   const enhancements = [
//     "Multi-language code support (Python, Java, C++)",
//     "GitHub integration for version control",
//     "Support for project folders and file trees",
//     "Voice & video chat for collaboration",
//     "Mobile responsive layout for all devices",
//     "Interview mode with timer and question panel",
//   ];

//   return (
//     <Box
//       sx={{
//         backgroundImage:
//           'url("https://images.unsplash.com/photo-1531497865144-0464ef8fb9d8?auto=format&fit=crop&w=1950&q=80")',
//         backgroundSize: "cover",
//         backgroundPosition: "center",
//         minHeight: "100vh",
//         color: "#fff",
//         py: 6,
//         px: 2,
//       }}
//     >
//       <Container maxWidth="lg">
//         <Typography
//           variant="h3"
//           align="center"
//           gutterBottom
//           sx={{
//             fontWeight: "bold",
//             backgroundColor: "rgba(0,0,0,0.6)",
//             borderRadius: 2,
//             py: 2,
//           }}
//         >
//           Collaborative Code Editor
//         </Typography>

//         <Box textAlign="center" mt={4} mb={6}>
//           <Button
//             variant="contained"
//             color="primary"
//             sx={{ m: 1 }}
//             onClick={() => navigate("/login")}
//           >
//             Login
//           </Button>
//           <Button
//             variant="outlined"
//             color="secondary"
//             sx={{ m: 1 }}
//             onClick={() => navigate("/register")}
//           >
//             Register
//           </Button>
//           <Button
//             variant="contained"
//             sx={{ m: 1, backgroundColor: "#00e676" }}
//             onClick={() => navigate("/create-session")}
//           >
//             Create Session
//           </Button>
//         </Box>

//         <Grid container spacing={4}>
//           <Grid item xs={12} md={6}>
//             <Paper
//               elevation={6}
//               sx={{
//                 p: 3,
//                 backgroundColor: "rgba(0,0,0,0.7)",
//                 borderRadius: 3,
//               }}
//             >
//               <Typography variant="h5" gutterBottom color="#00e6e6">
//                 🌟 Features
//               </Typography>
//               <List>
//                 {features.map((feature, index) => (
//                   <ListItem key={index}>
//                     <ListItemIcon>
//                       <CheckCircleIcon sx={{ color: "#00e6e6" }} />
//                     </ListItemIcon>
//                     <ListItemText primary={feature} />
//                   </ListItem>
//                 ))}
//               </List>
//             </Paper>
//           </Grid>

//           <Grid item xs={12} md={6}>
//             <Paper
//               elevation={6}
//               sx={{
//                 p: 3,
//                 backgroundColor: "rgba(0,0,0,0.7)",
//                 borderRadius: 3,
//               }}
//             >
//               <Typography variant="h5" gutterBottom color="#ffc107">
//                 🚀 Future Enhancements
//               </Typography>
//               <List>
//                 {enhancements.map((item, index) => (
//                   <ListItem key={index}>
//                     <ListItemIcon>
//                       <LightbulbIcon sx={{ color: "#ffc107" }} />
//                     </ListItemIcon>
//                     <ListItemText primary={item} />
//                   </ListItem>
//                 ))}
//               </List>
//             </Paper>
//           </Grid>
//         </Grid>

//         <Box mt={6} textAlign="center">
//           <Typography
//             variant="body2"
//             sx={{ backgroundColor: "rgba(0,0,0,0.5)", py: 1, borderRadius: 2 }}
//           >
//             © 2025 Collaborative Code Editor | Built with ❤️ using React, Node.js & Socket.IO
//           </Typography>
//         </Box>
//       </Container>
//     </Box>
//   );
// };

// export default Register;
;



