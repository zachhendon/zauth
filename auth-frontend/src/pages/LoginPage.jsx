import "./LoginPage.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [checkEmailError, setCheckEmailError] = useState(false);
  const [checkPasswordError, setCheckPasswordError] = useState(false);
  const [redirectUri, setRedirectUri] = useState("/")

  useEffect(() => {
    const url = new URL(window.location.href);
    const params = new URLSearchParams(url.search);
    setRedirectUri(params.get("redirect_uri"));
  }, [])


  function dec2hex(dec) {
    return ("00" + dec.toString(16)).slice(-2);
  }

  function getCodeVerifier() {
    const array = new Uint8Array(32);
    window.crypto.getRandomValues(array);
    const code = Array.from(array, dec2hex).join("");
    return code;
  }

  async function getCodeChallenge(codeVerifier) {
    const encoder = new TextEncoder();
    const data = encoder.encode(codeVerifier);
    const shaHash = await window.crypto.subtle.digest("SHA-256", data);
    const shaHashArray = Array.from(new Uint8Array(shaHash));
    const hashHex = shaHashArray.map(dec2hex).join("");
    return btoa(hashHex);
  }

  async function getAuthCode(email, password) {
    const codeVerifier = getCodeVerifier();
    const codeChallenge = await getCodeChallenge(codeVerifier);

    try {
      const res = await axios.post(`https://localhost:4000/user`, {
        email,
        password,
        code_challenge: codeChallenge,
        code_challenge_method: "S256",
        client_id: import.meta.env.VITE_CLIENT_ID,
        redirect_uri: redirectUri,
      });
      return res.data.authCode;
    } catch (err) {
      console.log(err);
      if (!err.response) {
        // TODO: handle generic error
        alert("Could not connect to server. Please try again later.");
      } else if (err.response.status === 400) {
        alert(err.response.data.error_description);
      } else if (err.response.status === 401) {
        setPasswordError("Incorrect password");
      } else if (err.response.status === 404) {
        setEmailError("This email is not registered");
      } else {
        alert("An unexpected error occurred. Please try again later.");
      }
      return null;
    }
  }

  function verifyPassword(user) {
    // TODO: hashing
    const userPassword = user.password;
    if (userPassword === password) {
      return true;
    } else {
      setPasswordError("Incorrect password");
      return false;
    }
  }

  function updateEmailError(email) {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailRegex.test(email)) {
      if (!email) {
        setEmailError("Please enter your email");
        return true;
      } else {
        setEmailError(`Invalid email`);
        return true;
      }
    } else {
      setEmailError("");
      return false;
    }
  }

  function updatePasswordError(password) {
    // client side validation
    if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters long");
      return true;
    } else {
      setPasswordError("");
      return false;
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    let error = false;

    if (updateEmailError(email)) {
      error = true;
    }
    if (updatePasswordError(password)) {
      error = true;
    }
    setCheckEmailError(true);
    setCheckPasswordError(true);

    if (error) {
      return;
    }

    // server side validation
    const authCode = await getAuthCode(email, password);
    if (!authCode) {
      return;
    }
    console.log(redirectUri);
    if (redirectUri) {
      const newUrl = `${redirectUri}?auth_code=${authCode}`;
      window.location.href = newUrl;
    } else {
      navigate("/");
    }
  }

  function handleEmailChange(e) {
    const email = e.target.value;
    setEmail(email);
    if (checkEmailError && emailError !== "This email is not registered") {
      updateEmailError(email);
    }
  }

  function handlePasswordChange(e) {
    const password = e.target.value;
    setPassword(password);
    if (checkPasswordError) {
      updatePasswordError(password);
    }
  }

  return (
    <div className="login-page">
      <div className="form">
        <div className="login">
          <div className="login-header">
            <h3>LOGIN</h3>
            <p>Please enter your credentials to login.</p>
          </div>
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={handleEmailChange}
          />
          {emailError && <div className="error">{emailError}</div>}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={handlePasswordChange}
          />
          {passwordError && <div className="error">{passwordError}</div>}
          <button>login</button>
          <p className="message">
            Not registered?{" "}
            <span
              className="register-redirect"
              onClick={() => navigate("/register" + window.location.search)}
            >
              Create an account
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default App;
