const canvas=document.getElementById("myCanvas");
canvas.width=200;

const ctx = canvas.getContext("2d"); //2d context creation 
const road = new Road(canvas.width/2, canvas.width*0.9);
const car = new Car(road.getLaneCenter(1),100,30,50);
//car.draw(ctx);

animate();

function animate(){
    car.update(road.borders);
    canvas.height=window.innerHeight;

    ctx.save();
    ctx.translate(0, -car.y+canvas.height*0.7);  // with saving and restoring, keep the car in same vertical position and move the road

    road.draw(ctx);
    car.draw(ctx);
    car.sensor.draw(ctx);

    ctx.restore();  
    requestAnimationFrame(animate);
}

