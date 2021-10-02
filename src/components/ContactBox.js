import React, { useState, useEffect } from "react";
import singleCheck from "../assets/single-tick.png";
import doubleCheck from "../assets/done_all.svg";
import doubleCheckGreen from "../assets/blue-tick.png";
import Avatar from "./Avatar";
import { database } from "../Firebase/index";

export default function ContactBox({ contact, setContactSelected }) {
  function truncate(text, length) {
    return text?.length > length ? `${text?.substring(0, length)} ...` : text;
  }
  const userId = sessionStorage.getItem("userId");
  const setRoom = async () => {
    const id =
      userId > contact.id ? `${userId}${contact.id}` : `${contact.id}${userId}`;

    const dbRef = database.ref();
    await dbRef
      .child("chat")
      .child(id)
      .get()
      .then(async (snapshot) => {
        if (snapshot.exists()) {
        } else {
          await database
            .ref(`/chat/${id}`)
            .set({
              id: id,
              createdAt: Date.now(),
            })
            .then(() => {})
            .catch((err) => console.log(err));
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const [lastMessage, setLastMessage] = useState("");
  const [sentMessages, setSentMessages] = useState({});
  const [rMessages, setRMessages] = useState({});

  useEffect(() => {
    getMessages();
    const interval = setInterval(() => {
      getMessages();
    }, 2000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    let data = [];
    for (let key in sentMessages) {
      data.push(sentMessages[key]);
    }
    for (let key in rMessages) {
      data.push(rMessages[key]);
    }
    data = data.sort((a, b) => a.createdAt - b.createdAt);
    setLastMessage(data[data.length - 1]);
  }, [sentMessages, rMessages]);

  const getMessages = () => {
    const id =
      userId > contact.id ? `${userId}${contact.id}` : `${contact.id}${userId}`;
    const dbRef = database.ref();
    dbRef
      .child("chat")
      .child(id)
      .child(contact.id)
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          setSentMessages(snapshot.val());
        } else {
          // console.log("No Messages");
        }
      });
    dbRef
      .child("chat")
      .child(id)
      .child(userId)
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          setRMessages(snapshot.val());
        } else {
          // console.log("No Messages");
        }
      });
  };

  return (
    <div
      className="contact-box"
      onClick={() => {
        setRoom();
        setContactSelected(contact);
      }}
    >
      <Avatar user={contact} />
      <div className="right-section">
        <div className="contact-box-header">
          <h3 className="avatar-title">{contact.name}</h3>
          <span className="time-mark">
            {String(new Date(lastMessage?.createdAt).getHours())}:
            {String(new Date(lastMessage?.createdAt).getMinutes()).length ===
              1 && "0"}
            {String(new Date(lastMessage?.createdAt).getMinutes())}
          </span>
        </div>
        <div className="last-msg">
          &nbsp;&nbsp;&nbsp;
          {lastMessage?.sender === userId && lastMessage?.status === "Sent" && (
            <img src={singleCheck} alt="" className="icon-small" />
          )}
          {lastMessage?.sender === userId &&
            lastMessage?.status === "Received" && (
              <img src={doubleCheck} alt="" className="icon-small" />
            )}
          {lastMessage?.sender === userId && lastMessage?.status === "Read" && (
            <img src={doubleCheckGreen} alt="" className="icon-small" />
          )}
          <span className="text">{truncate(lastMessage?.message, 30)}</span>
        </div>
      </div>
    </div>
  );
}
