import { Route, Routes } from "react-router-dom";
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
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </>
  );
}
