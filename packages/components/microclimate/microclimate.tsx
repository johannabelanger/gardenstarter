import { Plant } from "../plants/data"

export type SolarApiParams = {
    center: GeoCoords, 
    radius: Meters
}

export type SolarData = {
    rows: (month: number) => number,
    columns: (month: number) => number,
    getDaysOfSun: (row: number, column: number, month: number, hour: number) => number | undefined

}
export type WeatherMoment = {
    temperature: {
        minimum: Celsius | undefined,
        maximum: Celsius | undefined,
        mean: Celsius | undefined,
    }
}

export type WeatherData = {
    monthly: (month: number) => WeatherMoment | undefined
}

export type WeatherApiParams = {
    location: GeoCoords
}


export type MicroclimateParams = {
    solarData: SolarData
    weatherData: WeatherData
}
export type Microclimate = {
    columns: (month: number) => number, 
    rows: (month: number) => number, 
    monthlyAverageHoursOfSun: (row: number, column: number, month: number) => number | undefined,
    monthlyAverageSunnyPercentOfDay: (row: number, column: number, month: number) => Percent | undefined,
    monthlyAverageTemp: (month: number) => number | undefined,
}

export const getMicroclimate: (params: MicroclimateParams) => Microclimate = (params: MicroclimateParams) => {
    const {solarData, weatherData} = params
    const daysOfSun = solarData?.getDaysOfSun
    const daysInMonth: number[] = [31,28,31,30,31,30,31,31,30,31,30,31]

    const isSunnyOnAverage = (row: number, column: number, month:number, hour: number) => {
        if(!daysOfSun){ return undefined }

        const days = solarData?.getDaysOfSun(row, column, month, hour)
        return days ? days >= ((daysInMonth[month]! / 2) ? 1 : 0) : undefined
    }
    
    const monthlyAverageHoursOfSun = (row: number, column: number, month: number) => {
        let hoursOfSun = 0;
        for(let hour = 0; hour < 24; hour++){
            if(isSunnyOnAverage(row, column, month, hour)) {
                hoursOfSun++;
            }
        }
        return hoursOfSun;
    }

    const monthlyAverageSunnyPercentOfDay = (row: number, column: number, month: number) => {
        const hours = monthlyAverageHoursOfSun(row, column, month);
        return hours ? hours  / 24 * 100 : undefined;
    }

    const monthlyAverageTemp = (month: number) => {
        return weatherData?.monthly(month)?.temperature?.mean;
    }

    return {
        columns: solarData?.columns, 
        rows: solarData?.rows,
        monthlyAverageHoursOfSun,
        monthlyAverageSunnyPercentOfDay,
        monthlyAverageTemp,
    }
}

export const getMicroclimateLayer: (microclimate: Microclimate, month: number, plant: Plant | undefined) => CanvasLayer  | undefined = 
    (microclimate: Microclimate, month: number, plant: Plant) => {
        // const light = (row: number, column: number) => {
        //     const columns = mc?.columns(month) ?? 0
        //     const index = (row * columns) + column;
        //     const hoursOfLight = shadeData[index]! === -9999 ? 0 : shadeData[index]!;
        //     const asPercentOfDay = hoursOfLight / 24 * 100;
        //     return {asPercentOfDay};
        //   }
        //   const temp = (averageTemp) => {
        //     // move 1 hue degree per degree Celsius
        //     // temps too cold for plant growth will be in the blue spectrum
        //     // temps amenable to plant growth will be in the green-yellow-orange spectrum
        //     // temps too hot for plant growth will in the red spectrum 
        //     // if including green: 180 - (averageTemp * 4);
        //     const hueAngle = 180 - (averageTemp * 4) // averageTemp ? averageTemp < 6 ? 170 - (averageTemp - 6) : 60 - averageTemp : null; 
        //     return {hueAngle}
        //   }
          const lightAndTempLayer = (row: number, column: number) => {
            const averageTemp = microclimate.monthlyAverageTemp(month);
            const hoursOfSun = microclimate.monthlyAverageHoursOfSun(row, column, month);
            const lightness = microclimate.monthlyAverageSunnyPercentOfDay(row, column, month) ?? 50;
            let hueAngle;
            if(averageTemp != undefined){
                hueAngle = 180 - (averageTemp * 4);
            }
            let hue = hueAngle ?? 0;
            let saturation = hue ? 60 : 0;
            if(plant){
                if((hoursOfSun ? hoursOfSun > plant.light.minimum : true) && (averageTemp ? averageTemp > plant.temp.minimum && averageTemp < plant.temp.maximum : true)){
                  // hue =  270 + (averageTemp ?? 0 * 4);
                  saturation = 60;
                } else {
                  saturation = 0;
                }
            }
    
            return {hue, saturation, lightness};
          }
        console.log("Microclimate Height/Width: ", microclimate.columns(month), microclimate.rows(month));
        const monthNameLabels: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return {widthpx: microclimate.columns(month) ?? 31, heightpx: microclimate.rows(month) ?? 31, hslValueAt: lightAndTempLayer, monthName: monthNameLabels[month]}
    }

// {columns, hoursOfSun.asPercentOfDay, monthlyAverageTemp  }