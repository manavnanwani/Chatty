import React, { useState } from "react";
import emojiIcon from "../assets/tag_faces.svg";
import micIcon from "../assets/mic.svg";
import sendIcon from "../assets/send.svg";
import { v4 as uuid } from "uuid";
import { database } from "../Firebase/index";

export default function ChatInputBox({ userId, contactSelected, setRecall }) {
  const [message, setMessage] = useState("");
  function handleKeyDown(e) {
    if (e.key === "Enter" && message) {
      pushMessage();
    }
  }

  const pushMessage = () => {
    if (message !== "") {
      const id =
        userId > contactSelected
          ? `${userId}${contactSelected}`
          : `${contactSelected}${userId}`;
      var updates = {};
      const uniqueId = uuid();
      const dateNow = Date.now();
      updates[`/chat/${id}/${contactSelected}/${dateNow}`] = {
        sender: userId,
        receiver: contactSelected,
        message: message,
        createdAt: dateNow,
        status: "Sent",
        id: uniqueId,
      };
      setMessage("");
      setRecall(uuid());
      return database.ref().update(updates);
    }
  };

  return (
    <div className="chat-input-box">
      <div className="icon emoji-selector">
        <img src={emojiIcon} alt="" />
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="icon send" onClick={pushMessage}>
        <img src={message ? sendIcon : micIcon} alt="" />
      </div>
    </div>
  );
}
