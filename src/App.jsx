import { useState } from "react";
import "./App.css";

function App() {
  return (
    <>
      <h1 id="appName">True or False?</h1>
      <div class="questionCard">
        <p id="question">Welcome to the game!</p>
      </div>
      <div id="answers">
        <button id="true" onclick="trueButton();">
          True
        </button>
        <span>or</span>
        <button id="false" onclick="falseButton();">
          False
        </button>
      </div>
      <div id="score">
        <span>Score: </span>
        <span id="points">0</span>
      </div>
      <ul id="badList"></ul>
      <div id="restart"></div>
    </>
  );
}

export default App;
