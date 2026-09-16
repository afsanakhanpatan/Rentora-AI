import "./rentora-theme.css";
import { useState } from "react";
import Header from "./components/Header";
import ChatWindow from "./components/ChatWindow";
import Dashboard from "./components/Dashboard";
import LandingPage from "./pages/LandingPage";
import Signup from "./pages/Signup";

function App() {
  const [activePage, setActivePage] = useState("landing");

  return (
    <div className="rentora-app">
      <Header activePage={activePage} setActivePage={setActivePage} />

      {activePage === "landing" && (
        <LandingPage setActivePage={setActivePage} />
      )}

      {activePage === "explore" && (
        <Dashboard setActivePage={setActivePage} />
      )}

      {activePage === "assistant" && <ChatWindow />}

      {activePage === "signup" && (
        <Signup setActivePage={setActivePage} />
      )}
    </div>
  );
}

export default App;
