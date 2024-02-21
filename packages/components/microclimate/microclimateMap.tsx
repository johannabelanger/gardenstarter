'use client'
import {useState, useRef, useEffect, CSSProperties, MouseEventHandler, MouseEvent} from 'react';
import { ActivityIndicator } from 'react-native';
import { useMicroclimateData } from './useMicroclimateData';
import { Microclimate, getMicroclimateLayer } from './microclimate';
import { Plant } from '../plants/data';
import { GeoCoords, CanvasLayer, Celsius } from './types';

export const YearMap = (params: {loc: GeoCoords, plant: Plant | undefined}) => {
  const {loc, plant} = params;
  const {microclimate} = useMicroclimateData({center: loc, radius: 15});
  const [selectedMonth, setSelectedMonth] = useState<Number | null>(null);
  
  const unselectedScale = 2;
  const selectedScale = 7;
  const columns = microclimate?.columns(0);
  const rows = microclimate?.rows(0);
  const divStyle: CSSProperties = {display: "flex", flexWrap: "wrap", gap: 5, width: columns ? columns * (3 * unselectedScale) + 25 : 0, height: rows ? rows * (4 * unselectedScale) + 10 : 0};

  return !microclimate ? 
        <ActivityIndicator size="large" color="#00ff00" /> :
        <MonthMap
          microclimate={microclimate} 
          plant={plant}
        />
}
function MonthMap(props: {microclimate: Microclimate | undefined, plant:Plant | undefined}){
  const {microclimate, plant} = props;
  const canvasRef = useRef(null);
  const [canvasReady, setCanvasReady] = useState(false);
  
  const [layers, setLayers] = useState<any>([]);
  const unselectedScale = 3;
  const selectedScale = 2;
  const [scale, setScale] = useState(unselectedScale);


  useEffect(() => {
    const canvas: any = canvasRef.current;
    if(canvas && !canvasReady){
      setCanvasReady(true);
    }
  });

  useEffect(() => {
    if(microclimate){
      let layers: {microclimate: CanvasLayer | undefined, rowOffset: number, columnOffset: number}[] = [];
      let microclimateLayer: CanvasLayer | undefined, rowOffset: number = 0, columnOffset: number = 0;
      for(let month = 0; month < 12; month++){
        microclimateLayer = getMicroclimateLayer(microclimate, month, plant);
        if(microclimateLayer){
          columnOffset = (12 + microclimateLayer.widthpx) * (month % 3);
          rowOffset = (12 + microclimateLayer.heightpx) * Math.floor(month / 3);
          layers[month] = {microclimate: getMicroclimateLayer(microclimate, month, plant), rowOffset, columnOffset};
        }
      }
      setLayers(layers);
    }
  },[microclimate, plant]); 

  useEffect(() => {
    const canvas: any = canvasRef.current;
    // console.log({widthpx, heightpx, canvasReady, canvas, shadeData: !!shadeData, scale});

    if(canvas && layers.length > 0){
      const context = canvas.getContext('2d');
      //reset from previously adjusted dimensions back to calculated dimensions
      canvas.width = canvas.style.width;
      canvas.height = canvas.style.height;
      //adjust for dpr
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio;
      console.log("DPR: ", dpr);
      const unscaledWidth = 117; // 97 for 3, 130 for 4
      const unscaledHeight = 172;
      let xScale = Math.floor(rect.width * dpr / unscaledWidth);
      let yScale = Math.floor(rect.height * dpr / unscaledHeight);
      let desiredScale = Math.min(xScale, yScale);
      console.log("Scale: ", desiredScale);
      canvas.width = rect.width * (dpr * 100) / 100;
      canvas.height = rect.height * (dpr * 100) / 100;
      const newWidth = unscaledWidth * desiredScale;
      const newHeight = unscaledHeight * desiredScale;
      const xOffset = newWidth < canvas.width ? Math.floor((canvas.width - newWidth) / 2) : 0;
      const yOffset = newHeight < canvas.height ? Math.floor((canvas.height - newHeight) / 2) : 0;
      context.setTransform(desiredScale,0,0,desiredScale,xOffset,yOffset);
      // context.scale(dpr * scale, dpr * scale);
      // canvas.style.width = rect.width * dpr + "px";
      // canvas.style.height = rect.height * dpr +"px";
      context.imageSmoothingEnabled = false;
      // context.scale(scale, scale);
      for(let month = 0; month < 12; month++){
        for(let row = 0; row < layers[month].microclimate.heightpx; row++) {
          for(let column = 0; column < layers[month].microclimate.widthpx; column++) {
            // const index = (row * widthpx) + column;
            
            // const value = shadeData[index]!;
            // // if(row < 4 && column < 4) console.log({row, column, value: shadeData[index]});
            // if(value === -9999)
            //   continue;
    
            // // Shade overlay goes here
            const {hue, saturation, lightness} = layers[month].microclimate.hslValueAt(row, column);
            context.fillStyle = `hsl(${hue} ${saturation}% ${lightness}%)`;
            // console.log(`hsl(${hue} ${saturation}% ${lightness}%)`)
            context.fillRect(column + layers[month].columnOffset, row + layers[month].rowOffset, 1, 1);    
          }
        }
        context.font = "9px Unknown Font, sans-serif, bold";
        context.fillStyle = "rgb(30 41 59)"; // set stroke color to white
        context.lineWidth = dpr.toString();  //  set stroke width to 1
        let labelCol = layers[month].columnOffset + 8;
        let labelRow = layers[month].rowOffset + layers[month].microclimate.heightpx + 9;
        context.fillText(layers[month].microclimate.monthName, labelCol, labelRow);
      }
    }
  },[canvasReady, layers, scale]);

  const toggleScale: MouseEventHandler<HTMLCanvasElement> = (e: MouseEvent<HTMLCanvasElement>) => {
    const canvas: any = canvasRef.current;
    const click = relativeCoords(e, canvas);
    
    setScale(scale === unselectedScale ? selectedScale : unselectedScale);
  };

  /* Returns pixel coordinates according to the pixel that's under the mouse cursor**/
const relativeCoords = (event: MouseEvent<HTMLCanvasElement>, canvas: HTMLCanvasElement) => {
  var x,y;
  //This is the current screen rectangle of canvas
  var rect = canvas.getBoundingClientRect();
  var top = rect.top;
  var bottom = rect.bottom;
  var left = rect.left;
  var right = rect.right;
  //Recalculate mouse offsets to relative offsets
  x = event.clientX - left;
  y = event.clientY - top;
  //Also recalculate offsets of canvas is stretched
  var width = right - left;
  //I use this to reduce number of calculations for images that have normal size 
  if(canvas.width!=width) {
    var height = bottom - top;
    //changes coordinates by ratio
    x = x*(canvas.width/width);
    y = y*(canvas.height/height);
  } 
  //Return as an array
  return [x,y];
}

  return microclimate ? <canvas ref={canvasRef} style={{height:"100%", width:"100%", imageRendering: "pixelated"}} onClick={toggleScale} /> : null
}