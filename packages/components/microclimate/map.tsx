'use client'
import * as React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { getDataLayers, getGeoTiff, DataLayers } from '@nora-soderlund/google-maps-solar-api';
import useLocalStorage from '../utilities/useLocalStorage';
import {fromArrayBuffer, ReadRasterResult} from 'geotiff';
import { ActivityIndicator } from 'react-native';


// const SunMap = ({loc}) => {
//   const {setLocation, solarDataLoaded, rows, columns, daysOfSun} = useSolarData({center: loc, radius: 20})

//   return !solarDataLoaded ? <ActivityIndicator size="large" color="#00ff00" /> : monthMapData.map())

// const daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];

// const getGoogleMap = () => {}
// const getSolarApiDataLayers = async (center: GeoCoords, radius: Meters, apiKey: string): Promise<DataLayers> => {
//   return  getDataLayers(apiKey, {
//     location: center,
//     radiusMeters: radius,
//     view: "FULL_LAYERS"
//   });
// }
// const getTemperatureData = () => {}
// type LightSource = (center: GeoCoords, radius: Meters) => (row: number, column: number, moment: Moment ) => Hours
// const getLightData = async (center: GeoCoords, radius: Meters, apiKey: string): Promise<LightSource> => {
//   const dataLayers = await getSolarApiDataLayers(center, radius, apiKey);

//   if(apiKey && dataLayers.hourlyShadeUrls){
//     const monthlyShadeData: number[][] = [];
//       for(let month = 0; month < 12; month++ ){
//         if(apiKey && dataLayers.hourlyShadeUrls){
//           let data =  await getGeoTiff(apiKey, dataLayers.hourlyShadeUrls[month]!);
//           const tiff = await fromArrayBuffer(data);
//           const tiffImage = await tiff.getImage();
//           const width = tiffImage.getWidth();
//           const height = tiffImage.getHeight();
//           const tiffData: ReadRasterResult = await tiffImage.readRasters();
//           //raster is per month
//           //values are indexed by [hour][(row * width) + column]
//           //values are a bit map of where each bit represents one day of the month
//           //on is sunny, off is shady
//           if(tiffData){
//             let monthResult: number[] = [];
//             for(let hour = 0; hour < 24; hour++){
//               let hourData = tiffData[hour];
//               if(hourData){
//                 let daysOfSun = 0;
//                 let index = 0;
//                 for(let x = 0; x < width; x++){
//                   for(let y = 0; y < height; y++){
//                     for(let day = 0; day < daysInMonth[month]!; day++){
//                       // calculate shade data
//                       index = (x * width) + y;
//                       if((hourData[index]! & (1 << day)) > 0){
//                         daysOfSun++;
//                       }
//                     }
//                     if(monthResult[index] === null || monthResult[index] === undefined) monthResult[index] = 0;
//                     monthResult[index] += (daysOfSun >= (daysInMonth[month]! / 2) ? 1 : 0);
//                     daysOfSun = 0
//                   }
//                 }
//               }
//             }
//             monthlyShadeData[month] = monthResult;
//           }
//         }
//       }
//   }
// } 




const containerStyle = {
  width: 400,
  height: 400
};

const center = {
  lat: 44.59219150718261,
  lng: -123.25516299408277
};

// const loc = {
//   latitude: -26.181043152226504,
//   longitude: 28.025551235811378
// };

function SunMap(props: {loc:{latitude: number, longitude: number}}) {
  const {loc} = props;
  const canvasRef = React.useRef(null);
  const radius = 20;
  
  const [canvasHeight, setCanvasHeight] = React.useState(60);
  const [canvasWidth, setCanvasWidth] = React.useState(60);
  const [selectedMapIndex, setSelectedMapIndex] = React.useState(null);
  const [monthlyTempData, setMonthlyTempData] = React.useState(Array(12).fill(null));

  const [solarData, setSolarData] = useLocalStorage(
    {location: loc, radius}, 
    null
  );

  const [solarDataLoaded, setSolarDataLoaded] = React.useState(false);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "invalid key" ;
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: apiKey
  })
  
  React.useEffect(() => {
    if(!solarData){
      loadDataLayers();
    } else {
      setSolarDataLoaded(true);
    }
  },[]);

  // React.useEffect(() => {
  //   if(solarDataLoaded){
  //     const canvas: any = canvasRef.current;
  //     if(canvas){
  //       const context = canvas.getContext('2d');
  //       context.scale(7,7);
  //       for(let row = 0; row < canvasHeight; row++) {
  //         for(let column = 0; column < canvasWidth; column++) {
  //           const index = (row * canvasWidth) + column;

  //           const value = solarData.monthlyShadeData[11][index];

  //           if(value === -9999)
  //             continue;

  //           // Shade overlay goes here
  //           context.fillStyle = `hsl(120 50% ${((value / 24) * 100)}%)`;
  //           context.fillRect(column, row, 1, 1);
  //         }
  //       }
  //       // const clickHandler = () => {
  //       //   context.fillStyle = 'blue';
  //       //   context.fillRect(0, 0, containerStyle.width + 'px', containerStyle.height + 'px');
  //       // };
  
  //       // canvas.addEventListener('click', clickHandler);
  
  //       // return () => {
  //       //   canvas.removeEventListener('click', clickHandler);
  //       // };
  //     }

  // // Building mask
  //   // const tiffImageBuffer = await getTiff(dataLayers.maskUrl!);

  //   // const tiff = await GeoTIFF.fromArrayBuffer(tiffImageBuffer);
  //   // const tiffImage = await tiff.getImage();
  //   // const tiffData = await tiffImage.readRasters();

  //   // const canvas = document.createElement("canvas");

  //   // canvas.width = tiffData.width;
  //   // canvas.height = tiffData.height;

  //   // const context = canvas.getContext("2d") as CanvasRenderingContext2D;

  //   // for(let row = 0; row < tiffData.height; row++) 
  //   // for(let column = 0; column < tiffData.width; column++) {
  //   //   const index = (row * tiffData.width) + column;

  //   //   if(tiffData[0][index])
  //   //     context.fillRect(column, row, 1, 1);
  //   // }
  // // draw on main canvas
  //   // context.drawImage(fluxCanvas, 0, 0, fluxCanvas.width, fluxCanvas.height, 0, 0, size, size);

  //   // context.globalCompositeOperation = "destination-in";
  //   // context.drawImage(maskCanvas, 0, 0, maskCanvas.width, maskCanvas.height, 0, 0, size, size);
  // // 
  //   }
  // }, [solarDataLoaded]);

  // React.useEffect(() => {
    
  // }, []);

  const loadDataLayers = async () => {
    const weatherDataRequest = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${loc.latitude}&longitude=${loc.latitude}&start_date=2020-01-01&end_date=2022-12-31&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean&timezone=America%2FLos_Angeles`);
    const weatherData:any = await weatherDataRequest.json();
    console.log({weatherData: weatherData});
    const weatherMeans = weatherData?.daily?.temperature_2m_mean;
    const daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
    const monthlyTemps: number[] = [];
    var tempIndex = 0;
    for(let m = 0; m < 12;m++){
      var total = 0;
      for(let d = 0; d < daysInMonth[m]!; d++){
        total = total + weatherMeans[tempIndex] + weatherMeans[tempIndex + 365] + weatherMeans[tempIndex + 365 + 365];
        tempIndex++;
      }
      monthlyTemps[m] = total / daysInMonth[m]! / 3;
    }
    console.log({monthlyTemps});
    setMonthlyTempData(monthlyTemps);
    var dataLayers;
    try{
      const dataLayers = await getDataLayers(apiKey, {
        location: loc,
        radiusMeters: radius,
        view: "FULL_LAYERS"
      });
      const monthlyShadeData: number[][] = [];
      for(let month = 0; month < 12; month++ ){
        // console.log("Days in month: ", daysInMonth[month]);
        if(apiKey && dataLayers.hourlyShadeUrls){
          let data =  await getGeoTiff(apiKey, dataLayers.hourlyShadeUrls[month]!);
          const tiff = await fromArrayBuffer(data);
          const tiffImage = await tiff.getImage();
          const width = tiffImage.getWidth();
          const height = tiffImage.getHeight();
          setCanvasWidth(width);
          setCanvasHeight(height);
          const tiffData: ReadRasterResult = await tiffImage.readRasters();
          if(tiffData){
            let monthResult: number[] = [];
            for(let hour = 0; hour < 24; hour++){
              let hourData = tiffData[hour];
              if(hourData){
                let daysOfSun = 0;
                let index = 0;
                for(let x = 0; x < width; x++){
                  for(let y = 0; y < height; y++){
                    for(let day = 0; day < daysInMonth[month]!; day++){
                      // calculate shade data
                      index = (x * width) + y;
                      //console.log({index, data: monthData[index], mask: (1 << day), result: monthData[index]! & (1 << day)});
                      if((hourData[index]! & (1 << day)) > 0){
                        daysOfSun++;
                      }
                      // calculate temperature data
                    }
                    // console.log("Days of sun: ", daysOfSun, "Is sunny: ",(daysOfSun >= (daysInMonth[month]! / 2) ? 1 : 0), "value at index: ", monthResult[index]);
                    if(monthResult[index] === null || monthResult[index] === undefined) monthResult[index] = 0;
                    monthResult[index] += (daysOfSun >= (daysInMonth[month]! / 2) ? 1 : 0);
                    //console.log("value at index ", index, ": ", monthResult[index]);
                    daysOfSun = 0
                  }
                }
              }
              // console.log(monthResult);
            }
            monthlyShadeData[month] = monthResult;
          }
        }
      }
      setSolarData({urls: dataLayers, monthlyShadeData})
      setSolarDataLoaded(true);
    } catch(error){
      console.log("Error getting solar data: ", error);
    }
  };
  
  const [map, setMap] = React.useState<google.maps.Map | null>(null)

  const onLoad = React.useCallback(function callback(map: google.maps.Map) {
    // This is just an example of getting and using the map instance!!! don't just blindly copy!
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);

    setMap(map)
  }, [])

  const onUnmount = React.useCallback(function callback(map: google.maps.Map) {
    setMap(null)
  }, [])

  const styles = [
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#3ff842"
        },
        {
          "visibility": "on"
        },
        {
          "weight": 1
        }
      ]
    },
    {
      "featureType": "landscape.man_made",
      "elementType": "geometry.stroke",
      "stylers": [
        {
          "color": "#0d0d0d"
        },
        {
          "visibility": "on"
        }
      ]
    },
    {
      "featureType": "landscape.natural.landcover",
      "elementType": "geometry.fill",
      "stylers": [
        {
          "color": "#3dff54"
        },
        {
          "visibility": "on"
        }
      ]
    }
  ];
  const canvasStyle: React.CSSProperties = {border: "1px solid black"};
  // return isLoaded ? (
  //     <canvas ref={canvasRef} height={containerStyle.height + 'px'} width={containerStyle.width + 'px'} style={canvasStyle}></canvas>
  //     // <GoogleMap
  //     //   options={{styles: styles}}
  //     //   mapContainerStyle={containerStyle}
  //     //   center={center}
  //     //   zoom={20}
  //     //   onLoad={onLoad}
  //     //   onUnmount={onUnmount}
  //     // >
  //     //   { /* Child components, such as markers, info windows, etc. */ }
  //     //   <></>
  //     // </GoogleMap>
  // ) : 
  
  const unselectedScale = 2;
  const selectedScale = 7;
  const divStyle: React.CSSProperties = {display: "flex", flexWrap: "wrap", gap: 5, width: canvasWidth * (3 * unselectedScale) + 25, height: canvasHeight * (4 * unselectedScale) + 10};
  const monthMapData = solarData?.monthlyShadeData ?? Array(12).fill(null);
  const monthTemps = monthlyTempData; // [-45,-30,0,10,20,25,30,38,18,0,-25,-67];
  // const selectMap = useCallback(() => {console.log("clicked ", index); setSelectedMapIndex(() => selectedMapIndex === null ? index : null)},[]);
  return <div style={divStyle} >
      {!solarDataLoaded ? <ActivityIndicator size="large" color="#00ff00" /> : monthMapData.map((data, index) => {
        const scale = selectedMapIndex === null ? unselectedScale : selectedMapIndex ===  index ? selectedScale : 0;
        return <MonthMap 
                  key={index} 
                  widthpx={canvasWidth} 
                  heightpx={canvasHeight} 
                  shadeData={data} 
                  averageTemp={monthTemps[index]}
                  scale={scale} 
                  onClick={() => {console.log("clicked ", index); setSelectedMapIndex(() => selectedMapIndex === null ? index : null)}} />
      })}
    </div>
}

function MonthMap({widthpx, heightpx, shadeD, averageTemp, scale, onClick}) {
  const canvasRef = React.useRef(null);
  const [canvasReady, setCanvasReady] = React.useState(false);

  React.useEffect(() => {
    const canvas: any = canvasRef.current;
    if(canvas && !canvasReady){
      setCanvasReady(true);
    }
  });

  React.useEffect(()=>{
    const canvas: any = canvasRef.current;
    if(canvas){
      canvas.addEventListener('click', onClick);
    }
    return () => {
      canvas.removeEventListener('click', onClick);
    };

  },[canvasReady, onClick]);

  React.useEffect(() => {
    const canvas: any = canvasRef.current;
    // console.log({widthpx, heightpx, canvasReady, canvas, shadeData: !!shadeData, scale});

    if(canvas && shadeData){
      const light = (index: number) => {
        const hoursOfLight = shadeData[index]! === -9999 ? 0 : shadeData[index]!;
        const asPercentOfDay = hoursOfLight / 24 * 100;
        return {hoursOfLight, asPercentOfDay};
      }
      const temp = () => {
        // move 1 hue degree per degree Celsius
        // temps too cold for plant growth will be in the blue spectrum
        // temps amenable to plant growth will be in the green-yellow-orange spectrum
        // temps too hot for plant growth will in the red spectrum 
        // if including green: 180 - (averageTemp * 4);
        const hueAngle = 180 - (averageTemp * 4) // averageTemp ? averageTemp < 6 ? 170 - (averageTemp - 6) : 60 - averageTemp : null; 
        return {averageTemp, hueAngle}
      }
      const lightAndTempLayer = (row: number, column: number) => {
        const index = (row * widthpx) + column;

        const tempData = temp();
        const hueAngle = tempData.hueAngle;
        var hue = hueAngle ?? 0;
        var saturation = hueAngle ? 60 : 0;
        const lightData = light(index);
        // show tomato potential
        // if(lightData.hoursOfLight > 8 && averageTemp > 12 && averageTemp < 30){
        //   hue = 0;
        //   // if(lightData.hoursOfLight < 8){
        //   //   saturation = 30;
        //   // }
        // }

        // show peppers potential
        if(lightData.hoursOfLight > 6 && averageTemp > 21 && averageTemp < 29){
          hue = 0;
          // if(lightData.hoursOfLight < 8){
          //   saturation = 30;
          // }
        }

        // // show swiss chard potential
        // if(lightData.hoursOfLight > 3 && averageTemp > 10 && averageTemp < 24){
        //   hue = 0;
        //   // if(lightData.hoursOfLight < 8){
        //   //   saturation = 30;
        //   // }
        // }

        // show lettuce potential
        // if(lightData.hoursOfLight > 3 && averageTemp > 7 && averageTemp < 21){
        //   hue = 0;
        //   // if(lightData.hoursOfLight < 8){
        //   //   saturation = 30;
        //   // }
        // }

        const lightness = lightData.asPercentOfDay;

        return {hue, saturation, lightness};
      }
      // console.log("Rendering");
      const context = canvas.getContext('2d');
      context.scale(scale, scale);
      for(let row = 0; row < heightpx; row++) {
        for(let column = 0; column < widthpx; column++) {
          // const index = (row * widthpx) + column;
          
          // const value = shadeData[index]!;
          // // if(row < 4 && column < 4) console.log({row, column, value: shadeData[index]});
          // if(value === -9999)
          //   continue;
  
          // // Shade overlay goes here
          const {hue, saturation, lightness} = lightAndTempLayer(row, column);
          context.fillStyle = `hsl(${hue} ${saturation}% ${lightness}%)`;
          // console.log(`hsl(${hue} ${saturation}% ${lightness}%)`)
          context.fillRect(column, row, 1, 1);
        }
      }
    }
  },[canvasReady, shadeData, scale])

  const canvasStyle: React.CSSProperties = {}; // {border: "1px solid black"};

  return <canvas ref={canvasRef} height={(heightpx * scale) + 'px'} width={(widthpx * scale) + 'px'} style={canvasStyle} onClick={onClick} />
}

export default SunMap;