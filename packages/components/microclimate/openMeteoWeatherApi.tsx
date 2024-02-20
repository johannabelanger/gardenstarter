import { WeatherApiParams, WeatherData, WeatherMoment } from "./microclimate"; 
import { Celsius, GeoCoords } from './types';
const daysInMonth: number[] = [31,28,31,30,31,30,31,31,30,31,30,31]; 

type OpenMeteoApiData = {
    years: number,
    daily: {
        temperature_2m_min: Celsius[],
        temperature_2m_max: Celsius[],
        temperature_2m_mean: Celsius[],
    }
}

const fetchDataFromOpenMeteoApi = async (location: GeoCoords) => {
    const weatherDataRequest = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${location.latitude}&longitude=${location.longitude}&start_date=2021-01-01&end_date=2022-12-31&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean&timezone=America%2FLos_Angeles`)
    
    const weatherJson: any = await weatherDataRequest.json()
    const weatherData: OpenMeteoApiData = {
        years: 2,
        daily: {
            temperature_2m_min: weatherJson?.daily?.temperature_2m_min ?? [],
            temperature_2m_max: weatherJson?.daily?.temperature_2m_max ?? [],
            temperature_2m_mean: weatherJson?.daily?.temperature_2m_mean ?? [],
        }
    }
    
    return weatherData
}
const ignoreNulls = (f: Function, ...args: any[]) => {
    const nonNullArgs = args.filter(a => a !== null && a !== undefined)
    return nonNullArgs.length ? f(...nonNullArgs) : undefined
}
export const weatherDataApi: (params: WeatherApiParams) => Promise<WeatherData> = async ({location}) => {
    const weatherData = await fetchDataFromOpenMeteoApi(location)
    const monthlyData: WeatherMoment[] = []
    let index: number = 0

    for(let month = 0; month < 12; month++){
        let minimum: Celsius | undefined
        let maximum: Celsius | undefined
        let total: number = 0
        let count: number = 0
        for(let day = 0; day < daysInMonth[month]!; day++){
            minimum = ignoreNulls(Math.min, minimum, weatherData.daily.temperature_2m_min[index])
            maximum = ignoreNulls(Math.max, maximum, weatherData.daily.temperature_2m_max[index])
            for(let year = 0; year < weatherData.years; year++){
                if(weatherData.daily.temperature_2m_mean[index * (year + 1)]){
                    total += weatherData.daily.temperature_2m_mean[index]!
                    count++
                }
            }
            index++
        }
        let mean = total / count
        monthlyData[month] = {temperature: {minimum, maximum, mean}}
    }
    const monthly = (month: number) => {
        return monthlyData[month]
    }
    return {monthly}
}
// const weatherDataRequest = await fetch(`https://archive-api.open-meteo.com/v1/archive?latitude=${loc.latitude}&longitude=${loc.latitude}&start_date=2020-01-01&end_date=2022-12-31&daily=temperature_2m_max,temperature_2m_min,temperature_2m_mean&timezone=America%2FLos_Angeles`);
//     const weatherData:any = await weatherDataRequest.json();
//     console.log({weatherData: weatherData});
//     const weatherMeans = weatherData?.daily?.temperature_2m_mean;
//     const daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];
//     const monthlyTemps: number[] = [];
//     var tempIndex = 0;
//     for(let m = 0; m < 12;m++){
//       var total = 0;
//       for(let d = 0; d < daysInMonth[m]!; d++){
//         total = total + weatherMeans[tempIndex] + weatherMeans[tempIndex + 365] + weatherMeans[tempIndex + 365 + 365];
//         tempIndex++;
//       }
//       monthlyTemps[m] = total / daysInMonth[m]! / 3;
//     }
//     console.log({monthlyTemps});
//     setMonthlyTempData(monthlyTemps);