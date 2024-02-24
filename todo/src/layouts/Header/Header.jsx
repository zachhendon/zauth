import "./Header.css";
import { useSelector } from "react-redux";

function Header() {
  const userId = useSelector((state) => state.user.userId);

  const login = () => {
    const redirectUri = window.location.href.split("?")[0];
    window.location.href = `http://localhost:3001/login?redirect_uri=${redirectUri}`
  };
  const register = () => {
    const redirectUri = window.location.href.split("?")[0];
    window.location.href = `http://localhost:3001/register?redirect_uri=${redirectUri}`
  };

  return (
    <header>
      <div className="content flex">
        <h3>ZAuth Todo List</h3>
        <div className="account flex">
          {userId != null ? (
            // not logged in
            <p>Logout</p>
          ) : (
            // logged in
            <>
              <p className="header-login" onClick={login}>
                Login
              </p>
              <p className="header-register" onClick={register}>
                Register
              </p>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
