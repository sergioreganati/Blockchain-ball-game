import React, { useRef, useEffect, Fragment} from 'react';
import './CanvasComponent.css';

const CanvasComponent = () => {
  const canvasRef = useRef(null);
  let paddleWidth 
  let paddleHeight 
  let paddleX = 0;
  let ball = { x: 0, y: 0, dx: 1, dy: -1, radius: 10 };

  let leftPressed =false;
  let rightPressed = false;

  let leftPressedRef = useRef(leftPressed);
  let rightPressedRef = useRef(rightPressed);
  console.log('leftPressedRef'+leftPressedRef.current)

  const drawBall = (ctx, screenRatio) => {
    ctx.beginPath();
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
  function handleLeftDown(event) {
    leftPressedRef.current=(true);
  }
  
  function handleLeftUp() {
    leftPressedRef.current=(false);
  }
  
  function handleRightDown(event) {
    
    rightPressedRef.current=(true);
  }
  
  function handleRightUp() {
    rightPressedRef.current=(false);
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

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
  }, [leftPressed, rightPressed]);

  return (
    <Fragment>
    <div className="canvas-container">
      <canvas ref={canvasRef} />
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
