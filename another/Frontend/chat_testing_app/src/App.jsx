import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

const socket = io("http://localhost:3010"); // Backend URL

function App() {
  const roomId = "shipper@example.com-receiver123";
  const loadId = "63e5f2cdd7844e3dc19e7b92";
  const sender = "shipper@example.com";
  const receiver = "receiver123";

  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socket.emit("join-room", roomId);

    socket.on("newMessage", (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      socket.off("newMessage");
    };
  }, [roomId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const messageData = { loadId, roomId, sender, receiver, message: newMessage };

    console.log({messageData})

    socket.emit("add-new-message", messageData, (response) => {
      console.log({response})
      if (response.status === "success") {
        setNewMessage("");
      } else {
        alert(response.message);
      }
    });
  };

  return (
    <div className="App">
      <h3>Chat Room: {roomId}</h3>

      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender === sender ? "own" : ""}`}>
            <strong>{msg.sender}:</strong> {msg.message}
            <span className="timestamp">{new Date(msg.timestamp).toLocaleTimeString()}</span>
          </div>
        ))}
      </div>

      <div className="input">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type a message"
        />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default App;