class Car{
    constructor(x, y, width, height, controlType, maxSpeed=3){
        this.x=x;
        this.y=y;
        this.width=width;
        this.height=height;

        this.speed=0;
        this.acceleration=0.2;
        this.maxspeed=maxSpeed;
        this.friction=0.05;
        this.angle=0;
        this.damaged=false;

        this.useBrain=controlType=="AI";

        if(controlType!="DUMMY"){  // dummy trafic cars to not have sensors
            this.sensor=new Sensor(this);
            this.brain=new NeuralNetwork([this.sensor.rayCount, 6, 4]);  // input layer: sensor number of neurons, hidden layer: 6 neurons, output layer: 4 neurons
        }
        //this.sensor=new Sensor(this);

        this.controls=new Controls(controlType);
    }

    update(roadBorders, traffic){
        if(!this.damaged){ //don't move the car if collision
            this.#move();
            this.polygon=this.#createPolygon();
            this.damaged=this.#assessDamage(roadBorders, traffic);
        }
        if(this.sensor){ // update the sensors if exist
            this.sensor.update(roadBorders, traffic);
            const offsets=this.sensor.readings.map(
                s => s == null ? 0 : 1-s.offset);  // if it's null return 0, otherwise return (1 - sensor's offset)

            const outputs = NeuralNetwork.feedForward(offsets, this.brain);
            //console.log(outputs);

            if(this.useBrain){
                this.controls.forward=outputs[0];
                this.controls.left=outputs[1];
                this.controls.right=outputs[2];
                this.controls.reverse=outputs[3];
            }
        }
        
    }

    #assessDamage(roadBorders, traffic){
        for(let i=0; i<roadBorders.length; i++){ // assess damage if intersect with the road borders
            if(polyIntersection(this.polygon, roadBorders[i])){
                return true;
            }
        }
        for(let i=0; i<traffic.length; i++){  // also assess damage if intersect with the traffic car's polygones
            if(polyIntersection(this.polygon, traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }

    #createPolygon(){
        const points=[];
        const rad=Math.hypot(this.width, this.height)/2; //radius from center to corners of the car
        const alpha=Math.atan2(this.width, this.height);
        points.push({
            x:this.x - Math.sin(this.angle - alpha)*rad,
            y:this.y - Math.cos(this.angle - alpha)*rad
        });
        points.push({
            x:this.x - Math.sin(this.angle + alpha)*rad,
            y:this.y - Math.cos(this.angle + alpha)*rad
        });
        points.push({
            x:this.x - Math.sin(Math.PI + this.angle - alpha)*rad,
            y:this.y - Math.cos(Math.PI + this.angle - alpha)*rad
        });
        points.push({
            x:this.x - Math.sin(Math.PI + this.angle + alpha)*rad,
            y:this.y - Math.cos(Math.PI + this.angle + alpha)*rad
        });
        return points;
    }

    #move(){ // private method for car drive mechanics
        if(this.controls.forward){
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }

        if(this.speed>this.maxspeed){
            this.speed=this.maxspeed;
        }
        if(this.speed<-this.maxspeed/2){  // max speed in reverse direction
            this.speed=-this.maxspeed/2;
        }

        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0){
            this.speed+=this.friction;
        }

        if(Math.abs(this.speed)<this.friction){  // fixing the bounce of friction that moves the car constantly with a very small velocity
            this.speed=0;
        }

        if(this.speed!=0){  // if the speed is zero car does not moves left or right
            const flip=this.speed>0?1:-1;  // depending on the direction of speed, flip is changed (to fix moving left-right in reverse direction)
            if(this.controls.left){  // rotates counter clock-wise according to unit circle in forward direction (when flip = 1)
                this.angle+=0.03*flip;
            }
            if(this.controls.right){  // rotates clock-wise according to unit circle in forward direction (when flip = 1)
                this.angle-=0.03*flip;
            }
        }        

        this.x-=Math.sin(this.angle)*this.speed; // move the car in the direction of angle
        this.y-=Math.cos(this.angle)*this.speed;

        this.y-=this.speed;
    }

    draw(ctx, color){
        /* ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(-this.angle);

        ctx.beginPath();
        ctx.rect(-this.width/2, -this.height/2, this.width, this.height);  ---> improved to polygone
        ctx.fill();

        ctx.restore();  */
        //this.sensor.draw(ctx);  ----> moved to main.js (car.sensor.draw) 
        
        if(this.damaged){ // collision: gray 
            ctx.fillStyle="gray";
        }else{  // color param initialized for main car traffic cars --> car.js
            ctx.fillStyle=color;
        }

        ctx.beginPath();
        ctx.moveTo(this.polygon[0].x, this.polygon[0].y);
        for(let i=1; i<this.polygon.length; i++){  // starting from 1 because I already moved to first one
            ctx.lineTo(this.polygon[i].x, this.polygon[i].y);
        }
        ctx.fill();

        if(this.sensor){ // draw the sensor if exist --> for our car
            this.sensor.draw(ctx);
        }
        
        
    }





}