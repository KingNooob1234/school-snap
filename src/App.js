import React, { useState, useEffect } from "react";

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

  // Load users from localStorage
  useEffect(() => {
    const storedUsers = JSON.parse(localStorage.getItem(LOCAL_USERS_KEY)) || [];
    setAllUsers(storedUsers);
  }, []);

  // Load logged-in user data
  useEffect(() => {
    if (!isLoggedIn) return;
    const storedFriends = JSON.parse(localStorage.getItem(LOCAL_FRIENDS_KEY)) || {};
    setFriends(storedFriends[username] || []);

    const storedSnaps = JSON.parse(localStorage.getItem(LOCAL_SNAPS_KEY)) || [];
    // Snaps sent by friends (or user themselves)
    const visibleSnaps = storedSnaps.filter(
      (snap) => friends.includes(snap.from) || snap.from === username
    );
    setSnaps(visibleSnaps);
  }, [isLoggedIn, username, friends]);

  // Login or register user
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

  // Logout
  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername("");
    setFriends([]);
    setSnaps([]);
    setNewSnapText("");
    setNewSnapImage(null);
  };

  // Add friend
  const addFriend = () => {
    const friend = friendToAdd.trim();
    if (!friend) return alert("Enter a friend's username to add.");
    if (friend === username) return alert("You can't add yourself.");
    if (!allUsers.includes(friend)) return alert("User not found.");
    if (friends.includes(friend)) return alert("Already friends.");

    const updatedFriends = [...friends, friend];
    setFriends(updatedFriends);

    // Save friends list to localStorage
    const storedFriends = JSON.parse(localStorage.getItem(LOCAL_FRIENDS_KEY)) || {};
    storedFriends[username] = updatedFriends;
    localStorage.setItem(LOCAL_FRIENDS_KEY, JSON.stringify(storedFriends));
    setFriendToAdd("");
    alert(`Added ${friend} as a friend!`);
  };

  // Remove friend
  const removeFriend = (f) => {
    if (!window.confirm(`Remove ${f} from your friends?`)) return;
    const updatedFriends = friends.filter((fr) => fr !== f);
    setFriends(updatedFriends);

    const storedFriends = JSON.parse(localStorage.getItem(LOCAL_FRIENDS_KEY)) || {};
    storedFriends[username] = updatedFriends;
    localStorage.setItem(LOCAL_FRIENDS_KEY, JSON.stringify(storedFriends));
  };

  // Handle snap image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewSnapImage(reader.result); // base64 encoded image
    };
    reader.readAsDataURL(file);
  };

  // Send a snap
  const sendSnap = () => {
    if (!newSnapText.trim() && !newSnapImage) {
      alert("Add a message or an image to send a snap.");
      return;
    }
    // Create snap object
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

    // Update snaps visible (since user sent one)
    setSnaps((prev) => [...prev, snap]);

    // Reset input
    setNewSnapText("");
    setNewSnapImage(null);
    alert("Snap sent!");
  };

  // Delete a snap (only your own snaps)
  const deleteSnap = (id) => {
    if (!window.confirm("Delete this snap?")) return;
    let storedSnaps = JSON.parse(localStorage.getItem(LOCAL_SNAPS_KEY)) || [];
    storedSnaps = storedSnaps.filter((s) => s.id !== id);
    localStorage.setItem(LOCAL_SNAPS_KEY, JSON.stringify(storedSnaps));
    setSnaps(snaps.filter((s) => s.id !== id));
  };

  return (
    <div className="App">
      <h1>SchoolSnap (LocalStorage Edition)</h1>
      {!isLoggedIn ? (
        <div className="login">
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value.trim())}
          />
          <button onClick={handleLogin}>Sign In / Register</button>
          {allUsers.length > 0 && (
            <>
              <p>Existing users:</p>
              <ul className="user-list">
                {allUsers.map((u) => (
                  <li key={u}>{u}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="header">
            <p>Welcome, <b>{username}</b>!</p>
            <button onClick={handleLogout}>Logout</button>
          </div>

          <div className="friends-section">
            <h2>Your Friends</h2>
            {friends.length === 0 ? (
              <p>No friends yet. Add someone!</p>
            ) : (
              <ul>
                {friends.map((f) => (
                  <li key={f}>
                    {f}{" "}
                    <button className="remove-btn" onClick={() => removeFriend(f)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <input
              type="text"
              placeholder="Add friend by username"
              value={friendToAdd}
              onChange={(e) => setFriendToAdd(e.target.value.trim())}
            />
            <button onClick={addFriend}>Add Friend</button>
          </div>

          <div className="send-snap-section">
            <h2>Send a Snap</h2>
            <textarea
              rows={3}
              placeholder="Write a message (optional)"
              value={newSnapText}
              onChange={(e) => setNewSnapText(e.target.value)}
            />
            <input type="file" accept="image/*" onChange={handleImageUpload} />
            {newSnapImage && (
              <div className="preview">
                <img src={newSnapImage} alt="Preview" />
                <button onClick={() => setNewSnapImage(null)}>Remove Image</button>
              </div>
            )}
            <button onClick={sendSnap}>Send Snap</button>
          </div>

          <div className="snaps-section">
            <h2>Snaps from Friends and You</h2>
            {snaps.length === 0 ? (
              <p>No snaps yet.</p>
            ) : (
              <ul className="snaps-list">
                {snaps
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .map((snap) => (
                    <li key={snap.id} className="snap">
                      <div>
                        <b>{snap.from}</b>{" "}
                        <span className="time">
                          {new Date(snap.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {snap.text && <p>{snap.text}</p>}
                      {snap.image && (
                        <img
                          src={snap.image}
                          alt="snap"
                          className="snap-image"
                        />
                      )}
                      {snap.from === username && (
                        <button
                          className="remove-btn"
                          onClick={() => deleteSnap(snap.id)}
                        >
                          Delete
                        </button>
                      )}
                    </li>
                  ))}
              </ul>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default App;

