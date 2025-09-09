import React from "react";

export default function Reels() {
  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: "linear-gradient(180deg, #FFFC00 0%, #FFD600 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      flexDirection: "column",
    }}>
      <img src="https://upload.wikimedia.org/wikipedia/en/thumb/c/c4/Snapchat_logo.svg/1200px-Snapchat_logo.svg.png" alt="Snapchat" style={{ width: 80, marginBottom: 24 }} />
      <h1 style={{ fontSize: 48, color: "#222", fontWeight: 700 }}>Reels</h1>
      <p style={{ color: "#222", fontSize: 20 }}>Your full screen stories will appear here.</p>
      {/* TODO: Add reels/stories content here */}
    </div>
  );
}
