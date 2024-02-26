import "./Friends.css";
import { useCallback, useEffect, useState } from "react";
import { useSetSelected } from "../../Utilities";
import { Outlet, useNavigate } from "react-router-dom";

export default function FriendsSidebar() {
  useSetSelected("friends");
  const [totalFriendRequests, setTotalFriendRequests] = useState();
  const [selected, setSelected] = useState();
  const navigate = useNavigate();

  const refreshTotalFriendRequests = useCallback(
    async (abortController) => {
      const res = await fetch("http://localhost:3000/api/user/friendRequests", {
        credentials: "include",
        signal: abortController ? abortController.signal : undefined,
      });
      if (res.status === 401) navigate("/auth");

      const friendRequests = await res.json();
      setTotalFriendRequests(friendRequests.incoming.length);
    },
    [navigate]
  );

  useEffect(() => {
    const abortController = new AbortController();

    refreshTotalFriendRequests(abortController);

    return () => {
      abortController.abort();
    };
  }, [refreshTotalFriendRequests]);

  return (
    <>
      <main className="friends">
        <aside>
          <ul className="options">
            <li
              className={selected === "online" ? "selected" : undefined}
              onClick={() => navigate("/friends/online")}
            >
              Online
            </li>
            <li
              className={selected === "all" ? "selected" : undefined}
              onClick={() => navigate("/friends/all")}
            >
              All
            </li>
            <li
              className={selected === "pending" ? "selected" : undefined}
              onClick={() => navigate("/friends/pending")}
            >
              Pending
              {totalFriendRequests > 99 && <span className="totalFriendRequests">99+</span>}
              {totalFriendRequests > 9 && totalFriendRequests < 100 && (
                <span className="totalFriendRequests">{totalFriendRequests}</span>
              )}
              {totalFriendRequests > 0 && totalFriendRequests < 10 && (
                <span
                  className="totalFriendRequests"
                  style={{ width: "1rem", height: "1rem", "font-size": "0.8rem" }}
                >
                  {totalFriendRequests}
                </span>
              )}
            </li>
            <li id="addFriendButton">
              <button
                className={selected === "new" ? "selected" : undefined}
                onClick={() => navigate("/friends/new")}
              >
                Add Friend
              </button>
            </li>
          </ul>
        </aside>

        <Outlet context={{ setSelected, setTotalFriendRequests }} />
      </main>
    </>
  );
}
