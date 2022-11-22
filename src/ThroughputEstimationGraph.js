// mixed-mode imports. This import style allows us to
// populate d3 either from the browser into the window
// scope or from nodejs style webpack requires (the
// import syntax is compiled to require() calls by 
// webpack et al)
import * as d3_import from './lib/d3.min.js';
import './lib/d3-time-format.min.js';
import * as pubsub from './lib/pubsub.js';

import * as regression_import from './lib/regression.js';

const regression = window['regression'] || regression_import;
const PubSub = pubsub.PubSub;


// populate either with import or ES6 root-scope version
const d3 = window['d3'] || d3_import;

// standard imports, resolve in both webpack and browser
import { utils, types, BindableHTMLElement } from "./lib/rubbercement.js"

const SLIDER_UNITS = [
    'seconds',
    'minutes',
    'hours',
    'days',
    'months',
    'years'
]

const ATTRIBUTES = {
    "historical-base-color": types.string,
    "projection-base-color": types.string,
    "time-interval": types.string,
    "time-value": types.number,
    "time-selector-min-value": types.number,
    "time-selector-max-value": types.number,
    "slider-units": types.string,
    "slider-scale": types.string,
    "width": types.number,
    "height": types.number,
    "label-x": types.string,
    "label-y": types.string,
    "format-x": types.string,
    "format-y": types.string,
    "algorithm": types.string,
    "text-style": types.string,
    "boundary": types.number,
}

const PREDICTION_ALGORITHMS = {
    'linear': 'linear',
    'exponential': 'exponential',
    'logarithmic': 'logarithmic',
    'power': 'power',
    'polynomial': 'polynomial',
}


// web component
export class ThroughputEstimationGraph extends BindableHTMLElement {
    constructor() {
        super();
        // options defaults
        this._historicalBaseColor = [132, 184, 226];
        this._projectionBaseColor = [245, 165, 92];
        this._timeSelectorMinValue = 1;
        this._timeSelectorMaxValue = 50;
        this._algorithm = 'polynomial';
        this._timeInterval = "years";
        this._sliderScale = "linear";
        this._width = 400;
        this._height = 400;
        this._labelX = "X Axis";
        this._labelY = "Y Axis";
        this._formatX = "%Y";
        this._formatY = "d";
        this._textStyle = "color: #999; font-family: sans-serif; font-size:13px;"
        PubSub.subscribe("showTooltip", this.showTooltip, this);
        PubSub.subscribe("hideTooltip", this.hideTooltip, this);
    }
    // attribute to property adapters
    // component attributes
    static get observedAttributes() {
        return Object.keys(ATTRIBUTES);
    }
    // this changes internal props (calling the related setter)
    // on change of any observed attribute (defined above)
    attributeChangedCallback(attribute, oldValue, newValue) {
        if (oldValue === newValue) return;
        // coerce the value to the specified type and set a related property on `this`.
        this[ utils.snakeToCamel(attribute) ] = ATTRIBUTES[attribute](newValue);
    }

    // setters and getters
    set height(newValue){
        this._height = newValue;
        this.render();
    }
    get height(){
        return this._height;
    }
    set width(newValue){
        this._width = newValue;
        this.render();
    }
    get width(){
        return this._width;
    }
    set labelX(newValue){
        this._labelX = newValue;
        this.render();
    }
    get labelX(){
        return this._labelX;
    }
    set labelY(newValue){
        this._labelY = newValue;
        this.render();
    }
    get labelY(){
        return this._labelY;
    }
    set formatX(newValue){
        this._formatX = newValue;
        this.render();
    }
    get formatX(){
        return this._formatX;
    }
    set formatY(newValue){
        this._formatY = newValue;
        this.render();
    }
    get formatY(){
        return this._formatY;
    }
    set historicalBaseColor(newValue){
        this._historicalBaseColor = newValue;
        this.render();
    }
    get historicalBaseColor(){
        return this._historicalBaseColor;
    }
    set projectionBaseColor(newValue){
        this._projectionBaseColor = newValue;
        this.render();
    }
    get projectionBaseColor(){
        return this._projectionBaseColor;
    }
    set timeSelectorMinValue(newValue){
        this._timeSelectorMinValue = newValue;
        this.render();
    }
    get timeSelectorMinValue(){
        return this._timeSelectorMinValue;
    }
    set timeSelectorMaxValue(newValue){
        this._timeSelectorMaxValue = newValue;
        this.render();
    }
    get timeSelectorMaxValue(){
        return this._timeSelectorMaxValue;
    }
    set timeInterval(newValue){
        this._timeInterval = newValue;
        this.render();
    }
    get timeInterval(){
        return this._timeInterval;
    }
    set sliderScale(newValue){
        this._sliderScale = newValue;
        this.render();
    }
    get sliderScale(){
        return this._sliderScale;
    }
    set textStyle(newValue){
        this._textStyle = newValue;
        this.render();
    }
    get textStyle(){
        return this._textStyle;
    }
    set boundary(newValue){
        this._boundary = newValue;
        this.render();
    }
    get boundary(){
        return this._boundary;
    }
    set timeInterval(newValue){
        this._timeInterval = newValue;
    }
    get timeInterval(){
        return this._timeInterval;
    }
    set timeValue(newValue){
        this._timeValue = newValue;
    }
    get timeValue(){
        return this._timeValue;
    }
    set algorithm(newValue){
        if(!PREDICTION_ALGORITHMS[newValue]){
            throw new Error(`${newValue} is not an available prediction algorithm`);
        }
        this._algorithm = PREDICTION_ALGORITHMS[newValue];
    }
    get algorithm(){
        return this._algorithm;
    }


    showTooltip(tooltipData){
        const event = tooltipData.event;
        const content = tooltipData.content;
        this.shadow.querySelectorAll(".tooltip").forEach((elem)=>{
            elem.remove();
        })
        const tooltipElem = document.createElement("div");
        tooltipElem.setAttribute('class', 'tooltip');
        tooltipElem.setAttribute('style', `top: ${event.clientY + 10}px; left: ${event.clientX + 10}px;`)
        tooltipElem.innerHTML = content;
        this.shadow.append(tooltipElem);
    }
    hideTooltip(){
        this.shadow.querySelectorAll(".tooltip").forEach((elem)=>{
            elem.remove();
        })
    }

    getDate(dateData){
        return new Date(
            dateData.years,
            dateData.months,
            dateData.days,
            dateData.hours,
            dateData.minutes,
            dateData.seconds,
            0
        )
    }

    filterGraphData(){
        var graphDataOutput = [];
        var now = new Date()
        var minDate = {
            years: now.getFullYear(),
            months: now.getMonth(),
            days: now.getDate(),
            hours: now.getHours(),
            minutes: now.getMinutes(),
            seconds: now.getSeconds()
        };
        minDate[this.timeInterval] -= parseInt(this.timeValue);
        minDate = this.getDate(minDate);
        console.log("the min date:", minDate);
        var maxDate = {
            years: now.getFullYear(),
            months: now.getMonth(),
            days: now.getDate(),
            hours: now.getHours(),
            minutes: now.getMinutes(),
            seconds: now.getSeconds()
        };
        maxDate[this.timeInterval] += parseInt(this.timeValue);
        maxDate = this.getDate(maxDate);
        this._graphData.forEach((series)=>{
            // push a parallel series to the output
            var seriesOutput = {
                "name": series.name,
                "historical": [], // historical data
                "projected": [] // projected data
            };
            function filterData(datapoint) {
                if(
                    datapoint.time <= new Date() && // if the datapoint is before now
                    datapoint.time >= minDate && // and the datapoint is after or equal to the minimum date we want to plot
                    datapoint.values[1] !== null && // and the datapoint is not null
                    datapoint.values[1] !== undefined &&// and the datpoint is not undefined
                    datapoint.values[1] === datapoint.values[1] // and the datapoint is not NaN (NaN !== NaN)
                ){
                    seriesOutput.historical.push(datapoint)
                }
            }
            series.historical.forEach(filterData)
            graphDataOutput.push(seriesOutput);
        })
        this._filteredGraphData = graphDataOutput;
        this.projectFutureData();
    }

    projectFutureData(){
        var output = [];
        var now = new Date();
        this._filteredGraphData.forEach((series)=>{
            var seriesX = [];
            var seriesY = [];

            // lookup table of possible timeIntervals with their durations in milliseconds
            // the target timeInterval is added "timeValue" times to get the output line
            var intervals = {
                'seconds': 1000,
                'minutes': 60 * 1000,
                'hours': 60 * 60 * 1000,
                'days': 24 * 60 * 60 * 1000,
                'months': (365 * 24 * 60 * 60 * 1000) / 12,
                'years': 365 * 24 * 60 * 60 * 1000,
            }


            var inputSeries = [];
            series.historical.forEach((datapoint)=>{
                if(
                    datapoint.values[1] !== undefined &&
                    datapoint.values[1] !== null &&
                    datapoint.values[1] === datapoint.values[1]
                ){
                    inputSeries.push([datapoint.time.getTime(), Math.floor(datapoint.values[1])])
                }   
            })

            var predictor = regression[this._algorithm](inputSeries, { "order": 2, "precision": 13 });
            var predictions = []
            var backprojections = []

            predictor.points.forEach((point)=>{
                let formatted = {
                    time: new Date(point[0]),
                    values: [0, point[1]]
                };
                backprojections.push(formatted);
            })
            for(var i=0; i<=this.timeValue; i++){
                let predictionTime = (now.getTime() + i * intervals[this.timeInterval]);
                let output = predictor.predict(predictionTime);
                let formatted = {
                    time: new Date(predictionTime),
                    values: [0, output[1]]
                }
                predictions.push(formatted);
            }
            output.push({
                "name": series.name,
                "backprojections": backprojections,
                "historical": series.historical,
                "projected": predictions
            })
        })
        this._filteredGraphData = output;

        this.renderGraph();
    }

    setRawGraphData(data){
        this._graphData = data;
        this._graphData.forEach((item)=>{ console.log(item); });
        this.filterGraphData();
    }

    setGrafanaGraphData(data){
        var output = [];
        debugger;
        data.series.forEach((series)=>{
            var outputSeries = {
                "name": series.name ? series.name : series.refId, // we'll see!
                "historical": [], // historical data
                "projected": [] // projected data
            };

            for(let i=0; i<series.length; i++){
                // TODO: XXX: this should be configurable in the side panel. 
                var date = new Date(series.fields[0].values.get(i));
                var value = series.fields[1].values.get(i);
                var item = {
                    time: date,
                    values: [0, value]
                }
                outputSeries.historical.push(item);
            }

            output.push(outputSeries);
        })

        this._graphData = output;
        this.filterGraphData();
    }

    renderBoundary(){
        var boundaryData = [[]]
        if(!this.boundary){
            return boundaryData;
        }
        // add boundary data entry for "now"
        let now = new Date()
        boundaryData[0].push({
            time: now,
            limit: this.boundary,
        })
        // for each tick of time that we intend to render
        // both forward and backward        
        for(let i=0; i<=this.timeValue; i++){
            // create a date based on "now"
            // one unit of time forward
            let forwardDateData = {
                years: now.getFullYear(),
                months: now.getMonth(),
                days: now.getDate(),
                hours: now.getHours(),
                minutes: now.getMinutes(),
                seconds: now.getSeconds()
            }
            forwardDateData[this.timeInterval] += i;
            // and one unit of time backward
            let backwardDateData = {
                years: now.getFullYear(),
                months: now.getMonth(),
                days: now.getDate(),
                hours: now.getHours(),
                minutes: now.getMinutes(),
                seconds: now.getSeconds()
            }
            backwardDateData[this.timeInterval] -= i;
            // push and unshift a sample based on this.boundary
            boundaryData[0].unshift({
                time: this.getDate(backwardDateData),
                limit: this.boundary
            })
            // into the boundaryData array
            boundaryData[0].push({
                time: this.getDate(forwardDateData),
                limit: this.boundary
            })
        }
        return boundaryData;
    }
    renderGraph(){
        //debugger;
        if(this._filteredGraphData[0]
            && this._filteredGraphData[0].historical
            && this._filteredGraphData[0].projected
            && this._filteredGraphData[0].projected.length
        ){
            var dataToGraph = this._filteredGraphData;
            var boundaryData = this.renderBoundary();
        } else {
            console.error("No data to graph!");
            return
        }
        this._filteredGraphData.forEach((series, idx)=>{
            series.cssClass = `series-${idx}`;
        })

        let y_height = this.height - 50;
        let x_width = this.width - 125;
        let axisHeight = 50;

        // rotatedSeries will be an object with date keys
        // and lists of values from each series that has
        // the corresponding key
        var rotatedSeries = {
            'historical': [],
            'backprojections': [],
            'projected': []
        }

        function rotate(fieldName){
            function rotator(dataPoint, dataPointIdx){
                var timeSlice = rotatedSeries[fieldName][dataPoint.time.getTime().toString()];
                if(timeSlice){
                    if(timeSlice.length >= dataToGraph.length){
                        console.error("refusing to insert point", dataPoint, "into timeSlice", timeSlice, "with timestamp", dataPoint.time, ". timeSlice is too long.")
                        return
                    }
                    var lastItem = timeSlice[timeSlice.length-1]
                    // stack the values for graphing
                    var stackedValues = [lastItem["stacked"][0] + dataPoint.values[0], lastItem["stacked"][1] + dataPoint.values[1]];
                    rotatedSeries[fieldName][dataPoint.time.getTime().toString()].push({ "stacked": stackedValues, "original": dataPoint.values });
                } else {
                    rotatedSeries[fieldName][dataPoint.time.getTime().toString()] = [{ "stacked": dataPoint.values, "original": dataPoint.values }]
                }
            }
            return rotator;
        }
        dataToGraph.forEach((series, seriesIdx)=>{
            series.historical.forEach(rotate('historical'));
            series.backprojections.forEach(rotate('backprojections'));
            series.projected.forEach(rotate('projected'));
        })
        var stackedDataToGraph = []
        var fieldNames = ['historical', 'backprojections', 'projected'];
        fieldNames.forEach((fieldName)=>{
            var timeStamps = Object.keys(rotatedSeries[fieldName]);
            timeStamps.forEach((timeStamp, timeStampIdx)=>{
                var timeSlice = rotatedSeries[fieldName][timeStamp];
                timeSlice.forEach((valueObj, valueIdx)=>{
                    if(!stackedDataToGraph[valueIdx]){
                        stackedDataToGraph[valueIdx] = {
                            "cssClass": dataToGraph[valueIdx].cssClass,
                            "name": dataToGraph[valueIdx].name,
                            "historical": [],
                            "projected": [],
                            "backprojections": [],
                        }
                    }
                    stackedDataToGraph[valueIdx][fieldName].push({
                        time: new Date(parseInt(timeStamp)),
                        values: valueObj["stacked"],
                        original: valueObj["original"]
                    });
                })
            })
        })
        stackedDataToGraph.reverse();
        //debugger;

        function accumulate(accumulator, obj){
            if(obj.limit){
                let val = parseInt(obj.limit);
                if(val !== val){
                    console.log("Detected NaN in 'limit'. input value:", obj.limit, "output value:", val);
                } else {
                    accumulator['y'].push(val);
                }
            }
            if(obj.values){
                for(let i=0; i<obj.values.length; i++){
                    let val = parseInt(obj.values[i]);
                    if(val !== val){
                        console.log("Detected NaN in y values. input value:", obj.values[i], "output value:", val);
                        continue;
                    }
                    accumulator['y'].push(val);
                }                
            }
            if(obj.time){
                accumulator['x'].push(obj.time);
            }
            return accumulator;
        }
        let all_values = {x: [], y: [boundaryData[0][0] ? boundaryData[0][0].limit : 0]};
        boundaryData[0].reduce(accumulate, all_values);
        // this will need to change to a for/forEach loop to deal with multiple series.
        stackedDataToGraph.forEach(function(series){
            series.historical.reduce(accumulate, all_values);
        })
        stackedDataToGraph.forEach(function(series){
            series.projected.reduce(accumulate, all_values);
        })
        function numsort(a, b){
            if(a < b) return -1;
            if(a > b) return 1;
            if(a === b) return 0;
        }
        let sorted_x = all_values['x'].sort(numsort);
        let sorted_y = all_values['y'].sort(numsort);
        let x_domain = [sorted_x[0], sorted_x[sorted_x.length-1]];
        let y_domain = [sorted_y[0], sorted_y[sorted_y.length-1]];

        // Create scale
        let x_scale = d3.scaleLinear()
                      .domain(x_domain)
                      .range([0, x_width]);
        // Create scale
        //let y_min_max = [dataToGraph[0][0]['values'][0], dataToGraph[1][dataToGraph[1].length-1]['values'][1] + 30];
        let y_scale = d3.scaleLinear()
                      .domain(y_domain)
                      .range([y_height - axisHeight, 0]);

        let graphContainer = this.shadow.querySelector('#graph');
        let svg = graphContainer.querySelector('svg');
        if(svg){
            svg.remove();
        }
        // Append SVG 
        svg = d3.select(graphContainer)
                    .append("svg")
                    .attr("width", this.width)
                    .attr("height", this.height);


        let areaGroup = svg
            .append("g")

        let genArea = d3
            .area()
            .x(function(point){ 
                var output = x_scale(point.time);
                if(output !== output) console.log(point, output);
                return output
            })
            .y0(function(point){ 
                var output = y_scale(point.values[0]);
                if(output !== output) console.log(point, output);
                return output
            })
            .y1(function(point){ 
                var output = y_scale(point.values[1]);
                if(output !== output) console.log(point, output);
                return output
            });

        let genLine = d3.line()
            .x(function(point){
                var output = x_scale(point.time);
                if(output !== output) console.log(point, output);
                return output
            })
            .y(function(point){
                var output = y_scale(point.values[1]);
                if(output !== output) console.log(point, output);
                return output
            })

        var color = [];

        for(var i=0; i<stackedDataToGraph.length; i++){
            color.push({ 
                "historical": `rgb(${this._historicalBaseColor[0]-(30*i)}, ${this._historicalBaseColor[1]-(30*i)}, ${this._historicalBaseColor[2]-(30*i)})`,
                "historical-line": `rgb(${this._historicalBaseColor[0]-(30*i) - 90}, ${this._historicalBaseColor[1]-(30*i) - 90}, ${this._historicalBaseColor[2]-(30*i) - 90})`,
                "historical-circle-fill": `rgb(${this._historicalBaseColor[0]-(30*i) - 90}, ${this._historicalBaseColor[1]-(30*i) - 90}, ${this._historicalBaseColor[2]-(30*i) - 90},0.2)`,
                "projected": `rgb(${this._projectionBaseColor[0]+(30*i)}, ${this._projectionBaseColor[1]+(30*i)}, ${this._projectionBaseColor[2]+(30*i)})`,
                "projected-line": `rgb(${this._projectionBaseColor[0]+(30*i) - 90}, ${this._projectionBaseColor[1]+(30*i) - 90}, ${this._projectionBaseColor[2]+(30*i) - 90})`,
            })
        }
        let series = areaGroup
            .selectAll(".dataSeries")
            .data(stackedDataToGraph)
            .enter()
            .append("g")
            .attr("transform", `translate(70, 10)`)

        series
            .append("path")
            .attr("class", function(d){ 
                return `historical dataSeries ${d.cssClass}`
            })
            .style("fill", (d, i) => color[i]['historical'])
            .attr("d", function(d){ 
                return genArea(d.historical); 
            })

        series
            .append("path")
            .attr("class", "historical line")
            .attr("stroke", (d, i) => color[i]['historical-line'])
            .attr("fill", "none")
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 0.5)
            .attr("d", function(d){
                return genLine(d.historical);
            })

        const do_mouseout = (ev, d)=>{
            d3.selectAll(this.shadow.querySelectorAll(".backprojected.line.black."+d.cssClass))
                .attr("stroke", "rgba(0,0,0,0.2)")
                .attr("stroke-width", 1)
            d3.selectAll(this.shadow.querySelectorAll(".backprojected.line.white."+d.cssClass))
                .attr("stroke", "rgba(255,255,255,0.2)")
                .attr("stroke-width", 1)
            PubSub.publish("hideTooltip", this);
        }
        const do_mouseover = (ev, d)=>{
            d3.selectAll(this.shadow.querySelectorAll(".backprojected.line.white."+d.cssClass))
                .attr("stroke", "rgba(255,255,255,0.7)")
                .attr("stroke-width", 1.5)
            d3.selectAll(this.shadow.querySelectorAll(".backprojected.line.black."+d.cssClass))
                .attr("stroke", "rgba(0,0,0,0.7)")
                .attr("stroke-width", 1.5)
            PubSub.publish("showTooltip", {
                event: ev,
                content: `<p>Regression for Series:</p><p><em>${d.name}</em></p>`
            }, this)
        }

        series
            .append("path")
            .attr("class", function(d){ return "backprojected line black "+d.cssClass })
            .attr("stroke", "rgba(0,0,0,0.15)")
            .attr("stroke-width", 1)
            .attr("stroke-linejoin", "round")
            .style("stroke-dasharray", ("5, 5"))
            .attr("fill", "none")
            .attr("d", function(d){
                return genLine(d.backprojections);
            })
            .on("mouseover", do_mouseover)
            .on("mouseout", do_mouseout)

        series
            .append("path")
            .attr("class", function(d){ return "backprojected line white " + d.cssClass })
            .attr("stroke", "rgba(255,255,255,0.15)")
            .attr("stroke-width", 1)
            .attr("stroke-linejoin", "round")
            .style("stroke-dasharray", ("0, 5, 0"))
            .attr("fill", "none")
            .attr("d", function(d){
                return genLine(d.backprojections);
            })
            .on("mouseover", do_mouseover)
            .on("mouseout", do_mouseout)



        series
            .append("path")
            .style("fill", (d, i) => color[i]['projected'])
            .attr("class", "projected")
            .attr("d", function(d){ 
                console.log(d.cssClass, d.name);
                return genArea(d.projected);
            })
            .on("mouseover", (ev, d)=>{ 
                PubSub.publish("showTooltip", {
                    event: ev,
                    content: `<p>Projection for Series:</p><p><em>${d.name}</em></p>`
                    //+`<p>Equation: y = ${d.projectionEquation.m} • x + ${d.projectionEquation.b}<p>`
                }, this);
            })
            .on("mouseout", (ev, d)=>{
                PubSub.publish("hideTooltip", this)
            })  

        series
            .append("path")
            .attr("class", "projected line")
            .attr("stroke", (d, i) => color[i]['projected-line'])
            .attr("fill", "none")
            .attr("stroke-linejoin", "round")
            .attr("stroke-width", 0.5)
            .attr("d", function(d){
                return genLine(d.projected);
            })

        stackedDataToGraph.forEach((dataSeries)=>{
            series
                .selectAll(`.point-circle.${dataSeries.cssClass}`)
                .data(dataSeries.historical)
                .enter()
                .append("circle")
                    .attr("class", `point-circle ${dataSeries.cssClass}`)
                    .attr("fill", "rgba(0,0,0,0.0)")
                    .attr("stroke", "none")
                    .attr("cx", function(d){ return x_scale(d.time); })
                    .attr("cy", function(d){ return y_scale(d.values[1]); })
                    .attr('r', 3)
                    .on("mouseover", (ev, d)=>{ 
                        const data = stackedDataToGraph;
                        var series = null;
                        for(var i=0; i<data.length; i++){
                            var seriesClass = ev.path[0].getAttribute("class").split(" ").filter((cls)=>{return cls.indexOf("series-")>=0;})
                            if(seriesClass[0].indexOf(data[i].cssClass) >= 0){
                                series = data[i];
                            }
                        }
                        PubSub.publish("showTooltip", { "event": ev,
                                  "content": `<p>Series: <em>${series.name}</em></p>
                                       <p>Sample Date: ${d3.timeFormat("%b %d, %Y")(d.time)}</p>
                                       <p>Sample: ${typeof(this.formatY) == "function" ? this.formatY(d.original[1]) : d3.format(this.formatY)(d.original[1]) }`});
                        d3.select(ev.path[0])
                            .attr('r', 3.5)
                            .attr('stroke', (d, i) => color[i]['historical-line'])
                            .attr('fill', (d, i) => color[i]['historical-circle-fill'])
                    })
                    .on("mouseout", function(ev, d){
                        PubSub.publish("hideTooltip");
                        d3.select(ev.path[0])
                            .attr('r', 3)
                            .attr('stroke', "none")
                            .attr('fill', "rgba(0,0,0,0.0)")
                    });

        });



        let lineGroup = svg
            .selectAll(".boundary")
            .data(boundaryData)
            .enter()
            .append("g")
            .attr("transform", `translate(70, 10)`)
            .attr("class", 'boundary')
            .append("path")
            .style("stroke-dasharray", ("4, 2"))
            .attr("fill", "none")
            .attr("stroke", "red")
            .attr("stroke-width", 1)
            .attr("d", d3.line()
                .x(function(d) { return x_scale(d.time) })
                .y(function(d) { return y_scale(d.limit) })
            )

        let now = svg
            .selectAll(".dateline")
            .data([[{ x: new Date(), y: y_domain[0] },{ x: new Date(), y: y_domain[1] }]])
            .enter()
            .append("g")
            .attr("transform", `translate(70, 10)`)
            .attr("class", 'dateline')
            .append("path")
            .style("stroke-dasharray", ("8, 8"))
            .attr("fill", "none")
            .attr("stroke", "black")
            .attr("stroke-width", 1)
            .attr("d", d3.line()
                .x(function(d){ return x_scale(d.x)})
                .y(function(d){ return y_scale(d.y); })
            );



        // Add scales to axis
        let x_axis = d3.axisBottom()
                       .tickFormat(d3.timeFormat(this.formatX))
                       .scale(x_scale);

        let x_axis_group = svg.append("g")
            .attr("transform", `translate(70, ${y_height - 40})`)
        x_axis_group
            .append("g")
            .attr("transform", `translate(${x_width/2}, 65)`)
            .append("text")
            .attr("text-anchor", "middle")
            .text(this._labelX)
            .attr("style", this._textStyle)
        x_axis_group
            .append("g")
            .call(x_axis)
            .selectAll("text")
                .attr("text-anchor", "end")
                .attr("dx", "-0.8em")
                .attr("dy", "-0.3em")
                .attr("transform", "rotate(-55)");

        // Add scales to axis
        let y_axis = d3.axisLeft()
                       .tickFormat(typeof(this.formatY) == "function" ? (d)=>{ return this.formatY(d); }: d3.format(this.formatY))
                       .scale(y_scale);

        //Append group and insert axis
        let y_axis_group = svg.append("g")
            .attr("transform", `translate(70, 10)`)
        y_axis_group
            .append("g")
            .call(y_axis)
        y_axis_group
            .append("g")
            .attr("transform", `translate(-60, ${y_height/2})`)
            .append("text")
            .attr("transform", `rotate(270)`)
            .attr("text-anchor", "middle")
            .text(this._labelY)
            .attr("style", this._textStyle)

    }

    setTimeInterval(){
        let select = this.shadow.querySelector('#interval');
        this.timeInterval = select.options[select.selectedIndex].value;
    }

    setTimeIntervalAndFilter(){
        this.setTimeInterval();
        this.filterGraphData();
    }

    setTimeValue(){
        let slider = this.shadow.querySelector('#slider');
        this.timeValue = slider.value;
        let valueDisplay = this.shadow.querySelector("#value-display");
        valueDisplay.value = this.timeValue;
    }

    setTimeValueAndFilter(){
        this.setTimeValue();
        this.filterGraphData();
    }


    generateGraphData(duration){
        let medians = [1000, 100];
        let asymptote = 1500;
        let stepValue = 20;
        // dataToGraph is an array of area plots to stack.
        // each area plot has two child attributes:
        // 'historical' for historical data and
        // 'projected' for projected data
        let dataToGraph = [
            {
                "name": "Linear Progression",
                "historical": [],
                "projected": [],
            },
            {
                "name": "Smaller Linear Progression",
                "historical": [],
                "projected": [],
            }
        ];
        //let boundaryData = [[]];
        for(let i=0; i<duration; i++){
            let now = new Date()
            let backwardDateData = {
                years: now.getFullYear(),
                months: now.getMonth(),
                days: now.getDate(),
                hours: now.getHours(),
                minutes: now.getMinutes(),
                seconds: now.getSeconds()
            }
            backwardDateData[this.timeInterval] -= i;
            dataToGraph[0].historical.unshift({
                time: this.getDate(backwardDateData),
                values: [0, medians[0]-(i*stepValue) > 0 ? medians[0]-(i*stepValue) : 0]
            })
            dataToGraph[1].historical.unshift({
                time: this.getDate(backwardDateData),
                values: [0, medians[1]-(i*stepValue/10) > 0 ? medians[1]-(i*stepValue/10) : 0]
            })
        }
        return dataToGraph;
    }

    // utility / calculation functions
    // render function
    render(){
        if(!this.shadow){
            this.shadow = this.attachShadow({"mode": "open"})
        }

        this.shadow.innerHTML = `
            <div style='width:${this.width}px; height:${this.height}px;'>
                <style>
                    .tooltip {
                        font-family: sans-serif;
                        font-size:12px;
                        padding: 5px 10px;
                        position: absolute;
                        background: white;
                        max-width:180px;
                        box-shadow: 5px 5px 5px rgba(0,0,0,0.1);
                        border-radius: 3px;
                        z-index:600;
                    }
                    .tooltip p {
                        margin: 5px; 
                    }
                </style>
                <div style='width:${this.width * .47}px; display:inline-block; margin-right: ${this.width * 0.03}px'>
                    <input type='range' id='slider' min='${this.timeSelectorMinValue}' max='${this.timeSelectorMaxValue}' value='${this.timeValue}' style='width:100%'/>
                </div>
                <div style='width:${this.width * .12}px; display:inline-block; margin-right: ${this.width * 0.03}px'>
                    <input type='text' id='value-display' value='${this.timeValue}' style='width:100%'/>
                </div>
                <div style='width:${this.width * .29}px; display: inline-block'>
                    <select id='interval'>
                        ${ SLIDER_UNITS.map((v)=>`<option value='${v}' ${v==this.timeInterval && "selected" || ""}>${v}</option>`)}
                    </select>
                </div>
                <div id='graph'>
                </div>
            </div>
        `

        this.bindEvents({
            "#interval@onchange": this.setTimeIntervalAndFilter,
            "#slider@onchange": this.setTimeValueAndFilter,
        })

        this.setTimeInterval();
        this.setTimeValue();
        if(!this._graphData){
            this._graphData = this.generateGraphData(100);
        }
        this.filterGraphData();
        this.renderGraph();


    }
    // connect component to DOM
    connectedCallback(){
        this.render();    
    }
}

// register component
customElements.get('throughput-estimation-graph') || customElements.define( 'throughput-estimation-graph', ThroughputEstimationGraph );
