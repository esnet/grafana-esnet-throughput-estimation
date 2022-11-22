import React, { useEffect, useRef } from 'react';
import { PanelProps } from '@grafana/data';
import { SimpleOptions } from 'types';
//import { stylesFactory, useTheme } from '@grafana/ui';
import { format_bit_size } from "./lib/axisformats.js"
import "./ThroughputEstimationGraph.js";

interface Props extends PanelProps<SimpleOptions> {}

interface GraphElement extends HTMLElement {
    formatY: any;
    setGrafanaGraphData(data: any): void;
}

interface StringLookup {
  [index: string]: Function;
}

const yAxisFormatters: StringLookup = {
  "bytes": format_bit_size,
}

export const ThroughputEstimationPanel: React.FC<Props> = ({ options, data, width, height }) => {
  //const theme = useTheme();
  //const styles = getStyles();
  var graph = useRef<null|GraphElement>(null);

  function updateGraph(){
    if(graph.current){
      graph.current.setGrafanaGraphData(data);
      graph.current.formatY = yAxisFormatters[options.tickFormatY] ? yAxisFormatters[options.tickFormatY] : options.tickFormatY;
    }
  }

  useEffect(() => {
    updateGraph();
  });

  return (
    React.createElement("throughput-estimation-graph", {
      width: width,
      height: height,
      "label-x": options.labelx,
      "label-y": options.labely,
      "format-x": options.tickFormatX,
      "time-interval": options.defaultTimeInterval,
      "time-value": options.defaultTimeValue,
      "boundary": options.boundary * options.boundaryUnits,
      "algorithm": options.algorithm,
      ref: graph,
    })
  );
};

/*const getStyles = stylesFactory(() => {
  return {
  };
});*/
