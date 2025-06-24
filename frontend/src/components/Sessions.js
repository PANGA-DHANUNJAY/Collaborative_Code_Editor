// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const SessionsPage = () => {
//     const [sessions, setSessions] = useState([]);
//     const [roomId, setRoomId] = useState("");

//     useEffect(() => {
//         fetchSessions();
//     }, []);

//     const fetchSessions = async () => {
//         try {
//             const token = localStorage.getItem("token");
//             const res = await axios.get("http://192.168.181.235:5000/api/sessions/my-sessions", {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             setSessions(res.data.sessions);
//         } catch (error) {
//             console.error("Error fetching sessions:", error);
//         }
//     };

//     const joinSession = async () => {
//         if (!roomId) return alert("Enter a Room ID!");
//         try {
//             const token = localStorage.getItem("token");
//             await axios.post("http://192.168.181.235:5000/api/sessions/join", { roomId }, {
//                 headers: { Authorization: `Bearer ${token}` }
//             });
//             alert("Joined session successfully!");
//             fetchSessions(); // Refresh sessions list
//         } catch (error) {
//             console.error("Error joining session:", error);
//         }
//     };

//     return (
//         <div style={{ display: "flex", gap: "20px", padding: "20px" }}>
//             {/* Left side: Display previous sessions */}
//             <div style={{ flex: 1 }}>
//                 <h3>Your Sessions</h3>
//                 <ul>
//                     {userSessions.map((session) => (
//                         <li key={session.id}>
//                             {session.name} - <b>{session.id}</b>
//                         </li>
//                     ))}
//                 </ul>
//             </div>

//             {/* Right side: Room ID Input */}
//             <div style={{ flex: 1 }}>
//                 <h3>Join a Session</h3>
//                 <input
//                     type="text"
//                     placeholder="Enter Room ID"
//                     value={roomId}
//                     onChange={(e) => setRoomId(e.target.value)}
//                     style={{ padding: "8px", width: "80%" }}
//                 />
//                 <br />
//                 <button onClick={handleGenerateRoomId} style={{ marginTop: "10px", padding: "8px" }}>
//                     Generate Room ID
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default SessionPage;


import { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "axios";
import { generateRoomId } from "../utils/generateRoomId";
import { useNavigate } from "react-router-dom";
import React from 'react';
import {
    Container,
    Typography,
    TextField,
    Button,
    List,
    ListItemButton,
    ListItemText,
    Box,
    Stack,
    Paper
} from '@mui/material';

const Sessions = () => {
    const { user } = useContext(AuthContext);
    console.log("Auth User:", user);
    const [sessions, setSessions] = useState([]);
    const [roomId, setRoomId] = useState("");
    const token = localStorage.getItem("token");
    useEffect(() => {
        if (!token) return; // Ensure token is available before making the request

        axios
            .get(`http://192.168.181.235:5000/api/session/user-sessions`, {
                headers: {
                    Authorization: `Bearer ${token}` // Attach token in the Authorization header
                }
            })
            .then(res => setSessions(res.data))
            .catch(err => console.error(err));
    }, [token, user]); // Add 'token' to the dependency array


    const navigate = useNavigate();
    const handleJoinRoom = async () => {
        if (!roomId.trim()) {
            alert("Please enter a valid Room ID");
            return;
        }

        console.log("🚀 Sending join request with Room ID:", roomId);

        try {
            const res = await axios.post("http://192.168.181.235:5000/api/session/join",
                { roomId: roomId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("✅ Successfully joined session:", res.data);
            alert(`Successfully joined Room ID: ${roomId}`);
            // const { session, username } = res.data;
            const user = res.data.user;
            localStorage.setItem(`user_${user._id}`, JSON.stringify(user));
            navigate(`/editor/${roomId}/${user._id}`);

            // navigate(`/editor/${roomId}`);
            // Redirect or update UI as needed
            // Example: window.location.href = `/editor/${roomId}`;
        } catch (err) {
            console.error("❌ Error joining session:", err.response?.data || err);
            alert("Failed to join session. Please check the Room ID and try again.");
        }
    };


    const handleGenerateRoom = async () => {
        const newRoomId = generateRoomId();
        console.log("Generated Room ID:", newRoomId);

        if (!newRoomId || typeof newRoomId !== "string") {
            console.error("❌ Invalid Room ID generated:", newRoomId);
            return;
        }

        // Log request data before making API call
        console.log("🚀 Sending request with:", JSON.stringify({ roomId: newRoomId }));

        try {
            const res = await axios.post("http://192.168.181.235:5000/api/session/create-session",
                { roomId: newRoomId },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                }
            );

            console.log("✅ Session created:", res.data);
            setRoomId(newRoomId);
            alert(`Room ID: ${newRoomId}`);
        } catch (err) {
            console.error("❌ Error creating session:", err.response?.data || err);
            alert("Failed to create session");
        }
    };



    return (
        <Box
            sx={{
                minHeight: '50vh',
                background: 'rgba(244, 251, 252, 0.88)', // Soft gradient
                py: 6,
            }}
        >
            <Container maxWidth="sm">
                <Paper
                    elevation={4}
                    sx={{
                        p: 4,
                        mb: 4,
                        borderRadius: 3,
                        backgroundColor: 'rgb(243, 176, 176)', // Light background color
                    }}
                >
                    <Typography variant="h4" gutterBottom align="center">
                        Welcome, {user?.name}
                    </Typography>
                </Paper>

                <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 3, backgroundColor: 'rgb(216, 228, 255)', }}>
                    <Typography variant="h6" gutterBottom>
                        Your Previous Sessions
                    </Typography>
                    <List>
                        {sessions.map((session) => (
                            <ListItemButton
                                key={session.roomId}
                                onClick={() => {
                                    setRoomId(session.roomId);
                                    // handleJoinRoom();
                                }}
                                sx={{
                                    borderRadius: 2,
                                    mb: 1,
                                    '&:hover': { backgroundColor: '#e3f2fd' },
                                }}
                            >
                                <ListItemText primary={session.roomId} />
                            </ListItemButton>
                        ))}
                    </List>
                </Paper>

                <Paper elevation={3} sx={{ p: 3, borderRadius: 3 ,backgroundColor: 'rgb(216, 228, 255)'}}>
                    <Typography variant="h6" gutterBottom>
                        Join a Room
                    </Typography>
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            label="Enter Room ID"
                            variant="outlined"
                            value={roomId}
                            onChange={(e) => setRoomId(e.target.value)}
                        />
                        <Box display="flex" justifyContent="space-between">
                            <Button variant="contained" color="primary" onClick={handleJoinRoom}>
                                Join Room
                            </Button>
                            <Button variant="outlined" onClick={handleGenerateRoom}>
                                Generate Room ID
                            </Button>
                        </Box>
                    </Stack>
                </Paper>
            </Container>
        </Box>
    );
};

export default Sessions;
