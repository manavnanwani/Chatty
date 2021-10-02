import React from "react";
import singleCheck from "../assets/single-tick.png";
import doubleCheck from "../assets/done_all.svg";
import doubleCheckGreen from "../assets/blue-tick.png";

export default function Message({ message }) {
  const userId = sessionStorage.getItem("userId");
  return (
    <div
      className={`message ${message.sender === userId ? "sent" : "received"}`}
    >
      {message?.message}
      <div className="metadata">
        <span className="date">
          {String(new Date(message?.createdAt).getHours())}:
          {String(new Date(message?.createdAt).getMinutes()).length === 1 &&
            "0"}
          {String(new Date(message?.createdAt).getMinutes())}
        </span>
        {message.sender === userId && message?.status === "Sent" && (
          <img src={singleCheck} alt="" className="icon-small" />
        )}
        {message.sender === userId && message?.status === "Received" && (
          <img src={doubleCheck} alt="" className="icon-small" />
        )}
        {message.sender === userId && message?.status === "Read" && (
          <img src={doubleCheckGreen} alt="" className="icon-small" />
        )}
      </div>
    </div>
  );
}
