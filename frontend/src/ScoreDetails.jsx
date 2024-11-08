import React, { useState, useEffect } from "react";
import axios from "axios";

const ScoreDetails = ({ email }) => {
  const [scoreDetails, setScoreDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchScoreDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/getUserScore/${email}`);
        setScoreDetails(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error fetching score details");
        setLoading(false);
      }
    };

    if (email) {
      fetchScoreDetails();
    }
  }, [email]);

  if (loading) {
    return <p>Loading score details...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="score-details-container">
      {scoreDetails ? (
        <div>
          <h3>{scoreDetails.name}'s Score</h3>
          <p>Email: {scoreDetails.email}</p>
          <p>Score: {scoreDetails.score}</p>
          <h4>Game Results</h4>
          <ul>
            {scoreDetails.results.map((result, index) => (
              <li key={index} className="score-field">
                <p>Score: {result.score}</p> <p>|</p> <p>Date: {new Date(result.date).toLocaleString()}</p>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="no-data">No score details found.</p>
      )}
    </div>
  );
};

export default ScoreDetails;
