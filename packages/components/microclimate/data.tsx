import { log } from "../utilities/logger";
import { GoogleMapsSolarApiData, SolarApiParams } from "./googleMapsSolarApi";

export const fetchSolarData = async (params: SolarApiParams) => {
    let data
    //try fetch from local storage
    try {
        console.log(params);
        console.log(JSON.stringify(params));
        console.log(localStorage.getItem(JSON.stringify(params)));
        data = JSON.parse(
          localStorage.getItem(JSON.stringify(params)) || '{}'
        )
    } catch (error) {
        log('error', 'Error fetching from solar data from local storage', error)
    }
    return data
}

export const storeSolarData = async (params: SolarApiParams, data: GoogleMapsSolarApiData) => {
    //try store to local storage
    try {
        const parsedData = JSON.stringify(data);
        console.log("Data length: ", parsedData.length);
        localStorage.setItem(JSON.stringify(params), JSON.stringify(data))
    } catch (error) {
        log('error', 'Error fetching from solar data from local storage', error)
    }
    return data
}

export const fetchWeatherData = async (params: WeatherApiParams) => {
    let data
    //try fetch from local storage
    try {
        data = JSON.parse(
          localStorage.getItem(JSON.stringify(params)) || ''
        )
    } catch (error) {
        log('error', 'Error fetching from solar data from local storage', error)
    }
    return data
}

export const storeWeatherData = async (params: SolarApiParams, data: GoogleMapsSolarApiData) => {
    //try store to local storage
    try {
        localStorage.setItem(JSON.stringify(params), JSON.stringify(data))
    } catch (error) {
        log('error', 'Error fetching from solar data from local storage', error)
    }
    return data
}