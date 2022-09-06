class Controls{
    constructor(type){
        this.forward=false;
        this.left=false;
        this.right=false;
        this.reverse=false;

        switch(type){  // preventing the override of keyboard listeners for tha cars in traffic
            case "KEYS":  // dummy cars in traffic are moving very simple compared to our key car 
                this.#addKeyboardListeners();
                break; 
            case "DUMMY":
                this.forward=true;
                break;
        }
        //this.#addKeyboardListeners(); 
    }

    #addKeyboardListeners(){ // private method for keyboard listeners
        document.onkeydown=(event)=>{ // =>: function(event)
            switch(event.key){
                case "ArrowLeft":
                    this.left=true;
                    break;
                case "ArrowRight":
                    this.right=true;
                    break;
                case "ArrowUp":
                    this.forward=true;
                    break;
                case "ArrowDown":
                    this.reverse=true;
                    break;
            }
            //console.table(this);
        }
        document.onkeyup=(event)=>{
            switch(event.key){
                case "ArrowLeft":
                    this.left=false;
                    break;
                case "ArrowRight":
                    this.right=false;
                    break;
                case "ArrowUp":
                    this.forward=false;
                    break;
                case "ArrowDown":
                    this.reverse=false;
                    break;
            }
            //console.table(this);
        }
    }
}