// CodeEditor.jsx
// import { useEffect, useState, useRef } from "react";
// import { useParams } from "react-router-dom";
// import { io } from "socket.io-client";
// const socket = io("http://localhost:5000", {
//     transports: ["websocket", "polling"], // optional but good to include both
// });

// const CodeEditor = () => {
//     const { roomId, userId } = useParams();
//     const [users, setUsers] = useState([]);
//     // const socket = useRef(null);

//     const user = JSON.parse(localStorage.getItem(`user_${userId}`)) || {
//         _id: userId,
//         name: "User " + userId,
//     };
//     console.log("user in editor.js",user);
//     useEffect(() => {
//         console.log("editoer.js usereffect");
//         // if (socket.current) return;

//         // socket.current = io("http://localhost:5000");

//         socket.on("connect", () => {
//             console.log("✅ Connected to socket server!");
//             socket.emit("join-room", { roomId, user: { ...user, socketId: socket.current.id } });
//         });

//         socket.on("room-users", (usersInRoom) => {
//             console.log("👥 Users in room:", usersInRoom);
//             setUsers(usersInRoom);
//         });

//         return () => {
//             socket.emit("leave-room", { roomId, userId: user._id });
//             socket.disconnect();
//         };
//     }, [roomId, userId]);

//     return (
//         <div style={{ padding: "2rem" }}>
//             <h2>Welcome {user.name} to Room: {roomId}</h2>
//             <h3>Current Users:</h3>
//             <ul>
//                 {users.map((u) => (
//                     <li key={u._id}>{u.name}</li>
//                 ))}
//             </ul>
//         </div>
//     );
// };

// export default CodeEditor;

import { motion } from "framer-motion";
import CodeEditorArea from "./CodeEditorArea";
import AIAssistant from "./AIAssistant";
import OutputPanel from "./OutputPanel";
import ChatSection from "./ChatSection"; // ChatSection now handles its own display
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import TopBar from "./TopBar";

const socket = io("http://localhost:5000", {
    transports: ["websocket", "polling"],
});

const CodeEditor = () => {
    const { roomId, userId } = useParams();
    const [users, setUsers] = useState([]);
    // const [showOutput, setShowOutput] = useState(false);
    // const [showChat, setShowChat] = useState(false); // ✅ For toggling chat

    const user = JSON.parse(localStorage.getItem(`user_${userId}`)) || {
        _id: userId,
        name: "User " + userId,
    };

    useEffect(() => {
        socket.emit("join-room", { roomId, user });

        socket.on("room-users", (usersInRoom) => {
            setUsers(usersInRoom);
        });

        return () => {
            socket.emit("leave-room", { roomId, userId: user._id });
            socket.off("room-users");
        };
    }, [roomId]);

    return (
        <>
            {/* Header */}
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "1rem 2rem"
            }}>
                <h2>Welcome {user.name} to Room: {roomId}</h2>
                <button
                    onClick={() => {
                        socket.emit("leave-room", { roomId, userId: user._id });
                        window.location.href = "/sessions";
                    }}
                    style={{
                        padding: "0.5rem 1rem",
                        backgroundColor: "#ff4d4f",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                        cursor: "pointer",
                        fontWeight: "bold"
                    }}
                >
                    Leave Room
                </button>
            </div>

            <TopBar users={users} />

            {/* Editor and Chat Area */}
            <div className="relative w-full  flex overflow-hidden">
                <div className="w-full" >
                    <CodeEditorArea socket={socket} roomId={roomId} user={user}/>
                </div>

                {/* {showChat && (
                    <motion.div
                        initial={{ x: 300, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: 300, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="w-[25%] h-full bg-white border-l border-gray-300 p-4 overflow-auto"
                    >
                        <ChatSection socket={socket} roomId={roomId} user={user} />
                    </motion.div>
                )} */}
            </div>

            {/* Chat Toggle Button */}
            {/* <button
                onClick={() => setShowChat((prev) => !prev)}
                className="absolute bottom-6 right-6 bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center shadow-md hover:bg-blue-700 transition-colors z-50"
                title="Toggle Chat"
            >
                💬
            </button> */}

            {/* Output Panel */}
            {/* {showOutput && (
                <motion.div
                    initial={{ y: 300, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 300, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="absolute bottom-0 left-0 w-full h-60 bg-gray-900 text-white p-4 overflow-auto"
                >
                    <OutputPanel />
                </motion.div>
            )} */}
        </>
    );
};

export default CodeEditor;

