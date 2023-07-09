import React from "react";
import { firebase, auth } from "./firebase";
import "./SignIn.css";

export function SignIn() {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    auth.signInWithPopup(provider);
  };
  const signInAnonymously = () => {
    auth.signInAnonymously();
  };
  return (
    <div className="login-cont">
      <button className="signin-btn" onClick={signInWithGoogle}>
        Sign in with Google
      </button>
      <button className="signin-btn" onClick={signInAnonymously}>
        Sign in with Anonymously
      </button>
    </div>
  );
}

