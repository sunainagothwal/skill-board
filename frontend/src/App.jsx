import { Routes, Route } from "react-router-dom";
import NavBar from "./components/NavBar";
// import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/HowItWorks";
import CreateSwap from "./components/CreateSwap";
import UserCard from "./components/UserCard";
import MyTask from "./components/MyTask";
import Settings from "./components/Settings";
import ProfileView from "./components/ProfileView";
import LoginAndRegister from "./components/LoginAndRegistration";

function App() {
  const users = [
    {
      name: "Sunaina",
      city: "Delhi",
      knows: "JavaScript, React",
      wants: "Full-Stack Projects",
      img: "https://randomuser.me/api/portraits/women/68.jpg",
      description:
        "A passionate developer eager to build modern web applications.",
    },
    {
      name: "Bhagirath",
      city: "Bengaluru",
      knows: "UI/UX Design, React.js",
      wants: "Front-End Internships",
      img: "https://randomuser.me/api/portraits/men/61.jpg",
      description:
        "Creative designer focused on crafting user-friendly interfaces.",
    },
    {
      name: "Ishita",
      city: "Mumbai",
      knows: "Yoga Basics",
      wants: "Digital Marketing",
      img: "https://randomuser.me/api/portraits/women/72.jpg",
      description:
        "Wellness enthusiast aiming to blend health and digital outreach.",
    },
    {
      name: "Arjun",
      city: "Chandigarh",
      knows: "Photography",
      wants: "Public Speaking",
      img: "https://randomuser.me/api/portraits/men/55.jpg",
      description: "Visual storyteller seeking to inspire through spoken word.",
    },
    {
      name: "Priya",
      city: "Hyderabad",
      knows: "Content Writing, SEO",
      wants: "Freelance Writing Projects",
      img: "https://randomuser.me/api/portraits/women/44.jpg",
      description:
        "Wordsmith dedicated to creating impactful and engaging content.",
    },
    {
      name: "Rohit",
      city: "Pune",
      knows: "Node.js, Express",
      wants: "Back-End Development Jobs",
      img: "https://randomuser.me/api/portraits/men/34.jpg",
      description:
        "Back-end developer passionate about building scalable systems.",
    },
    {
      name: "Ananya",
      city: "Kolkata",
      knows: "Graphic Design, Photoshop",
      wants: "Branding Projects",
      img: "https://randomuser.me/api/portraits/women/36.jpg",
      description:
        "Design enthusiast who loves creating strong brand identities.",
    },
    {
      name: "Kabir",
      city: "Ahmedabad",
      knows: "Python, Machine Learning",
      wants: "AI Research Opportunities",
      img: "https://randomuser.me/api/portraits/men/50.jpg",
      description:
        "Tech explorer fascinated by the future of artificial intelligence.",
    },
    {
      name: "Meera",
      city: "Jaipur",
      knows: "Event Planning",
      wants: "Wedding Planning Projects",
      img: "https://randomuser.me/api/portraits/women/20.jpg",
      description:
        "Detail-oriented planner who loves crafting memorable events.",
    },
    {
      name: "Aman",
      city: "Lucknow",
      knows: "Video Editing, Premiere Pro",
      wants: "Film Editing Jobs",
      img: "https://randomuser.me/api/portraits/men/23.jpg",
      description:
        "Creative editor passionate about storytelling through videos.",
    },
  ];

  return (
    <>
      <NavBar />
      <Routes>
        <Route
          path="/"
          element={
            <>
              <UserCard users={users} />
              {/* <HeroSection /> */}
              <HowItWorks />
            </>
          }
        />
        <Route path="/usercard" element={<UserCard users={users} />} />
        <Route path="/create-swap" element={<CreateSwap />} />
        <Route path="/settings" element={<Settings />} />
        <Route
          path="/profileview"
          element={
            <ProfileView user={JSON.parse(localStorage.getItem("user"))} />
          }
        />
        <Route path="/mytask" element={<MyTask />} />
        <Route path="/login" element={<LoginAndRegister />} />
      </Routes>
    </>
  );
}

export default App;
