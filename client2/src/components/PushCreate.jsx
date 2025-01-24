import React, { useEffect, useState } from "react";
import  {Bar}  from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const PushCreateEvents = ({ username }) => {
  const [pushStats, setPushStats] = useState({});
  const [createStats, setCreateStats] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserStats = async () => {
      setLoading(true);
      try {
        console.log("Fetching data for:", username);

        const response = await fetch(
          `https://api.github.com/users/${username}/events`
        );

        if (!response.ok) throw new Error("Failed to fetch events");

        const events = await response.json();

        // Group by year for Push and Create events
        const yearlyPushStats = {};
        const yearlyCreateStats = {};

        events.forEach((event) => {
          const year = new Date(event.created_at).getFullYear();
          if (event.type === "PushEvent") {
            yearlyPushStats[year] = (yearlyPushStats[year] || 0) + 1;
          } else if (event.type === "CreateEvent") {
            yearlyCreateStats[year] = (yearlyCreateStats[year] || 0) + 1;
          }
        });

        setPushStats(yearlyPushStats);
        setCreateStats(yearlyCreateStats);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserStats();
  }, [username]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-lg text-gray-600 italic">
          Loading contributions data for <span className="font-semibold">{username}</span>...
        </p>
      </div>
    );
  }

  // Generate chart data
  const years = Object.keys({ ...pushStats, ...createStats }).sort();
  const pushData = years.map((year) => pushStats[year] || 0);
  const createData = years.map((year) => createStats[year] || 0);

  const data = {
    labels: years,
    datasets: [
      {
        label: "Push Events",
        data: pushData,
        backgroundColor: "rgba(75, 192, 192, 0.6)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
      {
        label: "Repository Create Events",
        data: createData,
        backgroundColor: "rgba(153, 102, 255, 0.6)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: `Yearly GitHub Contribution Stats for ${username}`,
      },
    },
  };

  return (
    <div className="max-w-4xl mx-auto my-8 p-6 bg-white shadow-lg rounded-lg border border-gray-200">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        GitHub Contribution Stats
      </h2>
      <Bar data={data} options={options} />
    </div>
  );
};

export default PushCreateEvents;
