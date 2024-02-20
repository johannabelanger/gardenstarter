
export type Meters = number
export type Celsius = number
export type Hours = number
export type Url = string
export type Percent = number



export type GeoCoords = {
    latitude: number,
    longitude: number,
  }

export type Moment = {
    hour?: number,
    day?: number,
    month?: number,
    year?: number,
}

export type MicroclimateMap = {
    center: GeoCoords,
    radius: Meters,
    pixelSize: Meters,
    values: (row: number, column: number, moment: Moment) => MicroclimateMoment,
    // calculate extent? helpful for predicting canvas width and height?
    hasLightData: boolean,
    hasTempData: boolean,
}

export type HSL = {
    hue: number,
    saturation: number,
    lightness: number,
}

export interface CanvasLayer {
    widthpx: number,
    heightpx: number,
    hslValueAt: (row: number, column: number) => HSL,
    style?: React.CSSProperties,
}

export type MicroclimateMoment = {
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




