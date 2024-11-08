import React, { useState } from "react";
import Editor from "react-simple-code-editor";
import { highlight, languages } from "prismjs";
import "prismjs/components/prism-css";
import "prismjs/themes/prism-okaidia.css";
import pic from "./assets/bike.png";

const StyleGame = () => {
  const [customStyles, setCustomStyles] = useState("");
  const [showClassNames, setShowClassNames] = useState(true);
  const [selectedColor, setSelectedColor] = useState("#ffffff");

  const handleStyleChange = (code) => {
    let validCSS = code.replace(/"([^"]*)"/g, "$1");
    setCustomStyles(validCSS);
  };

  const toggleClassNames = () => {
    setShowClassNames((prev) => !prev);
  };

  const handleColorChange = (event) => {
    setSelectedColor(event.target.value);
  };

  return (
    <div className="game-container">
      <div className="right-field">
        <h2>CSS Style Game</h2>
        <div className="input-section">
          <Editor
            value={customStyles}
            onValueChange={handleStyleChange}
            highlight={(code) => highlight(code, languages.css, "css")}
            padding={10}
            style={{
              backgroundColor: "#272822",
              color: "#f8f8f2",
              borderRadius: "5px",
              border: "1px solid #4a4a4a",
              minHeight: "450px",
              width: "100%",
            }}
          />
        </div>

        <div className="color-picker">
          <label htmlFor="colorInput">Choose a Color:</label>
          <input
            type="color"
            id="colorInput"
            value={selectedColor}
            onChange={handleColorChange}
          />
          <span>{selectedColor}</span> {/* Display the selected color value */}
        </div>

        {/* Buttons for showing/hiding class names */}
      </div>

      <div className="preview-section">
        <div className="button-section">
          <button onClick={toggleClassNames}>
            {showClassNames ? "Hide Class Names" : "Show Class Names"}
          </button>
        </div>
        <div className="styled-container" style={{ whiteSpace: "pre" }}>
          {/* Apply hover-container directly to the .card element */}
          <div className="hover-container">
            <div className="card">
              {showClassNames && <span className="class-name">.card</span>}
              <div className="hover-container">
                <img className="image" src={pic} alt="Placeholder" />
                {showClassNames && <span className="class-name">.image</span>}
              </div>
              <div className="hover-container">
                <h1 className="heading">Game Heading</h1>
                {showClassNames && <span className="class-name">.heading</span>}
              </div>
              <div className="hover-container">
                <p className="content">
                  This is some content in the container.
                </p>
                {showClassNames && <span className="class-name">.content</span>}
              </div>
              <div className="hover-container">
                <button className="button">Click Me</button>
                {showClassNames && <span className="class-name">.button</span>}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Live styles application */}
      <style>
        {customStyles}
        
      </style>
    </div>
  );
};

export default StyleGame;
