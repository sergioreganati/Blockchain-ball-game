//components
import React from 'react';
//import imageURL from '../App.jsx'

const imageURL = '../public/cib-ethereum2.svg';

export const GameComponents = (props) => {
    return (    
   console.log('game components')
    );
}
//export const drawBall = (context, ball) => {
//    context.beginPath();
//    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2);
//    context.fillStyle = "#0095DD";
//    context.fill();
//    context.closePath();
//}
export function drawBall(context, ball) {
    const ballIcon = new Image();
    ballIcon.src=imageURL
    context.drawImage(ballIcon, ball.x - ball.radius, ball.y - ball.radius, ball.radius * 2, ball.radius * 2);
}
  
export const drawPaddle = (context, paddle) => {
    context.beginPath();
    context.rect(paddle.x, paddle.y - paddle.h, paddle.w, paddle.h);
    context.fillStyle = "blue";
    context.fill();
    context.closePath();
}
