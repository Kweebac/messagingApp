import { Route, Routes } from "react-router-dom";
import "./App.css";
import Auth from "./components/Auth/Auth";
import Index from "./components/Index/Index";

export default function App() {
  return (
    <>
      <Routes>
        <Route index element={<Index />} />
        <Route path="/auth" element={<Auth />} />
      </Routes>
    </>
  );
}
