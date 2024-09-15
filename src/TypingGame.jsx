import React, { useState, useEffect } from "react";

const paragraphs = [
  "The quick brown fox jumps over the lazy dog.",
  "Typing is an essential skill in the modern world.",
  "Learning to type fast and accurately takes practice.",
  "Programming requires both patience and creativity.",
  // Add more paragraphs if needed
];

const TypingGame = () => {
  const [currentParagraph, setCurrentParagraph] = useState("");
  const [userInput, setUserInput] = useState("");
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isGameActive, setIsGameActive] = useState(false);
  const [startTime, setStartTime] = useState(0);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [wrongLetters, setWrongLetters] = useState(0);
  const [customParagraph, setCustomParagraph] = useState("");

  // Function to start the game with either a random or custom paragraph
  const startGame = (duration) => {
    if (customParagraph) {
      setCurrentParagraph(customParagraph);
    } else {
      const randomParagraph =
        paragraphs[Math.floor(Math.random() * paragraphs.length)];
      setCurrentParagraph(randomParagraph);
    }
    setUserInput("");
    setIsGameActive(true);
    setTimeRemaining(duration);
    setStartTime(Date.now());
    setWpm(0);
    setAccuracy(100);
    setWrongLetters(0);
  };

  // Handle user input and check for correctness
  const handleInput = (e) => {
    const input = e.target.value;
    setUserInput(input);

    const correctChars = input.split("").filter((char, index) => {
      return char === currentParagraph[index];
    }).length;

    const incorrectChars = input.length - correctChars;
    setWrongLetters(incorrectChars);

    const accuracy = (correctChars / input.length) * 100 || 100;
    setAccuracy(accuracy.toFixed(2));

    // Every mistake reduces WPM
    const penaltyFactor = 0.1; // Penalty factor for every wrong letter
    const adjustedWpm = calculateWpm(input, incorrectChars, penaltyFactor);

    setWpm(adjustedWpm);

    if (input === currentParagraph) {
      endGame();
    }
  };

  // WPM calculation with penalty for mistakes
  const calculateWpm = (input, mistakes, penaltyFactor) => {
    const minutesElapsed = (Date.now() - startTime) / 60000;
    const wordCount = input.split(" ").filter(Boolean).length;
    const rawWpm = (wordCount / minutesElapsed).toFixed(2);

    // Apply penalty for mistakes
    const penalty = mistakes * penaltyFactor;
    const adjustedWpm = rawWpm - penalty > 0 ? rawWpm - penalty : 0;

    return adjustedWpm;
  };

  // Timer functionality
  useEffect(() => {
    if (isGameActive && timeRemaining > 0) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && isGameActive) {
      endGame();
    }
  }, [timeRemaining, isGameActive]);

  // End the game
  const endGame = () => {
    setIsGameActive(false);
  };

  return (
    <div className="typing-game">
      <h1>Typing Game</h1>

      {!isGameActive && (
        <div className="settings">
          <button onClick={() => startGame(15)}>Start (15s)</button>
          <button onClick={() => startGame(30)}>Start (30s)</button>
          <button onClick={() => startGame(60)}>Start (1m)</button>
          <button onClick={() => startGame(120)}>Start (2m)</button>

          <textarea
            placeholder="Enter your own paragraph here..."
            onChange={(e) => setCustomParagraph(e.target.value)}
          ></textarea>
        </div>
      )}

      {isGameActive && (
        <div>
          <p>Time Remaining: {timeRemaining}s</p>
          <div className="paragraph">
            {currentParagraph.split("").map((char, index) => {
              let color;
              if (index < userInput.length) {
                color = char === userInput[index] ? "#02b050" : "red";
              }
              return (
                <span key={index} style={{ color: color,fontWeight:"700" }}>
                  {char}
                </span>
              );
            })}
          </div>
          <input
            type="text"
            value={userInput}
            onChange={handleInput}
            autoFocus
          />
        </div>
      )}

      {!isGameActive && userInput && (
        <div className="results">
          <p>WPM: {wpm}</p>
          <p>Accuracy: {accuracy}%</p>
          <p>Wrong Letters: {wrongLetters}</p>
        </div>
      )}
    </div>
  );
};

export default TypingGame;
