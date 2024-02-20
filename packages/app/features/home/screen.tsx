
import { A, H1, P, Text, TextLink } from 'app/design/typography';
import { Row } from 'app/design/layout';
import { View } from 'app/design/view';
import {YearMap} from '../../../components/microclimate/microclimateMap';
import {useState} from 'react';

import {plants} from '../../../components/plants/data';
import {Button} from 'react-native';
import { GardenDesignLayout } from '../garden/design';

type GeoCoords = {
  latitude: number,
  longitude: number,
};

export function HomeScreen() {
//Home: 43.386216, -124.265794
const coosbay: GeoCoords = {latitude: 43.386216, longitude: -124.265794};
// Mom and Dad's 44.59194405984583, -123.25520772742998
const corvallis: GeoCoords = {latitude: 44.59194405984583, longitude: -123.25520772742998};
//Portland 45.531036291983206, -122.62799454285737
const portland: GeoCoords = {latitude: 45.531036291983206, longitude: -122.62799454285737};
//Fairbanks 64.83355931280387, -147.74748756066649
const fairbanks: GeoCoords = {latitude: 64.83355931280387, longitude: -147.74748756066649};
// Oslo 59.89564166395883, 10.785743417155842
const oslo: GeoCoords = {latitude: 59.89564166395883, longitude: 10.785743417155842};
// Atlanta 33.743708300626075, -84.44418266692445
const atlanta: GeoCoords = {latitude: 33.743708300626075, longitude: -84.44418266692445};
// Johannesberg -26.181043152226504, 28.025551235811378
const joburg: GeoCoords = {latitude: -26.181043152226504, longitude: 28.025551235811378};
// Phoenix 33.432594380992526, -112.10319689473438
const phoenix: GeoCoords = {latitude: 33.432594380992526, longitude: -112.10319689473438};
// from-sky-400 to-yellow-100
// text-white
// from-blue-950 to-indigo-500
// text-violet-300
const [selectedPlant, setSelectedPlant] = useState<any | undefined>(undefined);
  return (
      <View className="flex-1 items-center justify-start justify-items-start p-3 landscape:p-0 bg-gradient-to-b from-sky-400 to-yellow-100">
        <div className="flex justify-center w-screen p-8">
          <H1 className="font-amaranth text-3xl text-white">Garden Starter</H1>
        </div>
        <GardenDesignLayout/>
        {/* <div style={{display: "flex"}}>
          <div style={{display: "flex", flexWrap: "wrap"}}>
            <div>
              <Text>Portland</Text>
              <YearMap loc={portland} plant={selectedPlant} />
            </div>
            <div>
              <Text>Fairbanks</Text>
              <YearMap loc={fairbanks} plant={selectedPlant} />
            </div>
            <div>
              <Text>Oslo</Text>
              <YearMap loc={oslo} plant={selectedPlant} />
            </div>
            <div>
              <Text>Atlanta</Text>
              <YearMap loc={atlanta} plant={selectedPlant} />
            </div>
            <div>
              <Text>Johannesburg</Text>
              <YearMap loc={joburg} plant={selectedPlant} />
            </div>
            <div>
              <Text>Phoenix</Text>
              <YearMap loc={phoenix} plant={selectedPlant} />
            </div>
            <div>
              <Text>Corvallis</Text>
              <YearMap loc={corvallis} plant={selectedPlant} />
            </div>
            <div>
              <Text>Coos Bay</Text>
              <YearMap loc={coosbay} plant={selectedPlant} />
            </div>
          </div>
          <div style={{display: "flex", flexDirection: "column"}}>
            {
              plants.map((plant: any) => {
                return <Button 
                  title={plant.name}
                  color={plant.name === selectedPlant?.name ? "#FF0000" : "#f194ff"}
                  onPress={() => setSelectedPlant(plant)}
                />
              })              
            }
          </div>
        </div> */}
        {/* <div className='flex content-evenly bg-green-500'>
          <span className='p-2'>Design</span>
          <span className='p-2'>Inventory</span>
          <span className='p-2'>To-Do</span>
          <span className='p-2'>Journal</span>
        </div> */}
        <div><span>Vegetables </span><a href="http://www.freepik.com">Designed by AomAm / Freepik</a></div>
      </View>
  )
}
