const canvas=document.getElementById("myCanvas");
canvas.width=200;

const ctx = canvas.getContext("2d"); //2d context creation 
const road = new Road(canvas.width/2, canvas.width*0.9);
const car = new Car(road.getLaneCenter(1),100,30,50,"KEYS");  // keys and dummy controlTypes included
const traffic = [  // simulating traffic by creating arrays of Car objects
    new Car(road.getLaneCenter(1),-100,30,50,"DUMMY",2) // cars in the traffic is moving slower (2) than maxSpeed=3 
];

//console.log(traffic)
//car.draw(ctx);

animate();

function animate(){
    for(let i=0; i<traffic.length;i++){
        traffic[i].update(road.borders, []);
    }
    car.update(road.borders, traffic);

    canvas.height=window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y+canvas.height*0.7);  // with saving and restoring, keep the car in same vertical position and move the road

    road.draw(ctx);

    for(let i=0; i<traffic.length; i++){
        traffic[i].draw(ctx, "red");
    }

    car.draw(ctx, "blue");
    car.sensor.draw(ctx);

    ctx.restore();  
    requestAnimationFrame(animate);
}

