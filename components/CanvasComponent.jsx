import React, { useState, useRef, useEffect, Fragment} from 'react';
import './CanvasComponent.css';

const CanvasComponent = (props) => {
  let context;
  let canvas
  const canvasRef = useRef(null)
  


  useEffect(() => {

    canvas = canvasRef.current;

    if (canvas == null || canvas == undefined) {
      return;
    }

    console.log("W: " + canvas.width, "y: " + canvas.height)
    console.log(window.innerWidth, window.innerHeight)
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    context = canvas.getContext('2d');
  }
  , [canvasRef.current]);

  console.log("H: "+canvasRef, "W:" +canvasRef.innerWidth)
  let paddleWidth 
  let paddleHeight 
  let paddleX = 0;
  let ball = { x: 0, y: 0, dx: 5, dy: -5, radius: 10 };

  let isPaused = props.isPaused;
  let leftPressed =false;
  let rightPressed = false;

  let leftPressedRef = useRef(leftPressed);
  let rightPressedRef = useRef(rightPressed);

  const drawBall = (ctx,screenRatio) => {
    ctx.beginPath();
    ctx.ellipse(ball.x, ball.y, ball.radius, 2*ball.radius, 0, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
  };

  const drawPaddle = (ctx) => {
    ctx.beginPath();
    ctx.rect(paddleX, ctx.canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = 'blue';
    ctx.fill();
    ctx.closePath();
  };

  const updateBallPosition = (ctx) => {
    ball.x += ball.dx;
    ball.y += ball.dy;

    if (ball.x + ball.radius > ctx.canvas.width || ball.x - ball.radius < 0) {
      ball.dx = -ball.dx;
    }

    if (ball.y - ball.radius < 0) {
      ball.dy = -ball.dy;
    } else if (ball.y + ball.radius > ctx.canvas.height - paddleHeight) {
      if (ball.x > paddleX && ball.x < paddleX + paddleWidth) {
        ball.dy = -ball.dy;
      } else {
        //alert('Game Over');
        return
        document.location.reload();
      }
    }
  };

  const movePaddle = () => {

    if (rightPressedRef.current || rightPressed) {
      paddleX += 5;
      if (paddleX + paddleWidth > canvasRef.current.width) {
        paddleX = canvasRef.current.width - paddleWidth;
      }
    } else if (leftPressedRef.current || leftPressed) {
      paddleX -= 5;
      if (paddleX < 0) {
        paddleX = 0;
      }
    }
  };

  const keyDownHandler = (e) => {
    if (e.key === 'ArrowRight') {
      rightPressed = true;
    } else if (e.key === 'ArrowLeft') {
      leftPressed = true;
    }
  };

  const keyUpHandler = (e) => {
    if (e.key === 'ArrowRight') {
      rightPressed = false;
    } else if (e.key === 'ArrowLeft') {
      leftPressed = false;
    }
  };
  const handleLeftDown = (e) => {
    leftPressedRef.current=(true);
  }
  const handleLeftUp = (e) => {
    leftPressedRef.current=(false);
  }
  const handleRightDown = (e) => {
    rightPressedRef.current=(true);
  }
  const handleRightUp = (e) => {
    rightPressedRef.current=(false);
  }

// determine canvas size base on window size keeping aspect ratio
// w:300 h:600 is the original size of the canvas

//console.log("Original Canvas size: W: " + canvasRef.current.width, "y: " + canvasRef.current.height)





useEffect(() => {
  // let canvas = canvasRef.current;
  if (context == null || context == undefined) {
    return;
  }
  if (canvas == null || canvas == undefined) {
    return;
  }
    //console.log("W: " + canvas.width, "y: " + canvas.height)
    //console.log(window.innerWidth, window.innerHeight)
    //const windowWidth = window.innerWidth;
    //const windowHeight = window.innerHeight;
    //canvas.width = windowWidth;
    //canvas.height = windowHeight;
    //const wRatio = 300 / canvas.width;
    //const hRatio = 150 / canvas.height;
    //const screenRatio = wRatio / hRatio;
    
    

   //console.log(windowWidth, windowHeight)
   //console.log(canvas.width, canvas.height)
   //console.log(context)
//
    //let screenRatio = canvas.width / canvas.height;
    console.log( "width: " + canvas.width, "height: " + canvas.height)

    ball.x = canvas.width /2;
    ball.y = canvas.height/2;

    ball.radius = canvas.width * 0.015; // 1.5% of canvas width
    paddleWidth = canvas.width * 0.2; // 20% of canvas width
    paddleHeight = canvas.height * 0.05; // 2.5% of canvas height

    const draw = () => {

      context.clearRect(0, 0, canvas.width, canvas.height);
      drawBall(context, 1);
      drawPaddle(context);
      if (isPaused) {
        return
      }
      updateBallPosition(context);
      movePaddle();
     
    };

    const interval = setInterval(draw, 10);
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    
    return () => {
      clearInterval(interval);
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
     
    };
  }, [leftPressed, rightPressed, isPaused]);

  return (
    <Fragment>
    <div className="canvas-container">
    <canvas
      ref={canvasRef}
      width="300"
      height="600"
      style={{ width: "300px", height: "600px" }}
    />
    </div>
            <div className="Mobile-controls">
            <button color="primary" type="button" id="left-button" className="control" value="left" onMouseDown={handleLeftDown} onMouseUp={handleLeftUp} onTouchStart={handleLeftDown} onTouchEnd={handleLeftUp}>
              Left
            </button>
            <button color="primary" type="button" className="control" value= "right" onMouseDown={handleRightDown} onMouseUp={handleRightUp} onTouchStart={handleRightDown} onTouchEnd={handleRightUp}>
              Right
            </button>
          </div>
    </Fragment>
  );
};

export default CanvasComponent;
