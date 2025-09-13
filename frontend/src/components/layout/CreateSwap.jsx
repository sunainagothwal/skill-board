import React, { useState } from "react";
import { useHttpClient } from "../../common/hooks/http-hook.js";
import { showSuccess } from "../../common/toastHelper";

const CreateSwap = () => {
  const { sendRequest } = useHttpClient();
  const [taskDetails, setTaskDetails] = useState({
    title: "",
    description: "",
    requestedTask: "",
    offeredTask: "",
    location: "",
    attachments: "",
    deadline: "",
  });
  const [errors, setErrors] = useState({
    title: "",
    description: "",
    requestedTask: "",
    offeredTask: "",
    location: "",
    attachments: "",
    deadline: "",
  });

  const validate = () => {
    const newErrors = {};
    if (!taskDetails.title.trim()) newErrors.title = "Title is required.";
    if (!taskDetails.description.trim())
      newErrors.description = "Description is required.";
    if (!taskDetails.requestedTask.trim())
      newErrors.requestedTask = "Requested task is required.";
    if (!taskDetails.offeredTask.trim())
      newErrors.offeredTask = "Offered task is required.";
    if (!taskDetails.location.trim())
      newErrors.location = "Location is required.";
    if (!taskDetails.deadline) newErrors.deadline = "Deadline is required.";
    // Attachments are optional, but you can add validation if needed
    return newErrors;
  };
  /* setTaskDetails({
        title: "",
        description: "",
        requestedTask: "",
        offeredTask: "",
        location: "",
        attachments: "",
        deadline: "",
      }); */

  const submitTask = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length === 0) {
      const formData = new FormData();
      formData.append("title", taskDetails.title);
      formData.append("description", taskDetails.description);
      formData.append("requestedTask", taskDetails.requestedTask);
      formData.append("offeredTask", taskDetails.offeredTask);
      formData.append("location", taskDetails.location);
      formData.append("deadline", taskDetails.deadline);
      if (taskDetails.attachments) {
        formData.append("image", taskDetails.attachments);
      }

      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_APP_BACKEND_URL}/tasks`,
          "POST",
          formData,
          null // Let browser set Content-Type with boundary for multipart/form-data
        );
        if (responseData) {
          showSuccess("Swap created successfully!");
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  return (
    <div className="page">
      <h2>Create a Swap</h2>
      <form className="card form" onSubmit={submitTask} noValidate>
        <label>Title</label>
        <input
          placeholder="e.g., Garden Weeding for Dog Walking"
          value={taskDetails.title}
          onChange={(e) => {
            setTaskDetails({ ...taskDetails, title: e.target.value });
            setErrors((prev) => ({ ...prev, title: "" }));
          }}
        />
        {errors.title && <div className="error">{errors.title}</div>}

        <label>Description</label>
        <textarea
          placeholder="Provide more details about your swap..."
          value={taskDetails.description}
          onChange={(e) => {
            setTaskDetails({ ...taskDetails, description: e.target.value });
            setErrors((prev) => ({ ...prev, description: "" }));
          }}
        />
        {errors.description && (
          <div className="error">{errors.description}</div>
        )}

        <label>Requested Task</label>
        <input
          placeholder="What do you need help with?"
          value={taskDetails.requestedTask}
          onChange={(e) => {
            setTaskDetails({ ...taskDetails, requestedTask: e.target.value });
            setErrors((prev) => ({ ...prev, requestedTask: "" }));
          }}
        />
        {errors.requestedTask && (
          <div className="error">{errors.requestedTask}</div>
        )}

        <label>Offered Task</label>
        <input
          placeholder="What can you offer in return?"
          value={taskDetails.offeredTask}
          onChange={(e) => {
            setTaskDetails({ ...taskDetails, offeredTask: e.target.value });
            setErrors((prev) => ({ ...prev, offeredTask: "" }));
          }}
        />
        {errors.offeredTask && (
          <div className="error">{errors.offeredTask}</div>
        )}

        <label>Location</label>
        <input
          placeholder="e.g., Downtown, Springfield"
          value={taskDetails.location}
          onChange={(e) => {
            setTaskDetails({ ...taskDetails, location: e.target.value });
            setErrors((prev) => ({ ...prev, location: "" }));
          }}
        />
        {errors.location && <div className="error">{errors.location}</div>}

        <label>Upload an Image (Optional)</label>
        <div className="upload-box">
          <div className="upload-content">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="upload-svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6h.1a5 5 0 011 9.9M12 12v9m0 0l-3-3m3 3l3-3"
              />
            </svg>
            <span>
              <u>Upload a file</u> or drag and drop
            </span>
            <small>PNG, JPG, GIF up to 10MB</small>
          </div>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              if (file && file.type.startsWith("image/")) {
                setTaskDetails({ ...taskDetails, attachments: file });
                setErrors((prev) => ({ ...prev, attachments: "" }));
              } else {
                setTaskDetails({ ...taskDetails, attachments: "" });
                setErrors((prev) => ({
                  ...prev,
                  attachments: "Only images are allowed.",
                }));
              }
            }}
          />
        </div>
        {errors.attachments && (
          <div className="error">{errors.attachments}</div>
        )}

        <label>Preferred Deadline</label>
        <input
          type="date"
          value={taskDetails.deadline}
          onChange={(e) => {
            setTaskDetails({ ...taskDetails, deadline: e.target.value });
            setErrors((prev) => ({ ...prev, deadline: "" }));
          }}
        />
        {errors.deadline && <div className="error">{errors.deadline}</div>}

        <div className="row">
          <button className="btn" type="submit">
            Add Swap
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateSwap;
