import { useEffect, useState } from "react";
import { useSetSelected } from "../../Utilities";
import "./Friends.css";
import defaultUserAvatar from "../../assets/defaultAvatars/user.jpg";
import { useNavigate } from "react-router-dom";

export default function FriendsPending() {
  useSetSelected("pending");
  const [friendRequests, setFriendRequests] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();

    fetch("http://localhost:3000/api/user/friendRequest", {
      credentials: "include",
      signal: abortController.signal,
    })
      .then((res) => (res.status === 401 ? navigate("/auth") : res.json()))
      .then((friendRequests) => setFriendRequests(friendRequests))
      .catch((error) => console.error(error));

    return () => {
      abortController.abort();
    };
  }, [navigate]);

  async function declineFriendRequest(type, username) {
    const formData = new FormData();
    formData.append("username", username);

    await fetch(`http://localhost:3000/api/user/friendRequest/decline/${type}`, {
      method: "PUT",
      body: new URLSearchParams(formData),
      credentials: "include",
    });

    fetch("http://localhost:3000/api/user/friendRequest", {
      credentials: "include",
    })
      .then((res) => (res.status === 401 ? navigate("/auth") : res.json()))
      .then((friendRequests) => setFriendRequests(friendRequests))
      .catch((error) => console.error(error));
  }

  if (friendRequests)
    return (
      <section className="filteredFriendsList">
        <ul>
          {friendRequests.incoming.map((friendRequest, index) => (
            <li key={index}>
              <div className="info">
                <img
                  src={friendRequest.avatar ? friendRequest.avatar : defaultUserAvatar}
                  alt={`${friendRequest.displayname}'s avatar`}
                />
                <div>
                  <p className="title">{friendRequest.displayname}</p>
                  <p>Incoming Friend Request</p>
                </div>
              </div>
              <div className="actions">
                <div>
                  <svg
                    className="accept"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <title>Accept</title>
                    <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
                  </svg>
                </div>
                <div>
                  <svg
                    onClick={() => declineFriendRequest("incoming", friendRequest.username)}
                    className="decline"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <title>Decline</title>
                    <path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" />
                  </svg>
                </div>
              </div>
            </li>
          ))}
          {friendRequests.outgoing.map((friendRequest, index) => (
            <li key={index}>
              <div className="info">
                <img
                  src={friendRequest.avatar ? friendRequest.avatar : defaultUserAvatar}
                  alt={`${friendRequest.displayname}'s avatar`}
                />
                <div>
                  <p className="title">{friendRequest.displayname}</p>
                  <p>Outgoing Friend Request</p>
                </div>
              </div>
              <div className="actions">
                <div>
                  <svg
                    onClick={() => declineFriendRequest("outgoing", friendRequest.username)}
                    className="decline"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <title>Decline</title>
                    <path d="M13.46,12L19,17.54V19H17.54L12,13.46L6.46,19H5V17.54L10.54,12L5,6.46V5H6.46L12,10.54L17.54,5H19V6.46L13.46,12Z" />
                  </svg>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    );
}
