import React, { useEffect, useState } from "react";
import Game from "./Game";
import ScoreDetails from "./ScoreDetails";
import LeaderBoard from "./LeaderBoard";

function App() {
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(""); 
  const [loginEmail, setLoginEmail] = useState(""); 
  const [loginName, setLoginName] = useState("");
  const [showScoreDetails, setShowScoreDetails] = useState(false);
  const [showLeaderBoard, setShowLeaderBoard] = useState(false); 

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser);
      setEmail(user.email);
      setName(user.name);
    }
  }, []);

  const handleShowScoreDetails = () => {
    setShowScoreDetails(true);
  };

  const handleShowLeaderBoard = () => {
    setShowLeaderBoard(true);
  };

  const handleCloseScoreDetails = () => {
    setShowScoreDetails(false);
  };

  const handleCloseLeaderBoard = () => {
    setShowLeaderBoard(false);
  };

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginName && loginEmail) {
      const userData = { name: loginName, email: loginEmail };
      localStorage.setItem("user", JSON.stringify(userData));
      setEmail(loginEmail); // Set authenticated email
      setName(loginName); // Set authenticated name
    }
  };

  if (!email) {
    return (
      <div className="login-container">
        <form onSubmit={handleLoginSubmit}>
        <h2>Please log in</h2>
          <div>
            <label>
              Name:
              <input
                type="text"
                value={loginName}
                onChange={(e) => setLoginName(e.target.value)}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Email:
              <input
                type="email"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </label>
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    );
  }

  return (
    <div className="app-container">
      <div className="grid-container">
        <div className="grid-item score-leader-container">
          <button onClick={handleShowScoreDetails}>Show Score Details</button>
          <button onClick={handleShowLeaderBoard}>Show Leaderboard</button>
        </div>
        <div className="grid-item">
          <Game />
        </div>
      </div>

      {/* ScoreDetails overlay */}
      {showScoreDetails && (
        <div className="overlay">
          <div className="modal">
            <ScoreDetails email={email} />
            <button onClick={handleCloseScoreDetails} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}

      {/* LeaderBoard overlay */}
      {showLeaderBoard && (
        <div className="overlay">
          <div className="modal">
            <LeaderBoard />
            <button onClick={handleCloseLeaderBoard} className="close-btn">
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
