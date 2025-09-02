import React, { useEffect, useState } from "react";
import { useAuthContext } from "../../common/context/auth-context";
import { useHttpClient } from "../../common/hooks/http-hook";
import { useNavigate } from "react-router-dom";

function RequestsPage() {
  const { isLoggedIn } = useAuthContext();
  const { sendRequest } = useHttpClient();
  const navigate = useNavigate();

  const [sentRequests, setSentRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);

  useEffect(() => {
    if (!isLoggedIn) return navigate("/login");

    const fetchRequests = async () => {
      try {
        const res = await sendRequest(
          `${import.meta.env.VITE_APP_BACKEND_URL}/tasks/inprogress`
        );
        setSentRequests(res.sentRequests || []);
        setReceivedRequests(res.receivedRequests || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchRequests();
  }, [isLoggedIn, navigate, sendRequest]);

  const handleCancel = async (taskId) => {
    try {
      await sendRequest(
        `${import.meta.env.VITE_APP_BACKEND_URL}/tasks/cancel/${taskId}`,
        "POST"
      );
      setSentRequests((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error(err);
      alert("Failed to cancel request");
    }
  };

  const handleAccept = async (taskId) => {
    try {
      await sendRequest(
        `${import.meta.env.VITE_APP_BACKEND_URL}/tasks/accept/${taskId}`,
        "POST"
      );
      setReceivedRequests((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error(err);
      alert("Failed to accept request");
    }
  };

  const handleReject = async (taskId) => {
    try {
      await sendRequest(
        `${import.meta.env.VITE_APP_BACKEND_URL}/tasks/reject/${taskId}`,
        "POST"
      );
      setReceivedRequests((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.error(err);
      alert("Failed to reject request");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">
        In Progress Requests
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sent Requests */}
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-blue-700">
            Tasks I Requested
          </h3>
          {sentRequests.length === 0 && (
            <p className="text-gray-500">No requests sent yet.</p>
          )}
          {sentRequests.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-lg shadow p-4 mb-4 border border-gray-100"
            >
              <h4 className="text-lg font-medium text-gray-800">
                {task.title}
              </h4>
              <p className="text-sm text-gray-600 mb-2">{task.description}</p>
              <button
                onClick={() => handleCancel(task._id)}
                className="bg-yellow-500 text-white px-3 py-1 rounded-md text-sm hover:bg-yellow-600"
              >
                Cancel
              </button>
            </div>
          ))}
        </div>

        {/* Received Requests */}
        <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
          <h3 className="text-xl font-semibold mb-4 text-green-700">
            Tasks Requested to Me
          </h3>
          {receivedRequests.length === 0 && (
            <p className="text-gray-500">No requests received yet.</p>
          )}
          {receivedRequests.map((task) => (
            <div
              key={task._id}
              className="bg-white rounded-lg shadow p-4 mb-4 border border-gray-100"
            >
              <h4 className="text-lg font-medium text-gray-800">
                {task.title}
              </h4>
              <p className="text-sm text-gray-600 mb-2">{task.description}</p>
              <div className="space-x-2">
                <button
                  onClick={() => handleAccept(task._id)}
                  className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600"
                >
                  Accept
                </button>
                <button
                  onClick={() => handleReject(task._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded-md text-sm hover:bg-red-600"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default RequestsPage;
