🎯 Arrow Shooter Game

Arrow Shooter is an interactive, browser-based game built with React, Konva, and Socket.io. In this action-packed game, players control a character who defends against a wave of descending enemies using arrows. The challenge intensifies as the game progresses, testing players’ reflexes and precision!

🎮 Gameplay

    Objective: Aim and shoot arrows at enemies descending from the top of the screen. Each successful hit scores points, and the game becomes progressively harder as enemies spawn more frequently and move faster.

    Controls:
        Mouse Move: Position the character left or right at the bottom of the screen.
        Right Click: Shoot an arrow upwards.
        Buttons: Use the "Start," "Pause," "Resume," and "Restart" buttons to control the game’s flow.

    Game Flow:
        As the game starts, enemies spawn and descend toward the player. For every successful hit, the player’s score increases. If an enemy reaches the bottom of the screen, the game ends, and the final score is displayed.

🚀 Features

    Real-Time Interaction: The game updates dynamically, using Socket.io to enable real-time actions and responses.

    Scoring System: Every hit on an enemy increments the player's score, displayed in real-time.

    Difficulty Scaling: Enemy speed and spawn rate increase over time, making gameplay progressively challenging.

    User Persistence: The game stores the player’s name and email with localStorage for a personalized experience.

    Game Controls: Players can start, pause, resume, and restart the game at any time.

🛠 Technology Stack

    Frontend:
        React for component-based UI
        react-konva for canvas rendering
        Socket.io-client for real-time communication
    Backend:
        Socket.io server for real-time event handling and score management

📜 How to Play

    Start the Game: Press the "Start" button to begin.
    Move & Aim: Use your mouse to position the character left or right.
    Shoot: Right-click to shoot arrows at enemies descending from above.
    Avoid Losing: If an enemy reaches the bottom of the screen, the game will end, displaying your final score.

![Screenshot (422)](https://github.com/user-attachments/assets/21c79250-cf92-427b-b476-32934956d046)
![Screenshot (419)](https://github.com/user-attachments/assets/b4d59a45-768d-492f-80ef-a1a24512265c)
![Screenshot (420)](https://github.com/user-attachments/assets/6059fbfd-ad0d-4901-8fd1-13ae23268d36)
![Screenshot (421)](https://github.com/user-attachments/assets/08455944-463e-4929-a139-4177c9a4a261)


