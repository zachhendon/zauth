import "./RegisterPage.css";
import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  return (
    <div className="login-page">
      <div className="form">
        <div className="login">
          <div className="login-header">
            <h3>REGISTER</h3>
            <p>Please enter your credentials to create an account.</p>
          </div>
        </div>
        <form className="login-form">
          <input type="text" placeholder="Username" />
          <input type="password" placeholder="Password" />
          <input type="password" placeholder="Repeat password" />
          <button>login</button>
          <p className="message">
            Already have an account?{" "}
            <span
              className="login-redirect"
              onClick={() => navigate("/login" + window.location.search)}
            >
              Login
            </span>
          </p>
        </form>
      </div>
    </div>
  );
}

export default App;
