import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import { useSetSelected } from "../../Utilities";
import { useEffect, useRef, useState } from "react";
import defaultUserAvatar from "../../assets/defaultAvatars/user.jpg";
import "./Chat.css";
import UserInfo from "./UserInfo";
import MessageActions from "./MessageActions";

function getChat(username, navigate, setChat, abortController) {
  fetch(`http://localhost:3000/api/chat/${username}`, {
    credentials: "include",
    signal: abortController ? abortController.signal : undefined,
  })
    .then((res) => {
      if (res.status === 401) navigate("/auth");
      return res.json();
    })
    .then((res) => {
      setChat(res);
    })
    .catch((error) => {
      console.error(error);
    });
}

export default function Chat() {
  const { refreshVisibleChats } = useOutletContext();
  const navigate = useNavigate();
  const [chat, setChat] = useState();
  const { username } = useParams();
  useSetSelected(username);
  const [hasChat, setHasChat] = useState(false);
  const messagesEndRef = useRef();
  const previousMessage = useRef();
  previousMessage.current = undefined;
  const [remainingChars, setRemainingChars] = useState(2000);

  useEffect(() => {
    const abortController = new AbortController();

    if (hasChat) {
      fetch(`http://localhost:3000/api/chat/${username}/reorder`, {
        method: "PUT",
        signal: abortController.signal,
        credentials: "include",
      }).then((res) => {
        if (res.status === 401) navigate("/auth");
        refreshVisibleChats();
      });
    }

    return () => {
      abortController.abort();
    };
  }, [hasChat, username, refreshVisibleChats, navigate]);

  useEffect(() => {
    const abortController = new AbortController();
    getChat(username, navigate, setChat, abortController);
    setHasChat(false);

    return () => {
      abortController.abort();
    };
  }, [navigate, username]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [chat]);

  async function submitMessage(e) {
    e.preventDefault();

    setHasChat(true);

    const message = e.target[0].value;
    e.target[0].value = "";
    setRemainingChars(2000);

    const res = await fetch("http://localhost:3000/api/chat/message", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message,
        chatId: chat.ref._id,
      }),
      credentials: "include",
    });
    if (res.status === 401) navigate("/auth");

    getChat(username, navigate, setChat);
  }

  if (chat)
    return (
      <div className="chatDM">
        <main>
          <ul className="messages">
            {chat.ref.messages.map((message) => {
              const prevMessage = previousMessage.current;
              previousMessage.current = message;

              const date = new Date(+message.date);
              let day = date.getDate();
              let month = date.getMonth() + 1;
              let year = date.getFullYear();
              let hours = date.getHours();
              let minutes = date.getMinutes();
              if (day < 10) day = "0" + day;
              if (month < 10) month = "0" + month;
              if (hours < 10) hours = "0" + hours;
              if (minutes < 10) minutes = "0" + minutes;
              const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;

              const condenseMessage =
                prevMessage !== undefined &&
                prevMessage.user.displayname === message.user.displayname &&
                new Date(+prevMessage.date).getMinutes() ===
                  new Date(+message.date).getMinutes();

              if (condenseMessage)
                return (
                  <li key={message._id} className="message">
                    <MessageActions message={message} />
                    <p style={{ marginLeft: "2.35rem" }}>{message.body}</p>
                  </li>
                );
              else
                return (
                  <li style={{ marginTop: "0.5rem" }} className="message" key={message._id}>
                    <MessageActions />
                    <img
                      src={message.user.avatar || defaultUserAvatar}
                      alt={`${message.user.username}'s profile picture`}
                    />
                    <div>
                      <p className="info">
                        <span>{message.user.displayname}</span>
                        <span>{formattedDate}</span>
                      </p>
                      <p>{message.body}</p>
                    </div>
                  </li>
                );
            })}
            <div ref={messagesEndRef}></div>
          </ul>
          <form onSubmit={async (e) => await submitMessage(e)}>
            <input
              onInput={(e) => setRemainingChars(2000 - e.target.value.length)}
              type="text"
              name="message"
              required
              placeholder={`Message ${chat.friend.displayname}`}
              maxLength={2000}
            />
            <div className="inputRemChars">{remainingChars}</div>
          </form>
        </main>
        <UserInfo user={chat.friend} />
      </div>
    );
}
