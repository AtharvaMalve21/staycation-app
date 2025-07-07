import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  UserIcon,
  MapPinIcon,
  CalendarDaysIcon,
  StarIcon,
} from "@heroicons/react/24/solid";

const ActivityFeed = () => {
  const URI = import.meta.env.VITE_BACKEND_URI;
  const [activities, setActivities] = useState([]);

  const fetchActivities = async () => {
    try {
      const { data } = await axios.get(`${URI}/api/admin/recent-activities`, {
        withCredentials: true,
      });
      if (data.success) {
        setActivities(data.data);
      }
    } catch (error) {
      console.error("Error fetching activity feed:", error.message);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const getIcon = (type) => {
    const base = "w-4 h-4 text-white";
    switch (type) {
      case "user":
        return <UserIcon className={base} />;
      case "place":
        return <MapPinIcon className={base} />;
      case "booking":
        return <CalendarDaysIcon className={base} />;
      case "review":
        return <StarIcon className={base} />;
      default:
        return null;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case "user":
        return "bg-blue-600";
      case "place":
        return "bg-purple-600";
      case "booking":
        return "bg-green-600";
      case "review":
        return "bg-yellow-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="relative pl-4 border-l-2 border-gray-200 space-y-6">
      {activities.length > 0 ? (
        activities.map((activity, index) => (
          <div key={index} className="relative group">
            {/* Timeline Dot */}
            <div
              className={`absolute -left-2.5 top-1.5 w-5 h-5 rounded-full flex items-center justify-center ${getBgColor(activity.type)}`}
            >
              {getIcon(activity.type)}
            </div>

            <div className="ml-4">
              <p className="text-sm text-gray-800">{activity.message}</p>
              <span className="text-xs text-gray-500">
                {new Date(activity.date).toLocaleString()}
              </span>
            </div>
          </div>
        ))
      ) : (
        <p className="text-sm text-gray-500">No recent activities.</p>
      )}
    </div>
  );
};

export default ActivityFeed;
