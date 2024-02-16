import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Auth from "./components/Auth/Auth";
import Index from "./components/Index/Index";
import Settings from "./components/Settings/Settings";

export default function App() {
  return (
    <>
      <Routes>
        <Route index element={<Index />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/settings" element={<Navigate to="/settings/profile" replace={true} />} />
        <Route path="/settings/account" element={<Settings selected="account" />} />
        <Route path="/settings/profile" element={<Settings selected="profile" />} />
      </Routes>
    </>
  );
}
