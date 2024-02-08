import "./index.css";
import Sidebar from "../Sidebar/Sidebar";
import { useIsAuthenticated } from "../../Utilities";

export default function Index() {
  useIsAuthenticated();

  return (
    <>
      <Sidebar />
      <main className="index">
        <em>Select a chat</em>
      </main>
    </>
  );
}
