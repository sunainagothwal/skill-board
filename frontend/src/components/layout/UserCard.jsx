import React from "react";
import HowItWorks from "./HowItWorks.jsx";
import { useHttpClient } from "../../common/hooks/http-hook.js";
import { FiSearch } from "react-icons/fi";


const UserCard = () => {
  const { sendRequest } = useHttpClient();
  const [tasksList, setTasksList] = React.useState([]);

  const formatDate = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  React.useEffect(() => {
    const getAllTasks = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_APP_BACKEND_URL}/tasks`
        );
        if (responseData) setTasksList(responseData.tasks);
      } catch (err) {
        console.error(err);
      }
    };
    getAllTasks();
  }, []);

  const handleDownload = (file) => {
    const url = `${import.meta.env.VITE_APP_ASSET_URL}/${file}`;
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", file);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Color palettes for skill tags
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
  return (
    <>
      <section className="px-4 sm:px-8 py-10 bg-gray-50 min-h-screen flex flex-col items-center justify-center">
        <h2 className=" text-3xl font-bold text-center text-gray-800">
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
              placeholder="Search for skills or people..."
              className="flex-1 px-4 py-3 outline-none text-gray-700 text-sm"
            />
            <button className="px-6 py-2 m-1 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold text-sm hover:from-purple-500 hover:to-indigo-500 transition-all duration-300">
              Search
            </button>
          </div>
        </div>

        <div className="flex flex-col gap-6 max-w-[1100px] mx-auto">
          {tasksList.map((task, index) => (
            <div key={index}>
              {/* Mobile Card */}
              <div className="user-card sm:hidden">
                <img
                  src={`${import.meta.env.VITE_APP_ASSET_URL}/${
                    task.creator.image
                  }`}
                  alt={task.creator.name}
                />

                <div className="user-card-content">
                  <h3>{task.creator.name}</h3>
                  <p>{task.location}</p>
                  <p className="mt-2">{task.description}</p>

                  <div className="skills">
                    {task.offeredTask.map((skill, i) => (
                      <span
                        key={`offered-${i}`}
                        className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-xs"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                    {task.requestedTask.map((skill, i) => (
                      <span
                        key={`requested-${i}`}
                        className="bg-yellow-200 text-yellow-800 px-3 py-1 rounded-full text-xs"
                      >
                        {skill.trim()}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="actions">
                  <button className="btn-no">✕</button>
                  <button className="btn-yes">✔</button>
                </div>
              </div>

              {/* Desktop / Laptop Card */}
              <div className="hidden sm:flex bg-white rounded-xl shadow-lg hover:shadow-2xl transform hover:scale-[1.01] transition-all duration-300 p-6 flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                {/* Left: Profile + Basic Info */}
                <div className="flex items-start gap-4 w-full lg:w-1/4">
                  <img
                    src={`${import.meta.env.VITE_APP_ASSET_URL}/${
                      task.creator.image
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
                      Created: {formatDate(task.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Middle: Task Details */}
                <div className="flex-1 w-full lg:w-2/4">
                  <h4 className="text-lg font-bold text-indigo-600">
                    {task.title}
                  </h4>

                  <p className="text-gray-600 text-sm mt-1">
                    {task.description}
                  </p>

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
                      {formatDate(task.deadline)}
                    </p>
                  )}

                  {task.attachments && (
                    <button
                      onClick={() => handleDownload(task.attachments)}
                      className="mt-2 inline-block bg-gray-100 text-blue-600 px-3 py-1 rounded-md text-sm hover:bg-gray-200 transition"
                    >
                      📎 {task.attachments.split("/").pop()}
                    </button>
                  )}
                </div>

                {/* Right: Connect Button */}
                <div className="w-full lg:w-1/5 flex justify-end">
                  <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold py-2 px-6 rounded-lg hover:from-purple-500 hover:to-indigo-500 transition-all duration-300 w-full lg:w-auto">
                    Connect
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <HowItWorks />
    </>
  );
};

export default UserCard;
