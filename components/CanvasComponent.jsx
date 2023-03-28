import React, { useRef, useEffect, useState} from 'react';
import './CanvasComponent.css';






const CanvasComponent = (props) => {
  const { _leftPressed, _rightPressed } = props
  const canvasRef = useRef(null);
  let paddleWidth 
  let paddleHeight = 10;
  let paddleX = 0;
  let ball = { x: 0, y: 0, dx: 2, dy: -2, radius: 10 };
  console.log(_leftPressed)
  console.log(_rightPressed)

  let rightPressed = _rightPressed;
  let leftPressed = _leftPressed;

  const drawBall = (ctx, screenRatio) => {
    ctx.beginPath();
    //ctx.ellipse(100, 100, 50, 75, 0, 0, 2 * Math.PI);
    ctx.ellipse(ball.x, ball.y, ball.radius, ball.radius/screenRatio, 0, 0, Math.PI * 2);
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

    
    if (props.rightPressed || rightPressed) {
      paddleX += 5;
      if (paddleX + paddleWidth > canvasRef.current.width) {
        paddleX = canvasRef.current.width - paddleWidth;
      }
    } else if (props.leftPressed || leftPressed) {
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
  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    // Set the canvas dimensions based on device pixel ratio
    let screenRatio = canvas.width / canvas.height;

    ball.x = canvas.width / screenRatio;
    ball.y = canvas.height/ screenRatio;

    ball.radius = canvas.width * 0.015; // 1.5% of canvas width
    paddleWidth = canvas.width * 0.2; // 20% of canvas width
    paddleHeight = canvas.height * 0.025; // 2.5% of canvas height

    const draw = () => {
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawBall(context, screenRatio);
      drawPaddle(context);
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
  }, []);

  return (
    <div className="canvas-container">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default CanvasComponent;
