import React, { useState, useEffect } from "react";

const LOCAL_USERS_KEY = "ss-users";
const LOCAL_FRIENDS_KEY = "ss-friends";

export default function FindFriends() {
  const [allUsers, setAllUsers] = useState([]);
  const [username, setUsername] = useState("");
  const [friends, setFriends] = useState([]);
  const [friendToAdd, setFriendToAdd] = useState("");

  useEffect(() => {
    setAllUsers(JSON.parse(localStorage.getItem(LOCAL_USERS_KEY)) || []);
    setUsername(localStorage.getItem("ss-current-user") || "");
    const storedFriends = JSON.parse(localStorage.getItem(LOCAL_FRIENDS_KEY)) || {};
    setFriends(storedFriends[username] || []);
  }, [username]);

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

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #FFFC00 0%, #FFD600 100%)", padding: 32 }}>
      <h1 style={{ color: "#222", fontWeight: 700 }}>Find Friends</h1>
      <input
        type="text"
        placeholder="Add friend by username"
        value={friendToAdd}
        onChange={e => setFriendToAdd(e.target.value)}
        style={{ padding: 12, borderRadius: 12, border: "2px solid #FFD600", fontSize: 18, marginBottom: 16, width: "100%" }}
      />
      <button onClick={addFriend} style={{ padding: "12px 32px", borderRadius: 12, background: "#FFFC00", color: "#222", fontWeight: 700, border: "2px solid #FFD600", fontSize: 18 }}>Add Friend</button>
      <h2 style={{ marginTop: 32, color: "#222" }}>All Users</h2>
      <ul style={{ listStyle: "none", padding: 0 }}>
        {allUsers.map(u => (
          <li key={u} style={{ padding: "8px 0", color: friends.includes(u) ? "#FFD600" : "#222" }}>
            {u} {friends.includes(u) && <span style={{ fontWeight: 700 }}>(Friend)</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}
