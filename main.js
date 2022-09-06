const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=500;

const carCtx = carCanvas.getContext("2d"); //2d context creation for visualizing the car and the neural network
const networkCtx = networkCanvas.getContext("2d"); 

const road = new Road(carCanvas.width/2, carCanvas.width*0.9);
const car = new Car(road.getLaneCenter(1),100,30,50,"AI");  // keys and dummy controlTypes included, UPDATE: our car is driven by AI 
const traffic = [  // simulating traffic by creating arrays of Car objects
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2) // cars in the traffic is moving slower (2) than maxSpeed=3 
];

//console.log(traffic)
//car.draw(ctx);

animate();

function animate(time){
    for(let i=0; i<traffic.length;i++){
        traffic[i].update(road.borders, []);
    }
    car.update(road.borders, traffic);

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -car.y+carCanvas.height*0.7);  // with saving and restoring, keep the car in same vertical position and move the road

    road.draw(carCtx);

    for(let i=0; i<traffic.length; i++){
        traffic[i].draw(carCtx, "red");
    }

    car.draw(carCtx, "blue");
    car.sensor.draw(carCtx);

    carCtx.restore();  

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx, car.brain);  // visualizing the neural network on the canvas 
    requestAnimationFrame(animate);
}

