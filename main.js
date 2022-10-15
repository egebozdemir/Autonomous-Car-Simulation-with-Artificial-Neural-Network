const carCanvas=document.getElementById("carCanvas");
carCanvas.width=200;
const networkCanvas=document.getElementById("networkCanvas");
networkCanvas.width=300;

const carCtx = carCanvas.getContext("2d"); //2d context creation for visualizing the car and the neural network
const networkCtx = networkCanvas.getContext("2d"); 

const road = new Road(carCanvas.width/2, carCanvas.width*0.9);

const N=1000;  // number of cars generated simultaneously (increase it according the hardware used for decreasing the number of trials for training)
const cars = generateCars(N);
let bestCar=cars[0];  // initiliazing the best car as the first generated one 

if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain"));
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain, 0.2);  // mutating the network by an amount for adjusting the variance of the generated cars
        }
    }
}
//const car = new Car(road.getLaneCenter(1),100,30,50,"AI");  // keys and dummy controlTypes included, UPDATE: our car is driven by AI 

const traffic=[  // placing the traffic cars (obstacles)
    new Car(road.getLaneCenter(1), -50, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -300, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(0), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -500, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(1), -700, 30, 50, "DUMMY", 2),
    new Car(road.getLaneCenter(2), -700, 30, 50, "DUMMY", 2)
];
/* const traffic = [  // simulating traffic by creating arrays of Car objects
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2) // cars in the traffic is moving slower (2) than maxSpeed=3 
]; */

//console.log(traffic)
//car.draw(ctx);

animate();

function save(){  // method to save the parsed JSON values of the weights of the best brain into local storage
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard(){  // remove method for the saved weights
    localStorage.removeItem("bestBrain");
}

function generateCars(N){  // generating the randomly created alternative cars 
    const cars=[];
    for(let i=1; i<N; i++){
        cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, "AI"));
    }
    return cars;
}

function animate(time){
    for(let i=0; i<traffic.length;i++){
        traffic[i].update(road.borders, []);
    }
    for(let i=0; i<cars.length; i++){  // visualizing multiple random generated cars 
        cars[i].update(road.borders, traffic);
    }
    //car.update(road.borders, traffic);

    // best car: car with the minimum y value (one that goes upward most)
    bestCar=cars.find(c=>c.y==Math.min(...cars.map(c=>c.y))); // selecting the bestCar by spreading the array contains only the y values of all cars
    //console.log(bestCar)

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    carCtx.save();
    carCtx.translate(0, -bestCar.y+carCanvas.height*0.7);  // with saving and restoring, keep the car in same vertical position and move the road
    //console.log(bestCar?.y);

    road.draw(carCtx);
    for(let i=0; i<traffic.length; i++){  // drawing traffic cars (obstacles) with red
        traffic[i].draw(carCtx, "red");
    }

    carCtx.globalAlpha=0.2;  // drawing alternative cars generated with transparent blue
    for(let i=0; i<cars.length; i++){
        cars[i].draw(carCtx, "blue");
    }

    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,"blue",true);  // drawing the bestCar (only with the sensors) with opaque blue
    //car.draw(carCtx, "blue");

    bestCar.sensor.draw(carCtx);  

    carCtx.restore();  

    networkCtx.lineDashOffset=-time/50;
    Visualizer.drawNetwork(networkCtx, bestCar.brain);  // visualizing the neural network on the canvas 
    requestAnimationFrame(animate);
}

