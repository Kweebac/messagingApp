import { useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";

export async function useIsAuthenticated() {
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();

    fetch("http://localhost:3000/api/auth/isAuthenticated", {
      credentials: "include",
      signal: abortController.signal,
    })
      .then((res) => res.json())
      .then((authenticated) => {
        if (!authenticated) navigate("/auth");
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      abortController.abort();
    };
  }, [navigate]);
}

export async function useIsNotAuthenticated() {
  const navigate = useNavigate();

  useEffect(() => {
    const abortController = new AbortController();

    fetch("http://localhost:3000/api/auth/isAuthenticated", {
      credentials: "include",
      signal: abortController.signal,
    })
      .then((res) => res.json())
      .then((authenticated) => {
        if (authenticated) navigate(-1);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      abortController.abort();
    };
  }, [navigate]);
}

export function useGetUser() {
  const navigate = useNavigate();
  const [user, setUser] = useState();

  useEffect(() => {
    const abortController = new AbortController();

    fetch("http://localhost:3000/api/auth/user", {
      credentials: "include",
      signal: abortController.signal,
    })
      .then((res) => {
        if (res.status === 401) navigate("/auth");
        return res.json();
      })
      .then((data) => {
        setUser(data);
      })
      .catch((error) => {
        console.error(error);
      });

    return () => {
      abortController.abort();
    };
  }, [navigate]);

  return user;
}

export function useSetSelected(string) {
  const { setSelected } = useOutletContext();

  useEffect(() => {
    setSelected(string);
  }, [setSelected, string]);
}
