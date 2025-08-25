import React from "react";
import HowItWorks from "./HowItWorks.jsx";
import { useHttpClient } from "../../common/hooks/http-hook.js";

const UserCard = () => {
  const { sendRequest } = useHttpClient();
  const [tasksList, setTasksList] = React.useState([]);
  React.useEffect(() => {
    const getAllTasks = async () => {
      try {
        const responseData = await sendRequest(
          `${import.meta.env.VITE_APP_BACKEND_URL}/tasks`
        );
        if (responseData) {
          setTasksList(responseData.tasks)
          console.log(responseData);
          /* console.log(
            responseData.tasks.map((task) =>
              formatUTCToLocal(task.deadline, false)

            )
          ); */
        }
      } catch (err) {
        console.error(err);
      }
    };

    getAllTasks();
  }, []);

  return (
    <>
      <section className="page ">
        <h2 className="section_title">People on SkillBoard</h2>
        <div className="user_list">
          {tasksList.map((singleTask, index) => (
            <div className="user_card" key={index}>
              <img
                src={`${import.meta.env.VITE_APP_ASSET_URL}/${
                  singleTask.creator.image
                }`}
                alt={singleTask.creator.name}
                className="profile_img"
              />

              <div className="user_center">
                <h3>{singleTask.creator.name}</h3>
                <p className="city">{singleTask.location}</p>
                <div className="skills offeredSkill">
                  {singleTask.offeredTask.map((singleOfferedTask, i) => (
                    <span key={i} className="skill_tag">
                      {singleOfferedTask.trim()}
                    </span>
                  ))}
                </div>
                <p className="description">{singleTask.description}</p>
              </div>

              <div className="user_right">
                <button className="connect_btn" onClick={() => {}}>
                  Connect
                </button>
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
