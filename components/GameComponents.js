//components
import React from 'react';


export const GameComponents = (props) => {
    return (    
   console.log('game components')
    );
}
export const drawBall = (context, ball) => {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
    context.fillStyle = "#0095DD";
    context.fill();
    context.closePath();
}
export const drawPaddle = (context, paddle) => {
    context.beginPath();
    context.rect(paddle.x, paddle.y - paddle.h, paddle.w, paddle.h);
    context.fillStyle = "#0095DD";
    context.fill();
    context.closePath();
}
