import React, { useState, useEffect } from "react";

import { mainUser } from "./generateFakeData";
import Avatar from "./components/Avatar";
import ContactBox from "./components/ContactBox";
import MessagesBox from "./components/MessagesBox";
import ChatInputBox from "./components/ChatInputBox";
import Welcome from "./components/Welcome";
import { useHistory } from "react-router";
import { Switch, Link } from "react-router-dom";

import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import { firestore, database } from "./Firebase/index";

function App() {
  const [contactSelected, setContactSelected] = useState({});
  const userId = sessionStorage.getItem("userId");
  const [recall, setRecall] = useState("");
  const [users, setUsers] = useState([]);
  const history = useHistory();

  useEffect(() => {
    const id = sessionStorage.getItem("userId");
    if (id === null) history.push("/login");
    // eslint-disable-next-line
  }, [history]);

  useEffect(() => {
    getUsers();
    updateStatus();
    const interval = setInterval(() => {
      updateStatus();
    }, 2000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [recall]);

  const getUsers = async () => {
    firestore
      .collection("Users")
      .get()
      .then(async (querySnapshot) => {
        const userData = [];
        querySnapshot.forEach((doc) => {
          userData.push({ ...doc.data(), id: doc.id });
        });
        setUsers(userData.filter((u) => u.id !== userId));
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
    updateStatus();
  };

  const updateStatus = () => {
    const id = sessionStorage.getItem("userId");
    const dbRef = database.ref();
    dbRef
      .child("chat")
      .get()
      .then((snapshot) => {
        if (snapshot.exists()) {
          for (let key in snapshot.val()) {
            if (key.includes(id)) {
              console.log(id);
              let temp = snapshot.val()[key][id];
              for (let key in temp) {
                if (temp[key].status === "Sent") temp[key].status = "Received";
              }
              if (temp !== undefined) {
                var updates = {};
                updates[`/chat/${key}/${id}`] = temp;
                database.ref().update(updates);
              }
            }
          }
        } else {
          // console.log("No Messages");
        }
      });
  };

  const MainApp = () => {
    return (
      <div className="app">
        <aside>
          <header>
            <Avatar user={mainUser} />
          </header>
          <div className="contact-boxes">
            {users.map((user) => (
              <ContactBox
                contact={user}
                key={user.id}
                setContactSelected={setContactSelected}
              />
            ))}
          </div>
        </aside>
        {contactSelected.id ? (
          <main>
            <header>
              <Avatar user={contactSelected} />
            </header>
            <MessagesBox contact={contactSelected.id} />
            <ChatInputBox
              userId={userId}
              contactSelected={contactSelected.id}
              setRecall={setRecall}
            />
          </main>
        ) : (
          <Welcome />
        )}
      </div>
    );
  };

  return (
    <>
      <Switch>
        <Link exact path="/login" component={Login} />
        <Link exact path="/register" component={Register} />
        <Link exact path="/" component={MainApp} />
      </Switch>
    </>
  );
}

export default App;
