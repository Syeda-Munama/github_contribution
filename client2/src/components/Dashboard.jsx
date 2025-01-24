import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CheckSquare, Code, Menu, Settings, AlarmClockPlus } from "lucide-react";

// Import your components
import CheckContributions from "./CheckContributions";
import PushCreateEvents from "./PushCreate";

import SetReminder from "./SetReminder";

const menuItems = [
  { icon: CheckSquare, label: "Check Contributions", component: "CheckContributions" },
  { icon: Code, label: "Events", component: "PushCreateEvents" },
 
  { icon: AlarmClockPlus, label: "Set Reminder", component: "SetReminder" },
];

const Dashboard = () => {
  const { search } = useLocation();
  const navigate = useNavigate();

  const [username, setUsername] = useState(null);
  const [token, setToken] = useState(null);
  const [email, setEmail] = useState(null);
  const [activeComponent, setActiveComponent] = useState("CheckContributions");

  useEffect(() => {
    const params = new URLSearchParams(search);
    const usernameParam = params.get("username");
    const tokenParam = params.get("token");
    const emailParam = params.get("email");

    if (!usernameParam || !tokenParam) {
      navigate("/"); // Redirect to login if credentials are missing
      return;
    }

    setUsername(usernameParam);
    setToken(tokenParam);
    setEmail(emailParam);

    saveTokenToServer(usernameParam, tokenParam, emailParam); // Save token
  }, [search, navigate]);

  const saveTokenToServer = async (username, token, email) => {
    try {
      const response = await fetch("http://localhost:5000/token/store-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, token, email }),
      });

      if (!response.ok) {
        console.error("Failed to save token:", await response.text());
      } else {
        console.log("Token successfully stored for:", username);
      }
    } catch (error) {
      console.error("Error saving token:", error);
    }
  };

  const renderActiveComponent = () => {
    switch (activeComponent) {
      case "CheckContributions":
        return <CheckContributions username={username} token={token} />;
      case "PushCreateEvents":
        return <PushCreateEvents username={username} />;
      
      case "SetReminder":
        return <SetReminder username={username} token={token} email={email} />;
      default:
        return <p>Select an option to get started.</p>;
    }
  };

  const handleToggleSidebar = () => {
    const sidebar = document.getElementById("sidebar");
    sidebar.classList.toggle("hidden");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div
        id="sidebar"
        className="w-64 bg-white border-r border-gray-200 shadow-md lg:block hidden"
      >
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <nav className="p-4">
          {menuItems.map((item) => (
            <button
              key={item.label}
              onClick={() => setActiveComponent(item.component)}
              className={`flex items-center gap-2 p-2 rounded-md text-gray-700 hover:bg-gray-200 ${
                activeComponent === item.component ? "bg-gray-300" : ""
              }`}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        {/* Header */}
        <header className="mb-6 flex items-center justify-between">
          <h2 className="text-3xl font-bold">Welcome, {username}</h2>
          <button
            onClick={handleToggleSidebar}
            className="lg:hidden p-2 border rounded-md text-gray-600"
          >
            <Menu className="h-6 w-6" />
          </button>
        </header>

        {/* Main Area */}
        <main>{renderActiveComponent()}</main>
      </div>
    </div>
  );
};

export default Dashboard;

