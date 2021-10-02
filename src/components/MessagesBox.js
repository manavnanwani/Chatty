import React, { useRef, useEffect, useState } from "react";
import Message from "./Message";
import { database } from "../Firebase/index";

export default function MessagesBox({ contact }) {
  const endDiv = useRef(null);
  const [sentMessages, setSentMessages] = useState({});
  const [rMessages, setRMessages] = useState({});
  const [messagesArray, setMessagesArray] = useState([]);
  const userId = sessionStorage.getItem("userId");

  useEffect(() => {
    endDiv.current.scrollIntoView();
  }, [messagesArray]);

  useEffect(() => {
    getMessages();
    updateStatus();
    const interval = setInterval(() => {
      getMessages();
      updateStatus();
    }, 2000);
    return () => clearInterval(interval);
    // recallMessages();
    // eslint-disable-next-line
  }, []);

  const updateStatus = () => {
    const dbRef = database.ref();
    const id = userId > contact ? `${userId}${contact}` : `${contact}${userId}`;
    dbRef
      .child("chat")
      .child(id)
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          let temp = snapshot.val()[userId];
          for (let key in temp) {
            // if (temp[key].status === "Received")
            temp[key].status = "Read";
          }
          var updates = {};
          updates[`/chat/${id}/${userId}`] = temp || {};
          database.ref().update(updates);
        } else {
          // console.log("No Messages");
        }
      });
  };

  useEffect(() => {
    let data = [];
    for (let key in sentMessages) {
      data.push(sentMessages[key]);
    }
    for (let key in rMessages) {
      data.push(rMessages[key]);
    }
    setMessagesArray(data);
  }, [sentMessages, rMessages]);

  const getMessages = () => {
    const id = userId > contact ? `${userId}${contact}` : `${contact}${userId}`;
    const dbRef = database.ref();
    dbRef
      .child("chat")
      .child(id)
      .child(contact)
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
    updateStatus();
  };

  return (
    <div className="chats">
      {messagesArray
        .sort((a, b) => a.createdAt - b.createdAt)
        .map((m) => (
          <Message message={m} key={m.id} />
        ))}

      <div style={{ float: "right", clear: "both" }} ref={endDiv}></div>
    </div>
  );
}
