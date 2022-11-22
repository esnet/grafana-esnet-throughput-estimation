import * as should from "../node_modules/should/should.js"
//import * as pubsub from '../src/components/lib/pubsub.js';
//const PubSub = pubsub.PubSub;

describe( "Class ThroughputEstimationGraph", () => {
    afterEach(async function(){
        var graph = document.querySelector("throughput-estimation-graph");
        graph.remove();
    })
    beforeEach(async function(){  
        var graph = document.createElement("throughput-estimation-graph");
        graph.setAttribute('width', 800);
        graph.setAttribute('height', 400);
        graph.setAttribute('boundary', 1500);

        document.body.appendChild(graph);
    }); 
    it( "should append a throughput-estimation-graph element", () => {
      document.querySelector("throughput-estimation-graph").should.be.an.instanceOf(HTMLElement);
    } );
} );