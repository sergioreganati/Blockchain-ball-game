import React, { useState, useRef, useEffect, Fragment} from 'react';
import './CanvasComponent.css';

const CanvasComponent = (props) => {
  let canvas= null;
  let canvasContaier = null;
  let aspectRatio
  
  
  const canvasRef = useRef(null)
  const canvasContaierRef = useRef(null)
  
  const [canvasWidth, setCanvasWidth] = useState(300);
  const [canvasHeight, setCanvasHeight] = useState(600);
  const [context, setContext] = useState(null);
  const [screenRatio, setScreenRatio] = useState(null);
  
  


  useEffect(() => {

    canvas = canvasRef.current;
    canvasContaier= canvasContaierRef.current;

    if (canvas == null || canvas == undefined) {
      return;
    }

    console.log("W: " + canvas.width, "y: " + canvas.height)


    const canvasContainerWidth = canvasContaier.offsetWidth;
    const canvasContainerHeight = canvasContaier.offsetHeight;

    aspectRatio = Math.min(canvasContainerWidth / canvas.width, canvasContainerHeight / canvas.height);
    if (aspectRatio != 1 )
    {
      setScreenRatio (aspectRatio);
    }

    console.log(aspectRatio, parseFloat(screenRatio))
    canvas.width = canvas.width * aspectRatio;
    canvas.height = canvas.height * aspectRatio;

    setCanvasWidth (canvas.width);
    setCanvasHeight (canvas.height);

    console.log("variable canvasWidth: " + canvasWidth)
    console.log("variable canvasHeight: " + canvasHeight)
    console.log( "updated dimensions" +"H: "+canvasRef.current.height + " W:" +canvasRef.current.width)

    setContext (canvas.getContext('2d'));
  }
  , [canvasRef.current, canvas,context, canvasContaierRef, window]);


  let paddleWidth 
  let paddleHeight 
  let paddleX = 0;
  let ball = { x: 0, y: 0, dx: 5, dy: -5, radius: 10 };

  //
  let leftPressed =false;
  let rightPressed = false;

  let leftPressedRef = useRef(leftPressed);
  let rightPressedRef = useRef(rightPressed);

  const drawBall = (ctx) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = 'red';
    ctx.fill();
    ctx.closePath();
  };

  const drawPaddle = (ctx) => {
    ctx.beginPath();
    ctx.fillStyle = 'blue';
    ctx.fillRect(paddleX, ctx.canvas.height - paddleHeight, paddleWidth, paddleHeight);
    //ctx.fill();
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
        //document.location.reload();
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

  const isPausedRef = useRef(null);

  useEffect(() => {
    isPausedRef.current = props.isPaused;
    console.log("new useEffect: "+props.isPaused);
  }, [props.isPaused]);
  //___________________________________________________
  const toggleGameLoop = (start) => {
    if (start===true) {
      const draw = () => {
        if (isPausedRef.current === true) {
          console.log("paused");
          cancelAnimationFrame(draw);
          return;
        }
        context.clearRect(0, 0, canvasWidth, canvasHeight);
        drawBall(context);
        drawPaddle(context);
  
        updateBallPosition(context);
        movePaddle();
        requestAnimationFrame(draw);
      };
      draw();
    } else {
      console.log("paused");
    }
  };
  
  useEffect(() => {
    if (context == null || context == undefined) {
      console.log("context is null");
      return;
    }
    console.log("isPausedRef.current: "+isPausedRef.current)
  
    toggleGameLoop(!isPausedRef.current);
  }, [isPausedRef.current]);
  //___________________________________________________
  

useEffect(() => {
  if (context == null || context == undefined) {
    return;
  }
  if (canvas == null || canvas == undefined) {
    return;
  }
  
    console.log( "width: " + canvas.width, "height: " + canvas.height)

    ball.x = canvas.width /2;
    ball.y = canvas.height/2;

    ball.radius = canvas.width * 0.015; // 1.5% of canvas width
    paddleWidth = canvas.width * 0.2; // 20% of canvas width
    paddleHeight = canvas.height * 0.05; // 2.5% of canvas height

   // const draw = () => {
   //   if (isPausedRef.current===true) {
   //     console.log("paused")
   //     cancelAnimationFrame(draw);
   //     return
   //   }
   //   context.clearRect(0, 0, canvas.width, canvas.height);
   //   drawBall(context);
   //   drawPaddle(context);
//
   //   updateBallPosition(context);
   //   movePaddle();
   //   requestAnimationFrame(draw);
   //  
   // };
//
   // draw();
    document.addEventListener('keydown', keyDownHandler);
    document.addEventListener('keyup', keyUpHandler);

    
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
      document.removeEventListener('keyup', keyUpHandler);
     
    };
  }, [leftPressed, rightPressed, context, canvasRef, canvas, isPausedRef]);

  return (
    <Fragment>
    <div className="canvas-container" ref={canvasContaierRef}>
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      
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
