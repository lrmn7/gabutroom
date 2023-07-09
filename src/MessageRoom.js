import "./MessageRoom.css";
import React, { useState, useRef, useEffect } from "react";
import { firestore, auth, firebase, storage } from "./firebase";
import { useCollectionData } from "react-firebase-hooks/firestore";

const DBmessages = firestore.collection("messages");
const query = DBmessages.orderBy("timestamp", "desc").limit(50);
console.log(query);
const converter = {
  fromFirestore(snapshot, options) {
    const data = snapshot.data(options);
    return {
      text: data.text,
      displayName: data.displayName,
      timestamp: data.timestamp,
      uid: data.uid,
      photoURL: data.photoURL,
      downloadURL: data.downloadURL,
      id: snapshot.id,
    };
  },
};

const imagesRef = storage.ref();

export default function MessageRoom() {
  const [messages] = useCollectionData(query.withConverter(converter));
  const scrolldiv = useRef();
  const imageInput = useRef();
  const [formValue, setFormValue] = useState("");
  const uid = auth.currentUser.uid;
  const photoURL =
    auth.currentUser.photoURL ||
    `https://avatars.dicebear.com/api/human/${uid}.svg`; //HTTP-API, creates unique avatar

  const scrollToBottom = () => {
    scrolldiv.current.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);
const videosRef = storage.ref();

  const imageHandler = async (e) => {
    const file = e.target.files[0];
  
    if (file.type.includes('video')) {
      // Handle video upload
      const uploadTask = videosRef.child("videos/" + file.name).put(file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        async () => {
          let URL = await videosRef.child("videos/" + file.name).getDownloadURL();
          DBmessages.add({
            text: "", // Teks dikosongkan untuk video
            displayName: displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            uid: uid,
            photoURL: photoURL,
            downloadURL: URL,
          });
        }
      );
    } else {
      // Handle image upload
      const uploadTask = imagesRef.child("images/" + file.name).put(file);
      uploadTask.on(
        "state_changed",
        (snapshot) => {},
        (error) => {
          console.log(error);
        },
        async () => {
          let URL = await imagesRef.child("images/" + file.name).getDownloadURL();
          DBmessages.add({
            text: "",
            displayName: displayName,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            uid: uid,
            photoURL: photoURL,
            downloadURL: URL,
          });
        }
      );
    }
  };
  
  const sendMessageToDB = async (e) => {
    //specifically sends text messages
    e.preventDefault();
    if (formValue.trim() === "") {
      //no whitespace-only messages
      return;
    }
    await DBmessages.add({
      text: formValue,
      displayName: displayName,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      uid: uid,
      photoURL: photoURL,
    });
    setFormValue("");
    scrollToBottom();
  };

  const formatDate = (timestamp) => {
    const date = timestamp.toDate();
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes();

    return `${day} ${month} ${year}, ${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const Message = (props) => {
    const { text, displayName, timestamp, uid, photoURL, downloadURL } =
      props.message;
    const scroll = props.scroll;

    const formattedDate = timestamp ? formatDate(timestamp) : "just now";
    const imgDisplay = downloadURL ? {} : { display: "none" };

    return (
      <div
        className={
          uid === auth.currentUser.uid ? "sent message" : "received message"
        }
      >
        <img className="image" src={photoURL} alt="" />
        <div className="details">
          <p className="name">{displayName}</p>
          <p className="txt">{text}</p>
          <img
            className="photo"
            src={downloadURL}
            alt=""
            style={imgDisplay}
            onLoad={scroll}
          />
          <p className="date">{formattedDate}</p>
        </div>
      </div>
    );
  };

  const displayName = auth.currentUser.displayName || "Anonymous user";

  return (
    <>
      <section className="message-container">
        {messages &&
          messages.map((message, index, messages) => (
            <Message
              key={messages[messages.length - 1 - index].id}
              message={messages[messages.length - 1 - index]}
              scroll={() => scrollToBottom()}
            />
          ))}
        <div ref={scrolldiv}></div>
      </section>
      <div>
        <form className="message-form" onSubmit={sendMessageToDB}>
          <input
            className="text-input"
            value={formValue}
            placeholder={"Sent Message"}
            onChange={(e) => setFormValue(e.target.value)}
          />
          <input
            type="file"
            ref={imageInput}
            style={{ display: "none" }}
            onChange={imageHandler}
          />
          <button className="send-button" type="submit">
            <img src="https://img.icons8.com/dusk/344/sent.png" alt=""></img>
          </button>
          <button
            className="send-button"
            onClick={(e) => {
              e.preventDefault();
              imageInput.current.click();
            }}
          >
            <img
              alt=""
              src="https://img.icons8.com/external-obvious-flat-kerismaker/344/external-attachment-office-stationery-flat-obvious-flat-kerismaker.png"
            ></img>
          </button>
        </form>
      </div>
    </>
  );
}
