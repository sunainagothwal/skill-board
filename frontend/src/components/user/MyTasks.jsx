import React, { useEffect, useState } from "react";
import { useHttpClient } from "../../common/hooks/http-hook.js";
import { formatUTCToLocal } from "../../common/utils.js";
import { useAuthContext } from "../../common/context/auth-context.jsx";

const MyTasks = () => {
  const { sendRequest } = useHttpClient();
  const { isLoggedIn } = useAuthContext();

  const [myTasks, setMyTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    offeredTask: "",
    requestedTask: "",
    deadline: "",
    location: "",
  });

  useEffect(() => {
    const fetchMyTasks = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_APP_BACKEND_URL}/tasks/my`
        );
        setMyTasks(responseData.tasks || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (isLoggedIn) fetchMyTasks();
  }, [isLoggedIn, sendRequest]);

  // Close Task
  const handleCloseTask = async (taskId) => {
    try {
      await sendRequest(
        `${import.meta.env.VITE_APP_BACKEND_URL}/tasks/close/${taskId}`,
        "PATCH"
      );
      setMyTasks((prev) =>
        prev.map((t) => (t._id === taskId ? { ...t, status: "cancelled" } : t))
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Open edit modal
  const handleEditClick = (task) => {
    setEditingTask(task);
    setFormData({
      title: task.title,
      description: task.description,
      offeredTask: task.offeredTask.join(", "),
      requestedTask: task.requestedTask.join(", "),
      deadline: task.deadline ? task.deadline.split("T")[0] : "",
      location: task.location,
    });
  };

  // Update task
  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      const updated = {
        ...formData,
        offeredTask: formData.offeredTask.split(",").map((s) => s.trim()),
        requestedTask: formData.requestedTask.split(",").map((s) => s.trim()),
      };

      const res = await sendRequest(
        `${import.meta.env.VITE_APP_BACKEND_URL}/tasks/${editingTask._id}`,
        "PATCH",
        JSON.stringify(updated),
        { "Content-Type": "application/json" }
      );

      setMyTasks((prev) =>
        prev.map((t) => (t._id === editingTask._id ? res.task : t))
      );

      setEditingTask(null); // close modal
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <section className="px-4 sm:px-8 py-10 bg-gray-50 min-h-screen">
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
        My <span className="text-blue-600">Tasks</span>
      </h2>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-500">Loading your tasks...</p>
        </div>
      ) : myTasks.length === 0 ? (
        <div className="flex justify-center items-center py-20">
          <p className="text-gray-500 text-lg">
            You haven’t created any tasks yet.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 max-w-5xl mx-auto">
          {myTasks.map((task) => (
            <>
              {/* Inside task card */}
              <div
                key={task._id}
                className="relative bg-white shadow-md rounded-xl p-6 hover:shadow-lg transition-all"
              >
                {/* Status badge at top-right */}
                <div className="absolute top-4 right-4">
                  <span
                    className={`px-3 py-1 text-xs rounded-full font-medium shadow-sm ${
                      task.status === "open"
                        ? "bg-blue-100 text-blue-700"
                        : task.status === "in-progress"
                        ? "bg-yellow-100 text-yellow-700"
                        : task.status === "completed"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {task.status}
                  </span>
                </div>

                {/* User Info */}
                <div className="flex items-center gap-4">
                  <img
                    src={`${import.meta.env.VITE_APP_ASSET_URL}/${
                      task.creator.image || "default.png"
                    }`}
                    alt={task.creator.name}
                    className="w-14 h-14 rounded-full object-cover border-2 border-indigo-500"
                  />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                      {task.creator.name}
                    </h3>
                    <p className="text-sm text-gray-500">
                      Created: {formatUTCToLocal(task.createdAt, false)}
                    </p>
                  </div>
                </div>

                {/* Task Title */}
                <h4 className="text-xl font-bold text-gray-900 mt-4">
                  {task.title}
                </h4>

                {/* Description */}
                <p className="text-gray-600 text-sm mt-2">{task.description}</p>

                {/* Offered and Requested Tasks */}
                <div className="mt-3 flex flex-col gap-2">
                  {/* Offered */}
                  {task.offeredTask.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="font-medium text-sm text-gray-700">
                        Offered:
                      </span>
                      {task.offeredTask.map((skill, i) => (
                        <span
                          key={`offered-${i}`}
                          className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Requested */}
                  {task.requestedTask.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="font-medium text-sm text-gray-700">
                        Requested:
                      </span>
                      {task.requestedTask.map((skill, i) => (
                        <span
                          key={`requested-${i}`}
                          className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                {/* Deadline */}
                {task.deadline && (
                  <p className="text-sm text-gray-500 mt-3">
                    <span className="font-medium">Deadline:</span>{" "}
                    {formatUTCToLocal(task.deadline, false)}
                  </p>
                )}

                {/* Action buttons (hide if cancelled) */}
                {task.status !== "cancelled" && (
                  <div className="mt-6 flex gap-3">
                    <button
                      className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition"
                      onClick={() => handleCloseTask(task._id)}
                    >
                      Close
                    </button>
                    <button
                      className="px-4 py-2 rounded-lg bg-indigo-500 text-white text-sm font-medium hover:bg-indigo-600 transition"
                      onClick={() => handleEditClick(task)}
                    >
                      Edit
                    </button>
                  </div>
                )}
              </div>
            </>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {editingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg">
            <h3 className="text-lg font-bold mb-4">Edit Task</h3>
            <form onSubmit={handleUpdateTask} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Offered Tasks (comma separated)"
                value={formData.offeredTask}
                onChange={(e) =>
                  setFormData({ ...formData, offeredTask: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Requested Tasks (comma separated)"
                value={formData.requestedTask}
                onChange={(e) =>
                  setFormData({ ...formData, requestedTask: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg"
              />
              <input
                type="date"
                value={formData.deadline}
                onChange={(e) =>
                  setFormData({ ...formData, deadline: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg"
              />
              <input
                type="text"
                placeholder="Location"
                value={formData.location}
                onChange={(e) =>
                  setFormData({ ...formData, location: e.target.value })
                }
                className="w-full border px-3 py-2 rounded-lg"
              />
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditingTask(null)}
                  className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default MyTasks;
