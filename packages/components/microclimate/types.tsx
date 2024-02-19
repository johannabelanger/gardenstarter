
type Meters = number
type Celsius = number
type Hours = number
type Url = string
type Percent = number



type GeoCoords = {
    latitude: number,
    longitude: number,
  }

type Moment = {
    hour?: number,
    day?: number,
    month?: number,
    year?: number,
}

type MicroclimateMap = {
    center: GeoCoords,
    radius: Meters,
    pixelSize: Meters,
    values: (row: number, column: number, moment: Moment) => MicroclimateMoment,
    // calculate extent? helpful for predicting canvas width and height?
    hasLightData: boolean,
    hasTempData: boolean,
}

type HSL = {
    hue: number,
    saturation: number,
    lightness: number,
}

interface CanvasLayer {
    widthpx: number,
    heightpx: number,
    hslValueAt: (row: number, column: number) => HSL,
    style?: React.CSSProperties,
}

type MicroclimateMoment = {
    temperature: Celsius,
    light: Hours,
    //slope
}



/* 
    locations: Location[]
    for(location of locations){
        <name><loading>
        for(let month = 1; month < 13; month++){
            <MicroclimateMap location, moment>    
        }
    }


*/




