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

  const handleAccept = async (taskId, userId) => {
    try {
      await sendRequest(
        `${
          import.meta.env.VITE_APP_BACKEND_URL
        }/tasks/accept/${taskId}/${userId}`,
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
      <h2 className="text-2xl font-bold mb-6 text-gray-900 text-center">
        In Progress Requests
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sent Requests */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="w-6 h-6 text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M3 10a1 1 0 011-1h8.586l-3.293-3.293a1 1 0 111.414-1.414l5 5a1 1 0 
                010 1.414l-5 5a1 1 0 01-1.414-1.414L12.586 11H4a1 1 0 
                01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-lg font-semibold text-blue-600">
              Tasks I Requested
            </h3>
          </div>
          {sentRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 rounded-md py-12">
              <svg
                className="w-10 h-10 mb-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 21H5a2 2 0 01-2-2V5a2 2 
                  0 012-2h7l2 2h5a2 2 0 012 2v12a2 
                  2 0 01-2 2z"
                />
              </svg>
              <p>No requests sent yet.</p>
            </div>
          ) : (
            sentRequests.map((task) => (
              <div
                key={task._id}
                className="bg-gray-50 rounded-lg shadow p-4 mb-4 border border-gray-200"
              >
                <h4 className="text-base font-medium text-gray-800">
                  {task.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                <button
                  onClick={() => handleCancel(task._id)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm"
                >
                  Cancel
                </button>
              </div>
            ))
          )}
        </div>

        {/* Received Requests */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <svg
              className="w-6 h-6 text-green-600"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M17 10a1 1 0 00-1-1H7.414l3.293-3.293a1 1 0 
                00-1.414-1.414l-5 5a1 1 0 
                000 1.414l5 5a1 1 0 
                001.414-1.414L7.414 11H16a1 1 
                0 001-1z"
                clipRule="evenodd"
              />
            </svg>
            <h3 className="text-lg font-semibold text-green-600">
              Tasks Requested to Me
            </h3>
          </div>
          {receivedRequests.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-gray-500 border-2 border-dashed border-gray-200 rounded-md py-12">
              <svg
                className="w-10 h-10 mb-2 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M9 12l2 2 4-4m6 
                  2a9 9 0 11-18 0 9 9 0 
                  0118 0z"
                />
              </svg>
              <p>No requests received yet.</p>
            </div>
          ) : (
            receivedRequests.map((task) => (
              <div
                key={task._id}
                className="bg-gray-50 rounded-lg shadow p-4 mb-4 border border-gray-200"
              >
                <h4 className="text-base font-medium text-gray-800">
                  {task.title}
                </h4>
                <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                <div className="space-x-2">
                  <button
                    onClick={() => handleAccept(task._id, task.requestedBy?.id)}
                    className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleReject(task._id)}
                    className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm"
                  >
                    Reject
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default RequestsPage;
