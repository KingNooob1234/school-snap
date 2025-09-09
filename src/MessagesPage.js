import React from "react";
import Chat from "./chat";

export default function MessagesPage() {
  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #FFFC00 0%, #FFD600 100%)" }}>
      <Chat />
    </div>
  );
}
