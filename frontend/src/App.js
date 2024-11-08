import React, { useEffect, useState } from "react";
import Game from "./Game";
import ScoreDetails from "./ScoreDetails";
import LeaderBoard from "./LeaderBoard";

function App() {
  const [email, setEmail] = useState(null);
  const [showScoreDetails, setShowScoreDetails] = useState(false); // State to toggle ScoreDetails
  const [showLeaderBoard, setShowLeaderBoard] = useState(false); // State to toggle LeaderBoard

  useEffect(() => {
    // Retrieve and parse user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const user = JSON.parse(storedUser); // Parse the stringified object
      setEmail(user.email); // Access the email property
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

  if (!email) {
    return <div>Please log in to see your score details and leaderboard.</div>;
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
