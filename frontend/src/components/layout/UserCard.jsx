import React from "react";
import HowItWorks from "./HowItWorks.jsx";
import { useHttpClient } from "../../common/hooks/http-hook.js";
import { FiSearch, FiX } from "react-icons/fi";
import { formatUTCToLocal } from "../../common/utils.js";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../common/context/auth-context.jsx";

const socket = io(import.meta.env.VITE_APP_BACKEND_URL);

const UserCard = () => {
  const { sendRequest } = useHttpClient();
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuthContext();

  const [tasksList, setTasksList] = React.useState([]);
  const [filteredTasks, setFilteredTasks] = React.useState([]);
  const [searchTerm, setSearchTerm] = React.useState([]);
  
  // Fetch all tasks
React.useEffect(() => {
  const getAllTasks = async () => {
    try {
      const responseData = await sendRequest(
        `${import.meta.env.VITE_APP_BACKEND_URL}/tasks?status=open`
      );
      if (responseData?.tasks) {
        // Filter out tasks created by the logged-in user
        const filtered = responseData.tasks.filter(
          (task) => task.creator._id !== user?.id
        );

        setTasksList(filtered);
        setFilteredTasks(filtered);
      }
    } catch (err) {
      console.error(err);
    }
  };
  if (isLoggedIn) getAllTasks();
}, [isLoggedIn, user?.id]);


  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchTerm(value);

    if (!value.trim()) {
      setFilteredTasks(tasksList);
      return;
    }

    const results = tasksList.filter((task) => {
      const allFields = [
        task.title,
        task.description,
        task.location,
        task.requestedTask?.join(" "),
        task.offeredTask?.join(" "),
        task.creator?.name,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return allFields.includes(value);
    });

    setFilteredTasks(results);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setFilteredTasks(tasksList);
  };

  const offeredColors = [
    "bg-green-100 text-green-800",
    "bg-teal-100 text-teal-800",
    "bg-lime-100 text-lime-800",
  ];

  const requestedColors = [
    "bg-yellow-100 text-yellow-800",
    "bg-orange-100 text-orange-800",
    "bg-amber-100 text-amber-800",
  ];

  const getRandomColor = (colors) =>
    colors[Math.floor(Math.random() * colors.length)];

  const handleConnect = async (task) => {
    if (!isLoggedIn) return navigate("/login");

    try {
      const res = await sendRequest(
        `${import.meta.env.VITE_APP_BACKEND_URL}/tasks/connect/${task._id}`,
        "POST",
      );

      socket.emit("sendNotification", {
        to: task.creator._id,
        message: `${res.requesterName} wants to connect on "${task.title}"`,
      });

      setTasksList((prev) => prev.filter((t) => t._id !== task._id));
      setFilteredTasks((prev) => prev.filter((t) => t._id !== task._id));

      alert(res.message);
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to send connection request");
    }
  };

  const handleReject = async (task) => {
    if (!isLoggedIn) return navigate("/login");

    try {
      const res = await sendRequest(
        `${import.meta.env.VITE_APP_BACKEND_URL}/tasks/reject/${task._id}`,
        "POST"
      );

      socket.emit("sendNotification", {
        to: task.creator._id,
        message: `${res.requesterName} rejected your connection request on "${task.title}"`,
      });

      setTasksList((prev) => prev.filter((t) => t._id !== task._id));
      setFilteredTasks((prev) => prev.filter((t) => t._id !== task._id));
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to reject connection request");
    }
  };

  return (
    <>
      <section className="px-4 sm:px-8 py-10 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-3xl font-bold text-center text-gray-800">
          People on <span className="text-blue-600">SkillBoard</span>
        </h2>
        <p className="mt-2 text-gray-500 text-center text-base">
          Connect with talented individuals and swap your skills.
        </p>

        <div className="mt-8 w-full max-w-2xl mb-10">
          <div className="flex items-center bg-white rounded-full shadow-md overflow-hidden">
            <span className="pl-4 text-gray-400">
              <FiSearch className="w-5 h-5" />
            </span>
            <input
              type="text"
              value={searchTerm}
              onChange={handleSearch}
              placeholder="Search for skills or people..."
              className="flex-1 px-4 py-3 outline-none text-gray-700 text-sm"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="pr-4 text-gray-400 hover:text-gray-600 transition"
              >
                <FiX className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <p className="text-gray-500 text-lg">No tasks found</p>
          </div>
        ) : (
          <div className="flex flex-col gap-6 max-w-[1100px] mx-auto">
            {filteredTasks.map((task, index) => (
              <div key={index}>
                <div className="hidden sm:flex bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.01] transition-all duration-300 p-6 flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                  {/* Profile */}
                  <div className="flex items-start gap-4 w-full lg:w-1/4">
                    <img
                      src={`${import.meta.env.VITE_APP_ASSET_URL}/${
                        task.creator.image || "default.png"
                      }`}
                      alt={task.creator.name}
                      className="w-16 h-16 rounded-full border-2 border-indigo-500 object-cover"
                    />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-800">
                        {task.creator.name}
                      </h3>
                      <p className="text-gray-500 text-sm">{task.location}</p>
                      <p className="text-gray-400 text-xs mt-1">
                        Created: {formatUTCToLocal(task.createdAt, false)}
                      </p>
                    </div>
                  </div>

                  {/* Task Details */}
                  <div className="flex-1 w-full lg:w-2/4">
                    <h4 className="text-lg font-bold text-indigo-600">
                      {task.title}
                    </h4>
                    <p className="text-gray-600 text-sm mt-1">{task.description}</p>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {task.offeredTask.map((skill, i) => (
                        <span
                          key={`offered-${i}`}
                          className={`${getRandomColor(
                            offeredColors
                          )} text-sm px-3 py-1 rounded-full`}
                        >
                          Offered: {skill.trim()}
                        </span>
                      ))}
                      {task.requestedTask.map((skill, i) => (
                        <span
                          key={`requested-${i}`}
                          className={`${getRandomColor(
                            requestedColors
                          )} text-sm px-3 py-1 rounded-full`}
                        >
                          Requested: {skill.trim()}
                        </span>
                      ))}
                    </div>

                    {task.deadline && (
                      <p className="text-sm text-gray-500 mt-2">
                        <span className="font-medium">Deadline:</span>{" "}
                        {formatUTCToLocal(task.deadline, false)}
                      </p>
                    )}
                  </div>

                  {/* Connect / Reject */}
                  <div className="w-full lg:w-1/5 flex justify-end gap-2">
                    <button
                      onClick={() => handleConnect(task)}
                      className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-2 px-6 rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 w-full lg:w-auto"
                    >
                      Connect
                    </button>
                    {user?.id && task.pendingRequests?.includes(user.id) && (
                      <button
                        onClick={() => handleReject(task)}
                        className="bg-red-500 text-white font-semibold py-2 px-6 rounded-lg w-full lg:w-auto hover:bg-red-600 transition"
                      >
                        Reject
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <HowItWorks />
    </>
  );
};

export default UserCard;
