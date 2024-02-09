import "./settings.css";
import { useIsAuthenticated } from "../../Utilities";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();
  useIsAuthenticated();

  async function handleLogout(e) {
    e.preventDefault();

    let res = await fetch("http://localhost:3000/api/auth/logout", {
      method: "POST",
      credentials: "include",
    });
    res = await res.json();

    if (res === true) navigate("/auth");
  }

  return (
    <div className="settings">
      <main>
        <h1>My Account</h1>
        <form>
          <div className="inputs">
            <div>
              <label className="title">
                EMAIL
                <div>
                  <input type="email" name="email" />
                </div>
              </label>
            </div>
            <div>
              <label className="title">
                PASSWORD
                <div>
                  <input type="password" name="password" />
                </div>
              </label>
            </div>
            <div>
              <label className="title">
                USERNAME
                <div>
                  <input type="text" name="username" />
                </div>
              </label>
            </div>
            <hr />
            <div>
              <label className="title">
                AVATAR
                <div>
                  <input type="file" accept=".png, .jpg, .jpeg" name="avatar" />
                </div>
              </label>
            </div>
            <hr />
            <div>
              <label className="title">
                ABOUT ME
                <div>
                  <textarea name="about" rows="10"></textarea>
                </div>
              </label>
            </div>
            <hr />
            <button className="save">Save Changes</button>
            <hr />
            <button className="delete" onClick={(e) => handleLogout(e)}>
              Logout
            </button>
            <button className="delete">Delete Account</button>
          </div>
        </form>
        <div className="close">
          <svg
            onClick={() => navigate(-1)}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <title>window-close</title>
            <path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" />
          </svg>
          <div className="title">ESC</div>
        </div>
      </main>
    </div>
  );
}

// Delete account
