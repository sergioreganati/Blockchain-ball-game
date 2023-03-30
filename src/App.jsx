import { useState, useEffect } from 'react';
import CanvasComponent from './components/CanvasComponent.jsx';
import './App.css';


function App() {

  // Prevent scrolling on mobile
  function preventTouchMove(event) {
    event.preventDefault();
  }
  function toggleScrolling(disable) {
    if (disable) {
      document.body.classList.add('no-scroll');
      document.addEventListener('touchmove', preventTouchMove, { passive: false });
    } else {
      document.body.classList.remove('no-scroll');
      document.removeEventListener('touchmove', preventTouchMove, { passive: false });
    }
  }
  toggleScrolling(true);
// End prevent scrolling on mobile
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(0);
  const [lives, setLives] = useState(0);
  const [highScore, setHighScore] = useState(0);

  const receiveStats = (score, level, lives, highScore) => {
    setScore(score);
    setLevel(level);
    setLives(lives);
    setHighScore(highScore);
    //console.log("score: " + score + " level: " + level + " lives: " + lives + " highScore: " + highScore);
  };
  
  useEffect(() => {
    return () => {
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
            {score}
          </div>
          <div className="Stats-box">
            Level:
            <br />
            {level}
          </div>
          <div className="Stats-box">
            Lives:
            <br />
            {lives}
          </div>
          <div className="Stats-box">
            H Score:
            <br />
            {highScore}
          </div>
        </div>
        <CanvasComponent onValueChange={receiveStats}/>

      </main>
      <footer>
        <p></p>
      </footer>
    </div>
  );
}

export default App;

