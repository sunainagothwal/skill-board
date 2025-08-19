import React, { useState } from "react";
import Login from "./Login";
import Signup from "./Signup";

const LoginAndRegister = () => {
  // State to toggle between login and registration
  const [showLogin, setShowLogin] = useState(true); 
  return (
    <div className="login_background">
      {showLogin ? <Login setShowLogin={setShowLogin} /> : <Signup setShowLogin={setShowLogin} />}
    </div>
  );
};

export default LoginAndRegister;
