import React, { useState, useRef, useEffect, Fragment} from 'react';
import './CanvasComponent.css';
import './GameComponents.js'
import { drawBall, drawPaddle } from './GameComponents.js';


//let lives = 3;
let highScore = parseInt(localStorage.getItem("highScore") || "0");
//let level =0;
let context;

let ball = { x: 0, y: 0, dx: 5, dy: -5, radius: 7 };
const ballInitial = ball
let paddle = {x: 0, y:0, dx:2, w: 75, h: 10};


const CanvasComponent = ({onValueChange}) => {
    console.log("Loading ....CanvasComponent")
    
    const canvasRef = useRef(null)
    const canvasContaierRef = useRef(null)
    const rightPressedRef=useRef(false);
    const leftPressedRef=useRef(false);
    const requestRef = useRef();

    const [canvasWidth, setCanvasWidth] = useState(400);
    const [canvasHeight, setCanvasHeight] = useState(600);
    const [isPaused, setIsPaused] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    
    const [score, setScore] = useState(0);
    const [lives, setLives] = useState(3);
    const [level, setLevel] = useState(0);

    const impactFactor = 0.5;

    //=======================================================================================
    // Functions----------------------------------------------
    //Determine Initial Conditions
    const determineCanvasSize = () => {
        //compare canvas size to container size
        const canvasContainerWidth = canvasContaierRef.current.offsetWidth;
        const canvasContainerHeight = canvasContaierRef.current.offsetHeight;
        const aspectRatio = Math.min(canvasContainerWidth / canvasWidth, canvasContainerHeight / canvasHeight);
        if (aspectRatio != 1 )
        {
            setCanvasWidth (canvasWidth * aspectRatio);
            setCanvasHeight (canvasHeight * aspectRatio);
        }
        context= canvasRef.current.getContext('2d');
    }
    const determineGameComponents = () => {
        //determine ball size and speed
        ball.radius = canvasWidth * 0.02;
        ball.dx = canvasWidth * 0.005;
        ball.dy = canvasHeight * 0.005;
        //determine paddle size and speed
        paddle.w = canvasWidth * 0.2;
        paddle.h = canvasHeight * 0.02;
        paddle.dx = canvasWidth * 0.01;
        paddle.y= canvasHeight;
    }
    const resetBall = () => {
        ball.x = canvasWidth/2;
        ball.y = canvasHeight*0.2;
        ball.dx = canvasWidth * 0.005;
        ball.dy = canvasHeight * 0.005;
    }
    
    //Draw Elements calling functions from GameComponents.js
    const drawElements = (context, ball, paddle, level) => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        updateBallPosition(context, ball, level);
        updatePaddlePosition(context, paddle, rightPressedRef.current, leftPressedRef.current)
        drawBall(context, ball);
        drawPaddle(context, paddle);
    }
    const updateBallPosition = (context, ball, level) => { 
        updateBallSpeed(ball, level);
        console.log("ball.dx: " + ball.dx*(level*0.05+1) + " ball.dy: " + ball.dy*(level*0.05+1));
        if (ball.x + ball.radius > context.canvas.width || ball.x - ball.radius < 0) {
          ball.dx = -ball.dx;
        }
        if (ball.y - ball.radius < 0) {
          ball.dy = -ball.dy;
        } else if (ball.y + ball.radius > context.canvas.height - paddle.h) {
          if (ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
            const impact = (ball.x - (paddle.x + paddle.w / 2)) / (paddle.w / 2);
            
            ball.dx = ball.dx * (1 + impactFactor * impact);
            ball.dy = -ball.dy;
            ball.y = context.canvas.height - paddle.h - ball.radius
            ball.y = context.canvas.height - paddle.h - ball.radius
            setScore(prevScore => {
              const newScore = prevScore + 1;
              setLevel(Math.floor(newScore/2))
              return newScore;
            });
            console.log(highScore)
          } else if (ball.y + ball.radius< context.canvas.height){
            setLives(prevLives => {
              const newLives = prevLives - 1;
              if(newLives<=0) {
                handleGameOver();
              } else  {
                resetBall();
                handlePause();
              }
              return newLives;
            });
          }
        }
      };
      const updateBallSpeed = (ball, level) => {
        ball.x += ball.dx*(level*0.05+1);
        ball.y += ball.dy*(level*0.05+1);
        console.log("ball.dx: " + ball.dx + " ball.dy: " + ball.dy);
        //console.log(ball)
      }
    const updatePaddlePosition = (context, paddle, rightPressed, leftPressed) => {
      if (leftPressed) {
          paddle.x -= paddle.dx;
          if (paddle.x < 0) {
              paddle.x = 0;
          }
      } else if (rightPressed) {
          paddle.x += paddle.dx;
          if (paddle.x + paddle.w > context.canvas.width) {
              paddle.x = context.canvas.width - paddle.w;  
          }
      }
      };
    const updateStats = (score, level, lives, highScore) => {
      if (score > highScore) {
        highScore = score;
        localStorage.setItem("highScore", highScore.toString());
      }
      onValueChange( score, level, lives, highScore);
      }
      const handleGameOver = () => {

        console.log("Game Over!!!!!!!!!!!!!!!!!!!!!!")
        setIsGameOver(true);
        setIsPaused(true);//
        setScore(0);
        setLives(3);
        setLevel(0);
        highScore = parseInt(localStorage.getItem("highScore"));
        ball.x = context.canvas.width / 2;
        ball.y = context.canvas.height * 0.2;
        //display game over message
        context.font = '48px Arial';
        context.fillStyle = 'red';
        context.fillText('Game Over', context.canvas.width / 2 - 100, context.canvas.height / 2);
      }
    //=======================================================================================
    //useEffect 1: initialize canvas and game components
    useEffect(() => {
      if (canvasRef.current == null || canvasRef.current == undefined) {
          return;
      }
      window.addEventListener('resize', determineCanvasSize);
      console.log("useEffect 1: initialize canvas and game components")
      determineCanvasSize();
      determineGameComponents();
      //reset ball and paddle positions
      ball.x = context.canvas.width / 2;
      ball.y = context.canvas.height * 0.2;
      paddle.x = (context.canvas.width - paddle.w) / 2;
      if (context == null || context == undefined) {
          return;
      }
      drawElements(context, ball, paddle, level);
    
      return () => {
          window.removeEventListener('resize', determineCanvasSize);
      }
    }, [canvasRef.current, canvasContaierRef.current, canvasWidth, canvasHeight]);

    //useEffect 2: game loop 
    useEffect(() => {
        console.log("useEffect 2: game loop")
        if (context == null || context == undefined) {
          return;
        }
          const gameLoop = () => {
            if(!isGameOver){
          drawElements(context, ball, paddle, level);   
          }
          requestRef.current = requestAnimationFrame(gameLoop);
        }
          if(!isPaused && !isGameOver) { 
          gameLoop();
          } else {
          cancelAnimationFrame(requestRef.current);
          }
          window.addEventListener('keydown', keyDownHandler);
          window.addEventListener('keyup', keyUpHandler);
          return () => {
          cancelAnimationFrame(requestRef.current);
          window.removeEventListener('keydown', keyDownHandler);
          window.removeEventListener('keyup', keyUpHandler);
          };
    }, [isPaused, isGameOver, level]);
    //useEffect 3: stats
    useEffect(() => {
      updateStats(score, level, lives, highScore);
      return () => {
      }
    }, [score, lives, level]);
    
    //=======================================================================================
    // Key handlers----------------------------------------------
    const keyDownHandler = (e) => {
        if (e.key === 'ArrowRight') {
          rightPressedRef.current = true;
        } else if (e.key === 'ArrowLeft') {
          leftPressedRef.current = true;
        } else if (e.key === 'p') {
          handlePause();
        }
      };
      const keyUpHandler = (e) => {
        if (e.key === 'ArrowRight') {
          rightPressedRef.current = false;
        } else if (e.key === 'ArrowLeft') {
          leftPressedRef.current = (false);
        } 
      };
      const handleLeftDown = (e) => {
        leftPressedRef.current = (true);
      }
      const handleLeftUp = (e) => {
        leftPressedRef.current = (false);
      }
      const handleRightDown = (e) => {
        rightPressedRef.current = (true);
        
      }
      const handleRightUp = (e) => {
        rightPressedRef.current = (false);
      }
      function handleStart() {
        console.log('Start Game');
      }
      function handlePause() {
          setIsPaused(!isPaused)
          setIsGameOver(false);
      }
      function handleReset() {
        console.log('Reset Game');
      }
    //=======================================================================================

    return (
        <Fragment>
                    <div className="Mobile-controls">
          <button color="primary" onClick={handleStart}>
            Start Game
          </button>
          <button color="primary" onClick={handlePause}>
          {isGameOver ? 'Restart' :(isPaused ? 'Resume' : 'Pause')}
          </button>
          <button color="primary" onClick={handleReset}>
            Reset Game
          </button>
        </div>

        <div className="canvas-container" ref={canvasContaierRef}>
        <canvas
          ref={canvasRef}
          width={canvasWidth}
          height={canvasHeight}
          
        />
        </div>
                <div className="Mobile-controls">
                <button color="primary" type="button" className="control" value="left" onMouseDown={handleLeftDown} onMouseUp={handleLeftUp} onTouchStart={handleLeftDown} onTouchEnd={handleLeftUp}>
                  Left
                </button>
                <button color="primary" type="button" className="control" value= "right" onMouseDown={handleRightDown} onMouseUp={handleRightUp} onTouchStart={handleRightDown} onTouchEnd={handleRightUp}>
                  Right
                </button>
              </div>
        </Fragment>
      );

}

export default CanvasComponent;