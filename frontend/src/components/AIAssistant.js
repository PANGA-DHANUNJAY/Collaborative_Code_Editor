import React, { useState } from "react";

export default function AIAssistant({ socket }) {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

  const askAI = () => {
    if (prompt.trim()) {
      // Fake response for now
      setResponse("Here's a smart response from AI to: " + prompt);
      setPrompt("");
    }
  };

  return (
    <div className="flex flex-col h-full p-2">
      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Ask the AI assistant..."
        className="w-full h-24 p-2 border border-gray-400 rounded-lg mb-2"
      />
      <button
        onClick={askAI}
        className="bg-purple-500 text-white px-4 py-2 rounded-lg mb-4"
      >
        Ask
      </button>
      <div className="bg-gray-100 p-2 rounded-lg text-sm">
        {response || "AI will respond here..."}
      </div>
    </div>
  );
}