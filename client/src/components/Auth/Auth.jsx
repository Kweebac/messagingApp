import "./auth.css";
import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useIsNotAuthenticated } from "../../Utilities";

export default function Auth() {
  const [registerErrors, setRegisterErrors] = useState();
  const [loginError, setLoginError] = useState();
  const loginEmailInputRef = useRef();
  const navigate = useNavigate();
  useIsNotAuthenticated();

  async function handleRegister(e) {
    e.preventDefault();

    let res = await fetch("http://localhost:3000/api/register", {
      method: "POST",
      body: new URLSearchParams(new FormData(e.target)),
    });
    res = await res.json();

    if (res === true) {
      e.target[0].value = "";
      e.target[1].value = "";
      e.target[2].value = "";
      loginEmailInputRef.current.focus();
    } else setRegisterErrors(res);
  }

  async function handleLogin(e) {
    e.preventDefault();

    let res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      body: new URLSearchParams(new FormData(e.target)),
      credentials: "include",
    });
    res = await res.json();

    if (res === true) navigate("/");
    else setLoginError(res);
  }

  return (
    <div className="auth">
      <main>
        <section className="register">
          <form onSubmit={(e) => handleRegister(e)}>
            <h1>Register</h1>
            <div>
              <label>
                Email: <input type="email" name="email" required />
              </label>
            </div>
            <div>
              <label>
                Password: <input type="password" name="password" required minLength={8} />
              </label>
            </div>
            <div>
              <label>
                Username: <input type="text" name="username" required minLength={3} />
              </label>
            </div>
            {registerErrors && (
              <ul className="errors">
                {registerErrors.map((error) => (
                  <li key={crypto.randomUUID()}>{error.msg}</li>
                ))}
              </ul>
            )}
            <button>Register</button>
          </form>
        </section>
        <section className="login">
          <form onSubmit={(e) => handleLogin(e)}>
            <h1>Login</h1>
            <div>
              <label>
                Email: <input type="email" name="email" required ref={loginEmailInputRef} />
              </label>
            </div>
            <div>
              <label>
                Password: <input type="password" name="password" required minLength={8} />
              </label>
            </div>
            {loginError && (
              <ul className="errors">
                <li>{loginError}</li>
              </ul>
            )}
            <button>Login</button>
          </form>
        </section>
      </main>
    </div>
  );
}
