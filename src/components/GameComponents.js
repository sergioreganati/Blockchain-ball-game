import ethSymbol from './ethereumSvg.js';


let ball = { x: 0, y: 0, dx: 5, dy: -5, radius: 7 };

const image = new Image();
if (ethSymbol) {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(ethSymbol, 'image/svg+xml');
  const svgElement = svgDoc.documentElement;

  svgElement.setAttribute('width', ball.radius*2);
  svgElement.setAttribute('height', ball.radius*2);

  const svgData = new XMLSerializer().serializeToString(svgElement);
  const svgDataURL = `data:image/svg+xml;base64,${btoa(svgData)}`;

  image.src = svgDataURL;
}

export const drawBall = (context, ball) => {
  if (image.src) {
    context.save();
    context.translate(ball.x - ball.radius, ball.y - ball.radius);
    context.scale(1, -1);
    context.drawImage(image, 0, -ball.radius*2, ball.radius * 2, ball.radius * 2);//<<<<<-------------------HERE
    context.restore();
  }
};

  
  

export const drawPaddle = (context, paddle) => {
    context.beginPath();
    context.rect(paddle.x, paddle.y - paddle.h, paddle.w, paddle.h);
    context.fillStyle = "blue";
    context.fill();
    context.closePath();
}

