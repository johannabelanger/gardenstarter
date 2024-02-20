import { getDataLayers, getGeoTiff, DataLayers } from '@nora-soderlund/google-maps-solar-api';
import {fromArrayBuffer, ReadRasterResult} from 'geotiff';
import { log } from "../utilities/logger";
import { fetchSolarData, storeSolarData } from './data';
import { SolarApiParams, SolarData } from './microclimate';
import { GeoCoords, Meters } from './types';

export const daysInMonth = [31,28,31,30,31,30,31,31,30,31,30,31];

export type GoogleMapsSolarApiData = {
    center: GeoCoords,
    radius: Meters,
    scale: Meters,
    dataLayers: {
        imageryDate: {year: number, month: number, day: number},
        imageryProcessedDate: {year: number, month: number, day: number},
        imageryQuality: "LOW" | "MEDIUM" | "HIGH" | "IMAGERY_QUALITY_UNSPECIFIED",
        dsmUrl?: string,
        rgbUrl?: string,
        maskUrl?: string,
        annualFluxUrl?: string,
        monthlyFluxUrl?: string,
        hourlyShadeUrls?: string[]
    },
    columns: number,
    rows: number,
    monthlyShadeData: (ReadRasterResult | undefined)[],
}


const fetchDataFromGoogleApi = async (params: SolarApiParams) => {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    let data: GoogleMapsSolarApiData | undefined
    if(apiKey){
        try{
            const dataLayers = await getDataLayers(apiKey, {
                location: params.center,
                radiusMeters: params.radius,
                view: "FULL_LAYERS"
            });

            var columns = 0;
            var rows = 0;
            if(dataLayers.hourlyShadeUrls){
                const monthlyShadePromises: Promise<ReadRasterResult | undefined>[] = [];
                for(let month = 0; month < 12; month++){
                    monthlyShadePromises[month] = getGeoTiff(apiKey, dataLayers.hourlyShadeUrls[month]!)
                    .then((geotiff) => {
                        return fromArrayBuffer(geotiff)
                    })
                    .then((tiff) => {
                        return tiff.getImage()
                    })
                    .then((tiffImage) => {
                        columns = Math.max(columns, tiffImage.getWidth());
                        rows = Math.max(rows, tiffImage.getHeight());
                        return tiffImage.readRasters()
                    })
                    .catch((error) => {
                        log('error', error)
                        return undefined
                    });
                }
                const monthlyShadeData = await Promise.all(monthlyShadePromises);
                
                data = {center: params.center, radius: params.radius, scale: 0.1, dataLayers, columns, rows, monthlyShadeData }
            }
        } catch(error){
            log('error', "Error getting solar data: ", JSON.stringify(error));
        }
    }
    return data
}

export const solarDataApi: (params: SolarApiParams) => Promise<SolarData> = async (params: SolarApiParams) => {
    let data: GoogleMapsSolarApiData | undefined
    //try fetch from storage
    try {
        console.log("Fetching data from storage");
        data = await fetchSolarData(params)
        console.log("Solar data: ", data);
    } catch (error) {
        log('error', 'Error fetching from solar data from local storage', JSON.stringify(error));
    }
    //try fetch from api
    if(!data?.monthlyShadeData){
        console.log("Fetching data from solar api");
        data = await fetchDataFromGoogleApi(params)
        if(data) storeSolarData(params, data)
    }
    const rows = (month: number) => {
        return data?.rows ?? 31
    }
    const columns = (month: number) => {
        return data?.columns ?? 31
    }
    const getDays = (row: number, column: number, hour:number, month:number) => {
        if(!data) return undefined
        //raster is per month
        //values are indexed by [hour][(row * width) + column]
        //values are a bit map of where each bit represents one day of the month
        //on is sunny, off is shady
        const width = columns(month);
        const index = (row * width) + column;
        const shadeData: any = data.monthlyShadeData;
        return shadeData?.[month]?.[hour]?.[index] || 0
    }
    
    const getDaysOfSun = (row: number, column: number, month: number, hour: number) => {
        const days:Number | undefined = getDays(row, column, hour, month)
        return days ? days.toString(2).split('').filter(c => c === '1').length : undefined
    }
    
    return {rows, columns, getDaysOfSun}
}