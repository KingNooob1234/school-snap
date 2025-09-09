import React, { useState, useEffect } from "react";
import Reels from "./Reels";
import MessagesPage from "./MessagesPage";
import FindFriends from "./FindFriends";

const LOCAL_USERS_KEY = "ss-users"; // store registered users
const LOCAL_SNAPS_KEY = "ss-snaps"; // store snaps
const LOCAL_FRIENDS_KEY = "ss-friends"; // store friends per user

function App() {
  const [username, setUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [friends, setFriends] = useState([]);
  const [snaps, setSnaps] = useState([]);
  const [newSnapText, setNewSnapText] = useState("");
  const [newSnapImage, setNewSnapImage] = useState(null);
  const [friendToAdd, setFriendToAdd] = useState("");
  const [page, setPage] = useState("reels");

  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY)) || [];
    setAllUsers(storedUsers);
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;
    const storedFriends = JSON.parse(localStorage.getItem(LOCAL_FRIENDS_KEY)) || {};
    setFriends(storedFriends[username] || []);

    const storedSnaps = JSON.parse(localStorage.getItem(LOCAL_SNAPS_KEY)) || [];
    const visibleSnaps = storedSnaps.filter(
      (snap) => friends.includes(snap.from) || snap.from === username
    );
    setSnaps(visibleSnaps);
  }, [isLoggedIn, username, friends]);

  const handleLogin = () => {
    if (!username.trim()) {
      alert("Please enter a username.");
      return;
    }
    if (!allUsers.includes(username)) {
      const updatedUsers = [...allUsers, username];
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updatedUsers));
      setAllUsers(updatedUsers);
    }
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setFriends([]);
    setSnaps([]);
    setNewSnapText("");
    setNewSnapImage(null);
  };

  const addFriend = () => {
    const friend = friendToAdd.trim();
    if (!friend) return alert("Enter a friend's username to add.");
    if (friend === username) return alert("You can't add yourself.");
    if (!allUsers.includes(friend)) return alert("User not found.");
    if (friends.includes(friend)) return alert("Already friends.");

    const updatedFriends = [...friends, friend];
    setFriends(updatedFriends);

    const storedFriends = JSON.parse(localStorage.getItem(LOCAL_FRIENDS_KEY)) || {};
    storedFriends[username] = updatedFriends;
    localStorage.setItem(LOCAL_FRIENDS_KEY, JSON.stringify(storedFriends));
    setFriendToAdd("");
    alert(`Added ${friend} as a friend!`);
  };

  const removeFriend = (f) => {
    if (!window.confirm(`Remove ${f} from your friends?`)) return;
    const updatedFriends = friends.filter((fr) => fr !== f);
    setFriends(updatedFriends);

    const storedFriends = JSON.parse(localStorage.getItem(LOCAL_FRIENDS_KEY)) || {};
    storedFriends[username] = updatedFriends;
    localStorage.setItem(LOCAL_FRIENDS_KEY, JSON.stringify(storedFriends));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewSnapImage(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const sendSnap = () => {
    if (!newSnapText.trim() && !newSnapImage) {
      alert("Add a message or an image to send a snap.");
      return;
    }
    const snap = {
      id: Date.now(),
      from: username,
      text: newSnapText.trim(),
      image: newSnapImage,
      timestamp: new Date().toISOString(),
    };

    const storedSnaps = JSON.parse(localStorage.getItem(LOCAL_SNAPS_KEY)) || [];
    storedSnaps.push(snap);
    localStorage.setItem(LOCAL_SNAPS_KEY, JSON.stringify(storedSnaps));

    setSnaps((prev) => [...prev, snap]);

    setNewSnapText("");
    setNewSnapImage(null);
    alert("Snap sent!");
  };

  const deleteSnap = (id) => {
    if (!window.confirm("Delete this snap?")) return;
    let storedSnaps = JSON.parse(localStorage.getItem(LOCAL_SNAPS_KEY)) || [];
    storedSnaps = storedSnaps.filter((s) => s.id !== id);
    localStorage.setItem(LOCAL_SNAPS_KEY, JSON.stringify(storedSnaps));
    setSnaps(snaps.filter((s) => s.id !== id));
  };

  return (
    <>
      <style>{`
        * {
          box-sizing: border-box;
        }
        body, html, #root {
          margin: 0; padding: 0; height: 100%;
          background-color: #121212;
          color: #ddd;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        .App {
          max-width: 800px;
          margin: 2rem auto;
          padding: 1rem 2rem;
          background: #1e1e1e;
          border-radius: 12px;
          box-shadow: 0 0 20px #8a2be2aa;
        }
        h1 {
          color: #8a2be2;
          text-align: center;
          margin-bottom: 1.5rem;
          text-shadow: 0 0 8px #8a2be2aa;
        }
        input[type="text"], input[type="file"], textarea {
          background: #222;
          border: 2px solid #8a2be2;
          color: #eee;
          padding: 8px 10px;
          border-radius: 8px;
          width: 100%;
          margin-bottom: 0.8rem;
          font-size: 1rem;
          transition: border-color 0.3s ease;
        }
        input[type="text"]:focus, textarea:focus {
          outline: none;
          border-color: #b499f7;
          background: #2c2c2c;
        }
        button {
          background-color: #8a2be2;
          border: none;
          padding: 10px 20px;
          color: white;
          font-weight: 600;
          font-size: 1rem;
          border-radius: 8px;
          cursor: pointer;
          transition: background-color 0.3s ease;
          margin-top: 0.5rem;
        }
        button:hover {
          background-color: #b499f7;
        }
        .login, .friends-section, .send-snap-section, .snaps-section {
          margin-bottom: 2rem;
          padding: 1rem;
          background: #2a2a2a;
          border-radius: 12px;
          box-shadow: 0 0 10px #8a2be2aa;
        }
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 1rem;
          background: #321f7c;
          border-radius: 12px;
          margin-bottom: 1.5rem;
          color: #eee;
          box-shadow: 0 0 15px #8a2be2cc;
        }
        .header b {
          color: #d4bbff;
        }
        .user-list {
          list-style: none;
          padding-left: 1rem;
          max-height: 150px;
          overflow-y: auto;
          color: #aaa;
          font-size: 0.9rem;
        }
        .user-list li {
          padding: 2px 0;
          border-bottom: 1px solid #444;
        }
        ul {
          list-style: none;
          padding-left: 0;
        }
        .friends-section ul li {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: #3a2d5f;
          margin-bottom: 0.5rem;
          padding: 0.5rem 1rem;
          border-radius: 8px;
          box-shadow: 0 0 6px #6e55c7aa;
          color: #ddd;
        }
        .remove-btn {
          background: #5c0066;
          color: #f5a6ff;
          border: none;
          padding: 5px 10px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9rem;
          transition: background-color 0.3s ease;
        }
        .remove-btn:hover {
          background: #8a2be2;
          color: white;
        }
        textarea {
          resize: vertical;
        }
        .preview {
          margin-bottom: 0.5rem;
          position: relative;
        }
        .preview img {
          max-width: 100%;
          border-radius: 10px;
          box-shadow: 0 0 10px #8a2be2cc;
        }
        .preview button {
          position: absolute;
          top: 8px;
          right: 8px;
          background: rgba(255,255,255,0.15);
          color: #fff;
          padding: 4px 8px;
          font-size: 0.8rem;
          border-radius: 6px;
          box-shadow: none;
        }
        .preview button:hover {
          background: rgba(255,255,255,0.3);
        }
        .snaps-list {
          max-height: 300px;
          overflow-y: auto;
          padding-right: 10px;
        }
        .snap {
          background: #321f7c;
          margin-bottom: 1rem;
          padding: 1rem;
          border-radius: 12px;
          box-shadow: 0 0 15px #8a2be2cc;
          color: #e0d9ff;
          word-wrap: break-word;
        }
        .snap b {
          font-size: 1.1rem;
          color: #d4bbff;
        }
        .time {
          font-size: 0.8rem;
          color: #bfb6e9;
          margin-left: 0.6rem;
        }
        .snap-image {
          margin-top: 0.8rem;
          max-width: 100%;
          border-radius: 10px;
          box-shadow: 0 0 15px #b499f7cc;
        }
      `}</style>
      <div className="App">
        <nav style={{ display: "flex", justifyContent: "center", gap: 24, marginBottom: 32 }}>
          <button onClick={() => setPage("reels")}>Reels</button>
          <button onClick={() => setPage("messages")}>Messages</button>
          <button onClick={() => setPage("friends")}>Find Friends</button>
        </nav>
        {page === "reels" && <Reels />}
        {page === "messages" && <MessagesPage />}
        {page === "friends" && <FindFriends />}
      </div>
    </>
  );
}

export default App;
