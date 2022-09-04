class Sensor{
    constructor(car) {
        this.car=car;
        this.rayCount=5;
        this.rayLength=150;
        this.raySpread=Math.PI/2;

        this.rays=[];
        this.readings=[]; // readings array contains values that tells how far the border if there is any
    }

    update(roadBorders){
        this.#castRays();  // moved to the private method
        this.readings=[];
        for(let i=0; i<this.rays.length; i++){
            this.readings.push(this.#getReading(this.rays[i], roadBorders));
        }
    }

    #getReading(ray, roadBorders){
        let touches=[];
        for(let i=0; i<roadBorders.length; i++){
            const touch=getIntersection(ray[0], ray[1], roadBorders[i][0], roadBorders[i][1]); // getIntersection method returns intersection points and the offset (distance between them) -- in untils.js
            if(touch){
                touches.push(touch);
            }
        }
        if(touches.length==0){
            return null;
        }else{
            const offsets=touches.map(e=>e.offset) // gather all the offsets from all the touches in an array "offsets"
            const minOffset=Math.min(...offsets); // min method doesn't accept an array as arg, ... operator spreads the array in order to pass them as arg to min method
            return touches.find(e=>e.offset==minOffset); // find and return the touch that has minimum offset by going through all touches on the ray element by element
        }
    }

    #castRays(){
        this.rays=[];
        for(let i=0; i<this.rayCount; i++){
            const rayAngle=lerp(this.raySpread/2, -this.raySpread/2, this.rayCount==1?0.5:i/(this.rayCount-1)) + this.car.angle; // adding car angle to rotate the sensors with car
            const start={x:this.car.x, y:this.car.y};
            const end={x:this.car.x - Math.sin(rayAngle)*this.rayLength,
                        y:this.car.y - Math.cos(rayAngle)*this.rayLength};
            this.rays.push([start, end]);
        }
    }

    draw(ctx){
        for(let i=0; i<this.rayCount; i++){
            let end=this.rays[i][1];
            if(this.readings[i]){
                end=this.readings[i];
            }

            ctx.beginPath();
            ctx.lineWidth=2;
            ctx.strokeStyle="yellow";
            ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y); // ray start location
            ctx.lineTo(end.x, end.y); // ray end location
            ctx.stroke();

            ctx.beginPath(); // to see the part of the ray that touches the border
            ctx.lineWidth=2;
            ctx.strokeStyle="black";
            ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y); // ray start location
            ctx.lineTo(end.x, end.y); // ray end location
            ctx.stroke();
        }
    }

}