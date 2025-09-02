import { Routes, Route, Navigate } from "react-router-dom";
import NavBar from "./components/layout/NavBar";
// import HeroSection from "./components/HeroSection";
import HowItWorks from "./components/layout/HowItWorks";
import CreateSwap from "./components/layout/CreateSwap";
import UserCard from "./components/layout/UserCard";
import MyTask from "./components/user/MyTask";
import Settings from "./components/user/Settings";
import ProfileView from "./components/user/ProfileView";
import SignIn from "./components/auth/SignIn";
import PrivateRoute from "./PrivateRoute";
import ConfirmSignupPage from "./components/auth/ConfirmSignupPage";
import ResetPasswordPage from "./components/auth/ResetPasswordPage";
import RequestsPage from "./components/layout/RequestsPage";

function App() {
  
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<UserCard />} />
        <Route
          path="/create-swap"
          element={
            <PrivateRoute>
              <CreateSwap />
            </PrivateRoute>
          }
        />
        <Route path="/settings" element={<Settings />} />
        <Route
          path="/profileview"
          element={
            <ProfileView user={JSON.parse(localStorage.getItem("user"))} />
          }
        />
        <Route path="/mytask" element={<MyTask />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/confirm-signup" element={<ConfirmSignupPage />} />
        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
        <Route
          path="/requests"
          element={
            <PrivateRoute>
              <RequestsPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
