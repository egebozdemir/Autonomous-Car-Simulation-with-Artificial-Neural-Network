class NeuralNetwork{
    constructor(neuronCounts) {  // constructing a network by concatanating the neuron levels (layers)
        this.levels=[]; 
        for(let i=0; i<neuronCounts.length-1; i++){  // for each layer specifying input and output count
            this.levels.push(new Level(neuronCounts[i], neuronCounts[i+1]));  
        }
    }

    static feedForward(givenInputs, network){  
        let outputs=Level.feedForward(givenInputs, network.levels[0])  // calling the first level to produce it's outputs
        for(let i=1; i<network.levels.length; i++){  //  looping through the remaining levels (i=1) 
            outputs=Level.feedForward(outputs, network.levels[i]);  // putting the output of the previous level into the input of the next one and updating the output by the feedForward result
        }
        return outputs;  // return the final outputs
    }


}



class Level{
    constructor(inputCount, outputCount){
        this.inputs = new Array(inputCount); // layer of input neurons
        this.outputs = new Array(outputCount);  // layer of output neurons
        this.biases = new Array(outputCount);  // biases

        this.weights=[];
        for(let i=0; i<inputCount; i++){  // for each input neuron, output neuron number of connections (fully-connected)
            this.weights[i] = new Array(outputCount);
        }

        Level.#randomize(this);

    }

    static #randomize(level){
        for(let i=0; i<level.inputs.length; i++){
            for(let j=0; j<level.outputs.length; j++){
                level.weights[i][j]=Math.random()*2-1;  // weights initialized as random values between -1 and 1 
            }
        }

        for(let i=0; i<level.biases.length; i++){
            level.biases[i]=Math.random()*2-1; // biases (threshold values) are also in the same range as weights: [-1,1]  
        }
    }

    static feedForward(givenInputs, level){  // givenInputs: these will be the inputs coming from the sensors for the feed-forward neural network
        for(let i=0; i<level.inputs.length; i++){
            level.inputs[i]=givenInputs[i];
        }

        for(let i=0; i<level.outputs.length; i++){
            let sum=0;
            for(let j=0; j<level.inputs.length; j++){
                sum+=level.inputs[j]*level.weights[j][i]  // calculating weighted sum for obtaining the output "Y=W.x"
            }
            if(sum>level.biases[i]){  // pass the weighted sum through the activation function (sigmoid)
                level.outputs[i]=1;
            }else{
                level.outputs[i]=0;
            }
        }
        return level.outputs;
    }



}