import { useEffect, useState, useCallback } from "react"
import { solarDataApi } from "./googleMapsSolarApi"
import { weatherDataApi } from "./openMeteoWeatherApi"
import { Microclimate, SolarData, WeatherData, getMicroclimate } from "./microclimate"
import { log } from "../utilities/logger"

export type MicroclimateParams = {
    center: GeoCoords, 
    radius: Meters
}
export const useMicroclimateData = (locationParams: MicroclimateParams) => {
    const [location, setLocation] = useState<MicroclimateParams | undefined>(locationParams)
    const [solarDataLoaded, setSolarDataLoaded] = useState<boolean>(false)
    const [weatherDataLoaded, setWeatherDataLoaded] = useState<boolean>(false)
    const [solarApi, setSolarApi] = useState<SolarData | undefined>(undefined)
    const [weatherApi, setWeatherApi] = useState<WeatherData | undefined>(undefined)
    const [microclimate, setMicroclimate] = useState<Microclimate | undefined>(undefined);
    
    const loadData = async () => {
        setSolarDataLoaded(false);
        setWeatherDataLoaded(false);
        if(location){
            let solarPromise = solarDataApi(location).then(data => {
                if(data){
                    setSolarApi(data)
                }
            }).catch(error => { log('error', error) }).finally(() => {
                console.log('Setting solar data loaded');
                setSolarDataLoaded(true)
            });
            let weatherPromise = weatherDataApi({location: location.center}).then(data => {
                if(data){
                    setWeatherApi(data)
                }
            }).catch(error => { log('error', error) }).finally(() => {
                console.log('Setting weather data loaded');
                setWeatherDataLoaded(true)
            });
            return Promise.all([solarPromise, weatherPromise]);
        }
    }

    useEffect(() => {
        console.log("Loading data");
        loadData()
    }, [location]);

    useEffect(() => {
        console.log("Solar: ", solarApi);
        console.log("Weather: ", weatherApi);
        if(solarDataLoaded && weatherDataLoaded){
            setMicroclimate(getMicroclimate({solarData: solarApi, weatherData: weatherApi}));
        }
    },[solarDataLoaded, weatherDataLoaded]);

    const rows = useCallback((month: number) => {
        if(!solarDataLoaded || !solarApi) { return undefined }

        return solarApi.rows(month)
    },[solarDataLoaded])

    const columns = useCallback((month: number) => {
        console.log("Getting columns: ", solarDataLoaded, solarApi, solarApi?.columns(month));
        if(!solarDataLoaded || !solarApi) { return undefined }

        return solarApi.columns(month)
    },[solarDataLoaded])

    const daysOfSun = useCallback((row: number, column: number, month: number, hour: number) => {
        if(!solarDataLoaded || !solarApi) { return undefined }

        return solarApi.getDaysOfSun(row, column, month, hour)
    },[solarDataLoaded])

    const monthlyWeather = useCallback((month) => {
        if(!weatherDataLoaded || !weatherApi) { return undefined }

        return weatherApi.monthly(month);
    },[weatherDataLoaded])
    
    return {setLocation, microclimate};
}