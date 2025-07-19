import React, { useEffect, useState } from "react";
import axios from "axios";
import { formatDistanceToNow } from "date-fns";

const ActivityFeed = () => {
  const [activities, setActivities] = useState([]);

  const URI = import.meta.env.VITE_BACKEND_URI;

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const { data } = await axios.get(URI + "/api/admin/recent-activities", { withCredentials: true });
        console.log(data);
        if (data.success) {
          setActivities(data.data);
        }
      } catch (err) {
        console.error("Failed to fetch activities:", err);
      }
    };
    fetchActivities();
  }, []);

  const getIcon = (type) => {
    switch (type) {
      case "user":
        return "🧑";
      case "place":
        return "🏠";
      case "booking":
        return "🗓️";
      case "review":
        return "✍️";
      default:
        return "ℹ️";
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-lg font-bold mb-4">Recent Activities</h2>
      <ul className="space-y-4">
        {activities.map((activity, index) => (
          <li
            key={index}
            className="flex items-start gap-3 hover:bg-gray-100 p-3 rounded-lg transition-all"
          >
            <div className="text-2xl">{getIcon(activity.type)}</div>
            <div>
              <p className="text-sm text-gray-800">{activity.message}</p>
              <p className="text-xs text-gray-500">
                {formatDistanceToNow(new Date(activity.date), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActivityFeed;
