// import { useEffect, useState } from "react";
// import io from "socket.io-client";
// import { Box, TextField, IconButton, Typography, Paper } from "@mui/material";
// import SendIcon from "@mui/icons-material/Send";

// const Chat = ({ roomId, currentUser }) => {
//     const [messages, setMessages] = useState([]);
//     const [newMessage, setNewMessage] = useState("");

//     useEffect(() => {
//         const socket = io("http://localhost:5000"); // Update if deployed
//         socket.emit("join-room", roomId);

//         socket.on("receive-message", (message) => {
//             setMessages(prev => [...prev, message]);
//         });

//         return () => {
//             socket.off("receive-message");
//         };
//     }, [roomId]);

//     const handleSendMessage = () => {
//         if (!newMessage.trim()) return;
//         const msgObj = { user: currentUser, text: newMessage };
//         socket.emit("send-message", { roomId, message: msgObj });
//         setMessages(prev => [...prev, msgObj]);
//         setNewMessage("");
//     };

//     return (
//         <Box
//             sx={{
//                 width: 300,
//                 bgcolor: "#1e1e1e",
//                 display: "flex",
//                 flexDirection: "column",
//                 p: 2,
//                 borderLeft: "1px solid #333"
//             }}
//         >
//             <Typography variant="subtitle1" sx={{ color: "#ccc", mb: 1 }}>Chat</Typography>

//             <Box
//                 sx={{
//                     flexGrow: 1,
//                     overflowY: "auto",
//                     display: "flex",
//                     flexDirection: "column",
//                     gap: 1,
//                     mb: 2,
//                 }}
//             >
//                 {messages.map((msg, idx) => {
//                     const isMe = msg.user === currentUser;
//                     return (
//                         <Box
//                             key={idx}
//                             sx={{
//                                 alignSelf: isMe ? "flex-end" : "flex-start",
//                                 maxWidth: "80%",
//                             }}
//                         >
//                             <Paper
//                                 elevation={2}
//                                 sx={{
//                                     p: 1,
//                                     px: 2,
//                                     bgcolor: isMe ? "#1976d2" : "#424242",
//                                     color: "#fff",
//                                     borderRadius: 2,
//                                     borderTopRightRadius: isMe ? 0 : 8,
//                                     borderTopLeftRadius: isMe ? 8 : 0,
//                                 }}
//                             >
//                                 <Typography
//                                     variant="caption"
//                                     sx={{ fontWeight: "bold", opacity: 0.7 }}
//                                 >
//                                     {msg.user}
//                                 </Typography>
//                                 <Typography variant="body2">{msg.text}</Typography>
//                             </Paper>
//                         </Box>
//                     );
//                 })}
//             </Box>

//             <Box sx={{ display: "flex", gap: 1 }}>
//                 <TextField
//                     variant="outlined"
//                     size="small"
//                     fullWidth
//                     placeholder="Type a message"
//                     value={newMessage}
//                     onChange={(e) => setNewMessage(e.target.value)}
//                     sx={{
//                         input: { color: "#fff" },
//                         bgcolor: "#2a2a2a",
//                     }}
//                     onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
//                 />
//                 <IconButton onClick={handleSendMessage} sx={{ color: "#90caf9" }}>
//                     <SendIcon />
//                 </IconButton>
//             </Box>
//         </Box>
//     );
// };

// export default Chat;
