import { useCallback, useEffect, useState } from "react";
import { useSetSelected } from "../../Utilities";
import "./Friends.css";
import { useNavigate } from "react-router-dom";
import UserAvatar from "../Avatar/UserAvatar";

export default function FriendsAll() {
  const [friends, setFriends] = useState();
  const navigate = useNavigate();
  useSetSelected("all");

  const refreshFriends = useCallback(
    async (abortController) => {
      const res = await fetch(
        "http://localhost:3000/api/user/friends?" +
          new URLSearchParams({
            type: "all",
          }),
        {
          credentials: "include",
          signal: abortController ? abortController.signal : undefined,
        }
      );
      if (res.status === 401) navigate("/auth");

      const friends = await res.json();
      setFriends(friends);
    },
    [navigate]
  );

  useEffect(() => {
    const abortController = new AbortController();

    refreshFriends(abortController);

    return () => {
      abortController.abort();
    };
  }, [refreshFriends]);

  async function removeFriend(userId) {
    const res = await fetch(`http://localhost:3000/api/user/friends/${userId}/remove`, {
      method: "DELETE",
      credentials: "include",
    });
    if (res.status === 401) navigate("/auth");

    refreshFriends();
  }

  if (friends)
    return (
      <section className="filteredFriendsList">
        <ul>
          {friends.map((friend, index) => (
            <li key={index}>
              <div className="info">
                <UserAvatar user={friend} />
                <div>
                  <p className="title">{friend.displayname}</p>
                  <p>{friend.visibility === "offline" ? "Offline" : friend.status}</p>
                </div>
              </div>
              <div className="actions">
                <div>
                  <svg
                    onClick={() => removeFriend(friend._id)}
                    className="decline"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                  >
                    <title>Remove</title>
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
