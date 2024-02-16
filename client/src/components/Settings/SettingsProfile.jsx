import "./Settings.css";
import { getUser, useIsAuthenticated } from "../../Utilities";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function SettingsProfile() {
  const [user, setUser] = useState();
  const [errors, setErrors] = useState({
    username: [],
    status: [],
    about: [],
  });
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  useIsAuthenticated();

  useEffect(() => {
    (async () => {
      setUser(await getUser());
    })();
  }, []);

  async function handleFormSubmit(e) {
    e.preventDefault();
    setSuccess(false);

    let errors = await fetch("http://localhost:3000/api/user/profile", {
      method: "PUT",
      body: new URLSearchParams(new FormData(e.target)),
      credentials: "include",
    });
    errors = await errors.json();

    if (errors) setErrors(errors);
    else {
      setErrors({
        username: [],
        status: [],
        about: [],
      });
      setUser(await getUser());
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
      }, 2000);
    }
  }

  return (
    <div className="options">
      <main>
        <h1>Profile</h1>
        <form onSubmit={(e) => handleFormSubmit(e)}>
          <div className="inputs">
            <div>
              <label className="title">
                USERNAME
                <div>
                  <input
                    type="text"
                    name="username"
                    defaultValue={user && user.username}
                    minLength={3}
                  />
                </div>
              </label>
            </div>
            {errors.username.length > 0 && (
              <ul className="errors">
                {errors.username.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
            {/* <div>
              <label className="title">
                AVATAR
                <div>
                  <input type="file" accept=".png, .jpg, .jpeg" name="avatar" />
                </div>
              </label>
            </div> */}
            <hr />
            <div>
              <label className="title">
                STATUS
                <div>
                  <input
                    type="text"
                    name="status"
                    defaultValue={user && user.status}
                    maxLength={40}
                  />
                </div>
              </label>
            </div>
            {errors.status.length > 0 && (
              <ul className="errors">
                {errors.status.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
            <div>
              <label className="title">
                ABOUT ME
                <div>
                  <textarea
                    name="about"
                    rows="10"
                    defaultValue={user && user.about}
                    maxLength={190}
                  ></textarea>
                </div>
              </label>
            </div>
            {errors.about.length > 0 && (
              <ul className="errors">
                {errors.about.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            )}
            <hr />
            <div>
              <label className="title">
                VISIBILITY
                <div>
                  <select name="visibility">
                    <option
                      selected={user && user.visibility === "online" ? true : false}
                      value="online"
                    >
                      Online
                    </option>
                    <option
                      selected={user && user.visibility === "offline" ? true : false}
                      value="offline"
                    >
                      Offline
                    </option>
                    <option
                      selected={user && user.visibility === "dnd" ? true : false}
                      value="dnd"
                    >
                      Do Not Disturb
                    </option>
                  </select>
                </div>
              </label>
            </div>
            <hr />
            <div className="saveChanges">
              <button className="save">Save Changes</button>
              {success ? (
                <span>Success!</span>
              ) : (
                <span style={{ visibility: "hidden" }}>Success!</span>
              )}
            </div>
          </div>
        </form>
        <div className="close">
          <svg
            onClick={() => navigate("/")}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          >
            <title>Close</title>
            <path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" />
          </svg>
          <div className="title">ESC</div>
        </div>
      </main>
    </div>
  );
}
