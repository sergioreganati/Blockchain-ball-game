import React, { useState, useRef, useEffect, Fragment} from 'react';
import './CanvasComponent.css';
import './GameComponents.js'
import { drawBall, drawPaddle } from './GameComponents.js';


let score = 0;
let level = 0;
let lives = 3;
let highScore = 0;

let context;

let ball = { x: 0, y: 0, dx: 5, dy: -5, radius: 7 };
let paddle = {x: 0, y:0, dx:2, w: 75, h: 10};


const CanvasComponent = ({onValueChange}) => {
    console.log("Loading ....CanvasComponent with props: ")
    
    const canvasRef = useRef(null)
    const canvasContaierRef = useRef(null)
    const rightPressedRef=useRef(false);
    const leftPressedRef=useRef(false);

    
    
    const [canvasWidth, setCanvasWidth] = useState(400);
    const [canvasHeight, setCanvasHeight] = useState(600);
    const [isPaused, setIsPaused] = useState(false);

    const [leftPressed, setLeftPressed] = useState(false);

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
            //update ball size and speed
        }
        context= canvasRef.current.getContext('2d');
    }
    const determineGameComponents = () => {
        //determine ball size and speed
        ball.radius = canvasWidth * 0.02;
        ball.dx = canvasWidth * 0.01;
        ball.dy = canvasHeight * 0.01;
        //determine paddle size and speed
        paddle.w = canvasWidth * 0.2;
        paddle.h = canvasHeight * 0.02;
        paddle.dx = canvasWidth * 0.01;
        paddle.y= canvasHeight;

    }
    
    //Draw Elements calling functions from GameComponents.js
    const drawElements = (context, ball, paddle, canvasWidth, canvasHeight) => {
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        updateBallPosition(context, ball);
        updatePaddlePosition(context, paddle, rightPressedRef.current, leftPressedRef.current, canvasWidth, canvasHeight)
        drawBall(context, ball);
        drawPaddle(context, paddle);
        //requestAnimationFrame(() => drawElements(context, ball, paddle));
        
    }
    const updateBallPosition = (context, ball) => { //<<<Needs word so the ball does not go inside paddle
        ball.x += ball.dx;
        ball.y += ball.dy;
    
        if (ball.x + ball.radius > context.canvas.width || ball.x - ball.radius < 0) {
          ball.dx = -ball.dx;
        }
    
        if (ball.y - ball.radius < 0) {
          ball.dy = -ball.dy;
        } else if (ball.y + ball.radius > context.canvas.height - paddle.h) {
          if (ball.x > paddle.x && ball.x < paddle.x + paddle.w) {
            ball.dy = -ball.dy;
            ball.y = context.canvas.height - paddle.h - ball.radius
          } else {
            //alert('Game Over');
            return
            //document.location.reload();
          }
        }
      };
      const updatePaddlePosition = (context, paddle, rightPressed, leftPressed, canvasWidth, canvasHeight) => {
        if (leftPressed) {
            paddle.x -= paddle.dx;
            if (paddle.x < 0) {
                paddle.x = 0;
            }
        } else if (rightPressed) {
            paddle.x += paddle.dx;
            if (paddle.x + paddle.w > canvasWidth) {
                paddle.x = canvasWidth - paddle.w;  
            }
        }
        };

    //=======================================================================================    
    const useValuesAsRef = (...values) => {
      const valueRef = useRef(values);
    
      useEffect(() => {
        console.log("useEffect: useValuesAsRef")
        valueRef.current = values;
      }, [values]);
    
      return valueRef;
    };
    const dimensionsRef = useValuesAsRef(canvasWidth, canvasHeight);
    
    //=======================================================================================
    //useEffect 1: initialize canvas
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
  ball.x = canvasWidth / 2;
  ball.y = canvasHeight * 0.2;
  paddle.x = (canvasWidth - paddle.w) / 2;
  if (context == null || context == undefined) {
      return;
  }
  drawElements(context, ball, paddle, canvasWidth, canvasHeight);

  return () => {
      window.removeEventListener('resize', determineCanvasSize);
  }
}, [canvasRef.current, canvasContaierRef.current, canvasWidth, canvasHeight]);

    //useEffect 3: game loop ---->>>> probably dont need ref here
    useEffect(() => {
        console.log("useEffect 3: game loop")
        if (context == null || context == undefined) {
          console.log("context is null or undefined")
          return;
        }
        
          const gameLoop = () => {
          const [currentWidth, currentHeight] = dimensionsRef.current;
          drawElements(context, ball, paddle, currentWidth, currentHeight);   
          requestAnimationFrame(gameLoop);
          }
          gameLoop();
        
        
        
    }, []);

    //=======================================================================================
    // Key handlers----------------------------------------------
    const keyDownHandler = (e) => {
        if (e.key === 'ArrowRight') {
          rightPressedRef.current = true;
        } else if (e.key === 'ArrowLeft') {
          leftPressedRef.current = true;
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
        console.log("leftPressedRef.current: " + leftPressed)
      }
      const handleLeftUp = (e) => {
        leftPressedRef.current = (false);
        console.log("leftPressedRef.current: " + leftPressed)
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
          console.log("Pause button toggled "+ isPaused)
        
       
      }
      
      function handleReset() {
        console.log('Reset Game');
      }
    //Snipet to update stats to the parent component
    const updateStats = false;
    if(updateStats){
    score = score + 1;
    level = level + 1;
    onValueChange( score, level, lives, highScore);
    }
    //___________________________________________________________

    //=======================================================================================

    return (
        <Fragment>
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