import React, { useState, useEffect, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import Editor from "@monaco-editor/react";
import {
    Box, Button, TextField, Typography, List, ListItem, ListItemIcon, ListItemText, Divider, IconButton, Tooltip
} from "@mui/material";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import AddIcon from '@mui/icons-material/Add';
import { styled } from '@mui/system';
import debounce from "../utils/debounce.js";
import './CodeEditorArea.css';
import { Card, CardActions, CardContent } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ChatIcon from '@mui/icons-material/Chat';
// import ChatSection from "./ChatSection"; // Adjust path as needed




// const socket = io("http://localhost:5000", {
//     transports: ["websocket", "polling"], // optional but good to include both
// });

const SideBar = styled(Box)(({ theme }) => ({
    width: 250,
    backgroundColor: "#1e1e1e",
    color: "#ffffff",
    padding: "16px",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #333",
}));

const FileList = styled(List)({
    flexGrow: 1,
    overflowY: "auto",
});

const FileItem = styled(ListItem)(({ selected }) => ({
    cursor: "pointer",
    backgroundColor: selected ? "#333" : "transparent",
    '&:hover': {
        backgroundColor: "#444",
    },
}));

export default function CodeEditorArea({ socket, roomId, user }) {
    // const { roomId } = useParams();
    const [code, setCode] = useState("// Start coding...");
    const [output, setOutput] = useState("");
    const [files, setFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(null);
    const [newFileName, setNewFileName] = useState("");
    const [shareOutput, setShareOutput] = useState(false);
    const [language, setLanguage] = useState("javascript");
    const [showOutput, setShowOutput] = useState(false);
    const [outputHeight, setOutputHeight] = useState(200); // Default height for output
    const [otherCursors, setOtherCursors] = useState({});
    // const editorRef = useRef(null);
    const [showChat, setShowChat] = useState(false); // 🔥 NEW
    const containerRef = useRef(null);
    const editorRef = useRef(null);
    const [chatWidth, setChatWidth] = useState(400); // Initial width in px
    const resizerRef = useRef();
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");


    // 🆕 useRef to always get the latest selectedFile
    const selectedFileRef = useRef(null);

    useEffect(() => {
        const handleMouseMove = (e) => {
            const newWidth = window.innerWidth - e.clientX;
            if (newWidth > 200 && newWidth < 600) { // Min & Max width
                setChatWidth(newWidth);
            }
        };

        const handleMouseUp = () => {
            document.removeEventListener("mousemove", handleMouseMove);
            document.removeEventListener("mouseup", handleMouseUp);
        };

        const handleMouseDown = () => {
            document.addEventListener("mousemove", handleMouseMove);
            document.addEventListener("mouseup", handleMouseUp);
        };

        const resizer = resizerRef.current;
        if (resizer) {
            resizer.addEventListener("mousedown", handleMouseDown);
        }

        return () => {
            if (resizer) {
                resizer.removeEventListener("mousedown", handleMouseDown);
            }
        };
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on("chat-message", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => socket.off("chat-message");
    }, [socket]);

    useEffect(() => {
        selectedFileRef.current = selectedFile;
    }, [selectedFile]);

    // useEffect(() => {
    //     if (!editorRef.current) return;

    //     const editor = editorRef.current;

    //     const decorations = Object.entries(otherCursors).map(([clientId, pos]) => ({
    //         range: new window.monaco.Range(pos.lineNumber, pos.column, pos.lineNumber, pos.column),
    //         options: {
    //             className: 'other-cursor',
    //             afterContentClassName: 'after-cursor',
    //         },
    //     }));

    //     const decorationIds = editor.deltaDecorations([], decorations);

    //     return () => {
    //         editor.deltaDecorations(decorationIds, []);
    //     };
    // }, [otherCursors]);


    useEffect(() => {
        // socket.emit("join-room", { roomId });

        fetch(`http://localhost:5000/api/files/${roomId}`)
            .then(res => res.json())
            .then(data => {
                console.log("Fetched data:", data);
                setFiles(data);
                if (data.length) {
                    setSelectedFile(data[0]);
                    setCode(data[0].content);
                    setLanguage(data[0].language);
                }
            });

        socket.on("load-code", setCode);
        // Listeners for code changes
        socket.on("update-code", ({ fileId, code: newCode }) => {
            if (selectedFileRef.current?._id === fileId) {
                setCode(newCode);
            }
            // Optional: update local files list with the new code
            setFiles(prev =>
                prev.map(file =>
                    file._id === fileId ? { ...file, content: newCode } : file
                )
            );
        });

        // Listener for new file creation
        socket.on("new-file-created", (newFile) => {
            setFiles(prev => {
                const exists = prev.some(f => f._id === newFile._id);
                return exists ? prev : [...prev, newFile];
            });
        });

        socket.on("output", ({ fileId, output }) => {
            if (selectedFileRef.current?._id === fileId) {
                setOutput(output);
            }
        });

        // socket.on("cursor-move", ({ fileId, clientId, position }) => {
        //     if (selectedFileRef.current?._id === fileId) {
        //         setOtherCursors(prev => ({
        //             ...prev,
        //             [clientId]: position
        //         }));
        //     }
        // });

        return () => {
            socket.emit("leave-room", { roomId });
            socket.off("load-code");
            socket.off("update-code");
            socket.off("new-file-created");
            socket.off("output");
            socket.off("cursor-move");
        };
    }, [roomId]);


    const handleCodeChange = (newCode) => {
        setCode(newCode);
        debouncedEmitCodeChange(newCode); // Call the debounced version
    };

    const emitCodeChange = (newCode) => {
        if (selectedFileRef.current) {
            socket.emit("code-change", {
                roomId,
                fileId: selectedFileRef.current._id,
                code: newCode
            });

            fetch(`http://localhost:5000/api/files/${selectedFileRef.current._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newCode })
            });
        }
    };

    const debouncedEmitCodeChange = useCallback(
        debounce(emitCodeChange, 500), // 500ms debounce delay
        []
    );


    const handleRunCode = async () => {
        if (selectedFileRef.current?.language == "html") {
            console.log("files", files);
            const cssFile = files.find(f => f.name === "styles.css");
            console.log("cssFile", cssFile);
            const jsFile = files.find(f => f.name === "script.js");
            console.log("jsFile", jsFile);
            const fullHTML = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Preview</title>
            <style>
                ${cssFile?.content || ""}
            </style>
        </head>
        <body>
            ${code}
            <script>
                ${jsFile?.content || ""}
            </script>
        </body>
        </html>
        `;
            const newTab = window.open();

            // Insert the generated HTML content into the new tab
            newTab.document.write(fullHTML);
            newTab.document.close();
            // setOutput(htmlTemplate);
        }
        else {
            try {
                const res = await fetch("http://localhost:5000/api/run", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        code: code,
                        language: selectedFileRef.current?.language,
                        share: shareOutput,
                        roomId: roomId,
                        fileId: selectedFileRef.current?._id,
                    })
                });

                const data = await res.json();
                // setOutput(data.run?.stdout || data.run?.stderr || "No output");
                setShowOutput(true); // show terminal
                console.log(data.output);
                setOutput(data.output);
            } catch {
                setOutput("Failed to execute code.");
            }
        }
    };

    const handleFileClick = (file) => {
        selectedFileRef.current = file;
        setLanguage(selectedFileRef.current.language);
        setSelectedFile(file);
        setCode(file.content);
    };


    const getLanguageFromExtension = (filename) => {
        const ext = filename.split('.').pop().toLowerCase();
        switch (ext) {
            case 'js':
            case 'jsx':
                return 'javascript';
            case 'py':
                return 'python';
            case 'java':
                return 'java';
            case 'c':
                return 'c';
            case 'html':
                return 'html';
            case 'css':
                return 'css';
            default:
                return 'plaintext';
        }
    };

    const handleCreateFile = async () => {
        if (!newFileName.trim()) return;
        const ext = getLanguageFromExtension(newFileName);
        const res = await fetch("http://localhost:5000/api/files/create", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                "roomId": roomId,
                "name": newFileName.trim(),
                "language": ext,
                "content": "// New file"
            })
        });

        const createdFile = await res.json();
        setFiles(prev => [...prev, createdFile]);
        selectedFileRef.current = createdFile;
        setLanguage(selectedFileRef.current.language);
        setSelectedFile(createdFile);
        setCode(createdFile.content);
        setNewFileName("");
        // Notify others in the room
        socket.emit("new-file-created", { roomId, file: createdFile });
    };

    // Function to handle resizing of the output panel
    const handleResize = (e) => {
        const newHeight = window.innerHeight - e.clientY; // Calculate new height based on mouse position
        if (newHeight > 100 && newHeight < 500) { // Limit the height range
            setOutputHeight(newHeight);
        }
    };

    const handleDeleteFile = async (file) => {
        console.log("Deleting file:", file);

        if (window.confirm("Are you sure you want to delete this file?")) {
            try {
                const response = await fetch(`http://localhost:5000/api/files/${file._id}`, {
                    method: 'DELETE',
                });

                const contentType = response.headers.get('Content-Type');
                if (contentType && contentType.includes('application/json')) {
                    const data = await response.json();
                    console.log('File deleted:', data);

                    const updatedFiles = files.filter((f) => f._id !== file._id);
                    setFiles(updatedFiles);

                    if (selectedFile?._id === file._id) {
                        setSelectedFile(updatedFiles[0] || null);
                    }
                } else {
                    throw new Error('Expected JSON, but got ' + contentType);
                }
            } catch (error) {
                console.error('Error:', error);
            }
        }
    };



    const handleRenameFile = async (file) => {
        console.log("Renaming file:", file);
        const newName = prompt("Enter new file name:", file.name);
        if (!newName || newName === file.name) return;
        const language = getLanguageFromExtension(newName);

        try {
            const res = await fetch(`http://localhost:5000/api/files/rename/${file._id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name: newName, language: language }),
            });

            if (!res.ok) throw new Error("Rename failed");

            const updated = files.map((f) =>
                f._id === file._id ? { ...f, name: newName, language: language } : f
            );
            setFiles(updated);
            if (selectedFile?._id === file._id) {
                setSelectedFile({ ...selectedFile, name: newName, language: language });
                setLanguage(language);
            }

        } catch (err) {
            console.error("Failed to rename file", err);
        }
    };

    const sendMessage = () => {
        if (text.trim()) {
            const message = { user, text, roomId };
            socket.emit("chat-message", message);
            setMessages((prev) => [...prev, message]); // also show the sent message
            setText("");
        }
    };

    // const handleMouseDown = (e) => {
    //     e.preventDefault();
    //     document.addEventListener("mousemove", handleMouseMove);
    //     document.addEventListener("mouseup", handleMouseUp);
    // };

    // const handleMouseMove = (e) => {
    //     if (!containerRef.current) return;
    //     const containerWidth = containerRef.current.offsetWidth;
    //     const offsetLeft = containerRef.current.getBoundingClientRect().left;
    //     const newWidth = ((containerWidth - (e.clientX - offsetLeft)) / containerWidth) * 100;

    //     if (newWidth > 20 && newWidth < 60) {
    //         setChatWidth(newWidth);
    //     }
    // };

    // const handleMouseUp = () => {
    //     document.removeEventListener("mousemove", handleMouseMove);
    //     document.removeEventListener("mouseup", handleMouseUp);
    // };

    return (
        <Box sx={{ display: "flex", height: "100vh", bgcolor: "#121212" }}>
            {/* Sidebar File Explorer */}
            <SideBar>
                <Typography variant="subtitle1" gutterBottom>Files</Typography>
                <FileList dense>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                        {files.map((file) => (
                            <Card
                                key={file.id}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    borderRadius: '8px',
                                    boxShadow: selectedFile?.id === file.id ? 6 : 1,
                                    transition: 'all 0.2s ease-in-out',
                                    '&:hover': { boxShadow: 6 },
                                }}
                            >
                                <CardContent
                                    onClick={() => handleFileClick(file)}
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        cursor: 'pointer',
                                        flex: 1,
                                        backgroundColor: 'black',  // Black background for file name
                                        padding: '5px',  // Reduced padding to make items closer
                                        borderRadius: '8px 0 0 8px', // Rounded corners on left
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            color: 'white',  // White text color on black background
                                            fontWeight: 'bold',
                                            marginLeft: '10px',  // Slight margin for better spacing
                                        }}
                                    >
                                        {file.name}
                                    </Typography>
                                </CardContent>
                                <CardActions sx={{ padding: '5px', backgroundColor: 'black' }}>
                                    <IconButton
                                        onClick={() => handleRenameFile(file)}
                                        sx={{
                                            backgroundColor: 'black',  // Black background for icon button
                                            color: 'white',  // White icon color
                                            '&:hover': { backgroundColor: '#424242' },  // Darker hover background
                                            marginRight: '5px',
                                            padding: '5px',
                                            borderRadius: '50%',  // Rounded icon button
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => handleDeleteFile(file)}
                                        sx={{
                                            backgroundColor: 'black',  // Black background for icon button
                                            color: 'white',  // White icon color
                                            '&:hover': { backgroundColor: '#424242' },  // Darker hover background
                                            padding: '5px',
                                            borderRadius: '50%',  // Rounded icon button
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </CardActions>

                            </Card>
                        ))}
                    </div>

                </FileList>
                <Divider sx={{ my: 1 }} />
                <Box sx={{ display: "flex", gap: 1 }}>
                    <TextField
                        variant="outlined"
                        size="small"
                        placeholder="newfile.js"
                        fullWidth
                        value={newFileName}
                        onChange={(e) => setNewFileName(e.target.value)}
                        sx={{
                            backgroundColor: "#2a2a2a",
                            input: { color: "#fff" },
                        }}
                    />
                    <Tooltip title="Create File">
                        <IconButton onClick={handleCreateFile} sx={{ color: "#90caf9" }}>
                            <AddIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </SideBar>

            {/* Editor + Output Section */}
            <Box sx={{ flexGrow: 1, p: 2, display: "flex", flexDirection: "row", position: "relative" }}>

                {/* Editor with Run Button */}
                <Box sx={{ position: "relative", flexGrow: showChat ? 0.7 : 1, transition: "flex-grow 0.3s ease-in-out" }}>
                    <Editor
                        theme="vs-dark"
                        language={language}
                        value={code}
                        onChange={handleCodeChange}
                        options={{
                            fontSize: 14,
                            autoClosingTags: true,
                            autoClosingBrackets: 'always',
                            suggestOnTriggerCharacters: true,
                            wordBasedSuggestions: false,
                            quickSuggestions: true,
                            tabCompletion: 'on',
                        }}
                        onMount={(editor, monaco) => {
                            editor.onDidChangeCursorPosition((e) => {
                                if (selectedFileRef.current) {
                                    socket.emit("cursor-move", {
                                        roomId: roomId,
                                        fileId: selectedFileRef.current._id,
                                        position: {
                                            lineNumber: e.position.lineNumber,
                                            column: e.position.column,
                                        }
                                    });
                                }
                            });

                            editorRef.current = editor;
                        }}
                    />

                    {/* Floating Run Button */}
                    <Button
                        onClick={handleRunCode}
                        variant="contained"
                        size="small"
                        sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            zIndex: 10,
                            fontSize: "0.75rem",
                            textTransform: "none",
                            padding: "4px 10px",
                            backgroundColor: "#007acc",
                            '&:hover': { backgroundColor: "#005fa3" }
                        }}
                    >
                        ▶ Run
                    </Button>
                    <IconButton
                        onClick={() => setShowChat((prev) => !prev)}
                        sx={{
                            position: "absolute",
                            bottom: 10,
                            right: 10,
                            zIndex: 15,
                            backgroundColor: "#333",
                            color: "#fff",
                            '&:hover': { backgroundColor: "#555" },
                        }}
                    >
                        <ChatIcon />
                    </IconButton>

                </Box>
                {/* Resizer Handle */}
                <Box
                    ref={resizerRef}
                    sx={{
                        width: '5px',
                        cursor: 'col-resize',
                        backgroundColor: '#333',
                        zIndex: 20,
                    }}
                />
                {showChat && (
                    <Box
                        sx={{
                            width: `${chatWidth}px`,
                            backgroundColor: '#1e1e1e',
                            padding: 2,
                            display: 'flex',
                            flexDirection: 'column',
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Chat
                        </Typography>
                        {/* <Box sx={{ flexGrow: 1, overflowY: "auto" }}>
                            Add chat messages here
                            <Typography variant="body2" sx={{ color: "#ccc" }}>Chat messages go here...</Typography>
                        </Box>
                        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                            <TextField
                                variant="outlined"
                                size="small"
                                fullWidth
                                placeholder="Type a message..."
                                sx={{
                                    backgroundColor: "#2a2a2a",
                                    input: { color: "#fff" },
                                }}
                            />
                            <Button variant="contained" sx={{ backgroundColor: "#007acc" }}>
                                Send
                            </Button>
                        </Box>
                        
                    </Box> */}
                        {/* Messages container */}
                        <Box
                            sx={{
                                flexGrow: 1,
                                overflowY: "auto",
                                display: "flex",
                                flexDirection: "column",
                                gap: 1,
                            }}
                        >
                            {messages.map((msg, idx) => {
                                const isSender = msg.user._id === user._id;
                                return (
                                    <Box
                                        key={idx}
                                        sx={{
                                            display: "flex",
                                            justifyContent: isSender ? "flex-end" : "flex-start",
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                maxWidth: "70%",
                                                bgcolor: isSender ? "#007acc" : "#333",
                                                color: "#fff",
                                                px: 2,
                                                py: 1,
                                                borderRadius: 2,
                                            }}
                                        >
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                {msg.user.name}
                                            </Typography>
                                            <Typography variant="body2">
                                                {msg.text}
                                            </Typography>
                                        </Box>
                                    </Box>
                                );
                            })}
                        </Box>

                        {/* Input box */}
                        <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                            <TextField
                                variant="outlined"
                                size="small"
                                fullWidth
                                value={text}
                                onChange={(e) => setText(e.target.value)}
                                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                                placeholder="Type a message..."
                                sx={{
                                    backgroundColor: "#2a2a2a",
                                    input: { color: "#fff" },
                                }}
                            />
                            <Button variant="contained" onClick={sendMessage} sx={{ backgroundColor: "#007acc" }}>
                                Send
                            </Button>
                        </Box>
                    </Box>
                )}

                {/* Output Panel */}
                {showOutput && (
                    <Box
                        sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            backgroundColor: "#1e1e1e",
                            color: "#d4d4d4",
                            fontFamily: "monospace",
                            fontSize: "0.95rem",
                            padding: "1rem",
                            borderRadius: "6px",
                            boxShadow: "inset 0 0 8px rgba(0,0,0,0.5)",
                            border: "1px solid #333",
                            zIndex: 20, // Ensure the output panel overlaps the editor
                            overflowY: "auto",
                            height: outputHeight,  // Dynamically control the height
                            transition: "height 0.3s ease-in-out",  // Smooth transition for resizing
                        }}
                        className="output-terminal"  // Add this class to apply the scrollbar styles
                    >
                        {/* Close Button */}
                        <IconButton
                            size="small"
                            onClick={() => setShowOutput(false)}
                            sx={{
                                position: "absolute",
                                top: 5,
                                right: 5,
                                color: "#888",
                                '&:hover': { color: "#f44336" }
                            }}
                        >
                            ✖
                        </IconButton>

                        {/* Output content */}
                        <Typography variant="subtitle2" sx={{ color: "#ccc", mb: 1 }}>
                            Terminal Output
                        </Typography>

                        <pre style={{ margin: 0, whiteSpace: "pre-wrap" }}>
                            {output || "▶ Output will appear here..."}
                        </pre>

                        {/* Resize Handle */}
                        <Box
                            sx={{
                                position: "absolute",
                                bottom: 0,
                                left: 0,
                                right: 0,
                                height: "10px",
                                cursor: "ns-resize",
                                backgroundColor: "#333",
                            }}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                window.addEventListener('mousemove', handleResize);
                                window.addEventListener('mouseup', () => {
                                    window.removeEventListener('mousemove', handleResize);
                                });
                            }}
                        />
                    </Box>
                )}
            </Box>
        </Box>
    );

}