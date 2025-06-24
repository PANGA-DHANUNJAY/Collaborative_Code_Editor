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

import CodeEditorArea from "./CodeEditorArea";
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
            </div>

        </>
    );
};

export default CodeEditor;

