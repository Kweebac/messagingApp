import "./Friends.css";
import { useState } from "react";
import { useSetSelected } from "../../Utilities";
import { Outlet, useNavigate } from "react-router-dom";

export default function FriendsSidebar() {
  useSetSelected("friends");
  const [selected, setSelected] = useState();
  const navigate = useNavigate();

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

        <Outlet context={[setSelected]} />
      </main>
    </>
  );
}
