import React, { useState } from "react";
import "./Styles.css";

const CreateSwap = () => {
  const [title, setTitle] = useState("");
  const [task, setTask] = useState("");
  const [desc, setDesc] = useState("");
  const [requirements, setRequirements] = useState("");

  //this is the culprit, wasted my half day
  /* useEffect(() => {
    const loggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!loggedIn) {
      navigate("/login", { state: { from: "/create-swap" } });
    }
  }, [navigate]); */

  const submit = () => {
    if (!title || !task) return alert("Please add title and task");
    console.log({ title, task, desc, requirements });
    setTitle("");
    setTask("");
    setDesc("");
    setRequirements("");
    alert("Swap created (preview)");
  };

  return (
    <div className="page">
      <h2>Create a Swap</h2>
      <div className="card form">
        <input
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          placeholder="Task"
          value={task}
          onChange={(e) => setTask(e.target.value)}
        />
        <textarea
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
        />
        <textarea
          placeholder="Swap Requirements"
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
        />
        <div className="row">
          <button className="btn" onClick={submit}>
            Add Swap
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateSwap;
