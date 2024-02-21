import { useNavigate } from "react-router-dom";
import "./AddFriend.css";
import PropTypes from "prop-types";
import { useState } from "react";

export default function AddFriend({ setAddFriendForm }) {
  const [errors, setErrors] = useState();
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  async function sendFriendRequest(e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("username", e.target[0].value.toLowerCase());

    const res = await fetch("http://localhost:3000/api/user/friendRequest/send", {
      method: "PUT",
      body: new URLSearchParams(formData),
      credentials: "include",
    });
    if (res.status === 401) navigate("/auth");

    const errors = await res.json();
    if (errors) setErrors(errors);
    else {
      setErrors(undefined);
      setSuccess(true);
      setTimeout(() => {
        setAddFriendForm(false);
      }, 2000);
    }
  }

  return (
    <div className="absolute-center dark-bg addFriend">
      <div>
        <h1 className="title">ADD FRIEND</h1>
        <form onSubmit={(e) => sendFriendRequest(e)}>
          <input type="text" name="username" />
          {errors && (
            <ul className="errors">
              {errors.map((error, index) => (
                <li key={index}>{error.msg}</li>
              ))}
            </ul>
          )}
          {success && <div style={{ color: "#359356" }}>Success!</div>}
        </form>
      </div>
      <div className="close">
        <svg
          onClick={() => setAddFriendForm(false)}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
        >
          <title>Close</title>
          <path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" />
        </svg>
        <div className="title">ESC</div>
      </div>
    </div>
  );
}

AddFriend.propTypes = {
  setAddFriendForm: PropTypes.func,
};
