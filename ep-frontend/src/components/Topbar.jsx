import { Bell, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function Topbar() {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem("loggedInUser"));
        if (loggedInUser) {
            setUser(loggedInUser);
        }
    }, []);
  return (
    <div className="w-full flex justify-end items-center p-4 bg-white shadow-sm">

      <div className="flex items-center gap-4">


        {/* User */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
            <User size={16} className="text-gray-700" />
          </div>
          <span className="text-sm font-medium text-gray-700">
            {user?.name || "User"}
          </span>
        </div>

      </div>

    </div>
  );
}