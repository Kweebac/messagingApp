import "./Settings.css";
import { useIsAuthenticated } from "../../Utilities";
import SettingsAccount from "./SettingsAccount";
import PropTypes from "prop-types";
import { useNavigate } from "react-router-dom";
import SettingsProfile from "./SettingsProfile";

export default function Settings({ selected }) {
  useIsAuthenticated();
  const navigate = useNavigate();

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
      <aside>
        <h1 className="title">USER SETTINGS</h1>
        <ul>
          <li>
            <button
              className={selected === "account" ? "selected" : undefined}
              onClick={() => navigate("/settings/account")}
            >
              Account
            </button>
          </li>
          <li>
            <button
              className={selected === "profile" ? "selected" : undefined}
              onClick={() => navigate("/settings/profile")}
            >
              Profile
            </button>
          </li>
          <hr />
          <li>
            <button onClick={(e) => handleLogout(e)}>Logout</button>
          </li>
        </ul>
      </aside>

      {selected === "account" && <SettingsAccount />}
      {selected === "profile" && <SettingsProfile />}
    </div>
  );
}

Settings.propTypes = {
  selected: PropTypes.string,
};
