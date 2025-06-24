import React, { useEffect, useState, useRef } from "react";

const ChatSection = ({ socket, roomId, user }) => {
    const [messages, setMessages] = useState([]);
    const [text, setText] = useState("");
    const messagesEndRef = useRef(null);

    useEffect(() => {
        socket.on("chat-message", (message) => {
            setMessages((prev) => [...prev, message]);
        });

        return () => socket.off("chat-message");
    }, []);

    useEffect(() => {
        // Scroll to the latest message when messages change
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const sendMessage = () => {
        if (text.trim()) {
            const message = { user, text, roomId };
            socket.emit("chat-message", message);
            setMessages((prev) => [...prev, message]);
            setText("");
        }
    };

    return (
        <div className="flex flex-col h-full p-4">
            <div className="flex-1 overflow-auto mb-2 space-y-1">
                {messages.map((msg, idx) => {
                    const isOwnMessage = msg.user.id === user.id;
                    return (
                        <div
                            key={idx}
                            className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`px-3 py-2 rounded-lg max-w-xs ${
                                    isOwnMessage
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-black"
                                }`}
                            >
                                {!isOwnMessage && (
                                    <strong className="block mb-1">{msg.user.name}</strong>
                                )}
                                {msg.text}
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex mt-2">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 border rounded px-2 py-1"
                    placeholder="Type a message..."
                />
                <button
                    onClick={sendMessage}
                    className="ml-2 px-3 py-1 bg-blue-500 text-white rounded"
                >
                    Send
                </button>
            </div>
        </div>
    );
};

export default ChatSection;
