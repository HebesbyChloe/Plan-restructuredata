"use client";

import { useState } from "react";

export default function MinimalApp() {
  const [currentCategory, setCurrentCategory] = useState("Home");

  return (
    <div className="min-h-screen bg-background p-8">
      <h1 className="text-2xl font-bold mb-4">Minimal App Test</h1>
      <p>If you see this, basic App structure works!</p>
      <p>Current Category: {currentCategory}</p>
      <button 
        onClick={() => setCurrentCategory("Marketing")}
        className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded"
      >
        Change Category
      </button>
    </div>
  );
}

