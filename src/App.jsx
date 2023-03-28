import { useState, useEffect } from 'react';
import CanvasComponent from '../components/CanvasComponent.jsx';
import './App.css';

function initializeGame() {
  console.log('Initialize Game');
}

function App() {
  let [isPaused, setIsPaused] = useState(false);
  let [leftPressed, setLeftPressed] = useState(false);
  let [rightPressed, setRightPressed] = useState(false);
  

  function handleStart() {
    console.log('Start Game');
  }
  
  function handlePause() {
    console.log('Pause Game');
    setIsPaused(!isPaused);
  }
  
  function handleReset() {
    console.log('Reset Game');
  }
  
  function handleKeyDown(event) {
    if (event.keyCode === 37) {
      setLeftPressed(true);
    } else if (event.keyCode === 39) {
      setRightPressed(true);
    }
  }
  function handleKeyUp(event) {
    if (event.keyCode === 37) {
      setLeftPressed(false);
    } else if (event.keyCode === 39) {
      setRightPressed(false);
    }
  }
  useEffect(() => {
   //document.addEventListener('left-btn', handleKeyDown);


    
    //document.addEventListener('keydown', handleKeyDown);
    //document.addEventListener('keyup', handleKeyUp);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  return (
    <div className="App">
      <header className="Title">
        <h1>Blockchain Pong Game</h1>
      </header>
      <main>
        <div className="Stats">
          <div className="Stats-box">
            Score:
            <br />
            34{/* Display the score here */}
          </div>
          <div className="Stats-box">
            Level:
            <br />
            34{/* Display the level here */}
          </div>
          <div className="Stats-box">
            Lives:
            <br />
            4{/* Display the remaining lives here */}
          </div>
          <div className="Stats-box">
            H Score:
            <br />
            209
          </div>
        </div>
        <div className="Mobile-controls">
          <button color="primary" onClick={handleStart}>
            Start Game
          </button>
          <button color="primary" onClick={handlePause}>
          {isPaused ? 'Resume' : 'Pause'}
          </button>
          <button color="primary" onClick={handleReset}>
            Reset Game
          </button>
        </div>
        <CanvasComponent isPaused={isPaused}/>

      </main>
      <footer>
        <p></p>
      </footer>
    </div>
  );
}

export default App;

