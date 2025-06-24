// OutputPanel.js
import React from "react";

export default function OutputPanel() {
  return (
    <div className="h-full overflow-auto">
      <h3 className="text-lg font-semibold mb-2">Output</h3>
      <pre className="bg-black text-green-400 p-2 rounded-lg">
        Console Output:
        Hello World!
      </pre>
    </div>
  );
}