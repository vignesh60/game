import React, { useState, useEffect } from 'react';
import axios from 'axios';

const LeaderBoard = () => {
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await axios.get('http://localhost:4000/leaderboard');
        setLeaderboard(response.data);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
      }
    };

    fetchLeaderboard();
  }, []);

  return (
    <div className="leaderboard-container">
      <h3>Leaderboard</h3>
      <ul>
        {leaderboard.length > 0 ? (
          leaderboard.map((player, index) => (
            <li key={index}>
              {index + 1}. {player.name} <p>{player.score}</p>
            </li>
          ))
        ) : (
          <li className="no-data">No data available</li>
        )}
      </ul>
    </div>
  );
};

export default LeaderBoard;
