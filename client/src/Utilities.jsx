import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export async function useIsAuthenticated() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      let res = await fetch("http://localhost:3000/api/isAuthenticated", {
        credentials: "include",
      });
      res = await res.json();

      if (!res) navigate("/auth");
    })();
  });
}

export async function useIsNotAuthenticated() {
  const navigate = useNavigate();

  useEffect(() => {
    (async () => {
      let res = await fetch("http://localhost:3000/api/isAuthenticated", {
        credentials: "include",
      });
      res = await res.json();

      if (res) navigate(-1);
    })();
  });
}