
import {useState, useRef} from 'react';
import { Text } from 'app/design/typography';

import {Button, ScrollView, Pressable, Image} from 'react-native';
import {YearMap} from '../../../components/microclimate/microclimateMap';
import {CarouselItem, Carousel} from '../../../components/basic/carousel'

import {plants} from '../../../components/plants/data';
type GeoCoords = {
  latitude: number,
  longitude: number,
};
type Location = {
  label: string,
  location: GeoCoords,
};
export function GardenDesignLayout(){
  const [openDrawer, setOpenDrawer] = useState<string | null>(null);
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
// Clearing 1 Central Park 40.78090667848645, -73.96851382965154
// Take two 40.78092139387318, -73.96851516999476
// Take three 40.78092000104399, -73.9685289608712
// Take four 40.780921517735415, -73.96852729892716
// Take five 40.78092982415834, -73.96852758739335
// community gardens
// Take six 40.82333574753283, -73.95612216747777
// Take seven 40.82333574753283, -73.95612454388343
// Take eight 40.82331594070305, -73.95608028743642
const cp1: GeoCoords = {latitude: 40.82331594070305, longitude: -73.95608028743642}
// Clearing 2 Central Park 40.77962455183849, -73.97249121939629
const cp2: GeoCoords = {latitude: 40.77962455183849, longitude: -73.97249121939629}
// Clearing 3 Central Park 40.77983667915923, -73.96630041866189
const cp3: GeoCoords = {latitude: 40.77983667915923, longitude: -73.96630041866189}
// Monticello 38.009223484229125, -78.4527682390365
// 38.009255184384195, -78.4523115926987
// 38.009180689012865, -78.452758180485
const monticello: GeoCoords = {latitude: 38.009180689012865, longitude: -78.452758180485}
// Thoroughgood house 36.893434405059196, -76.11314984967282
const thoro: GeoCoords = {latitude: 36.893434405059196, longitude: -76.11314984967282}
// The Little House 45.29965524105385, -122.9693546332751
const little: GeoCoords = {latitude: 45.29965524105385, longitude: -122.9693546332751}
// The Crawford House 45.35566466080915, -122.605202505676
const crawford: GeoCoords = {latitude: 45.35566466080915, longitude: -122.605202505676}
// Forest Community Garden 45.447513014320045, -122.67187420427574
const forest: GeoCoords = {latitude: 45.447513014320045, longitude: -122.67187420427574}
// Benton Annex 44.56585993150186, -123.27473586407407
const benton: GeoCoords = {latitude: 44.56585993150186, longitude: -123.27473586407407}
// Gilbert 44.567390084192446, -123.27588250835058
const gilbert: GeoCoords = {latitude: 44.567390084192446, longitude: -123.27588250835058}
// River House 44.06388963008179, -123.10599522748855
const river: GeoCoords = {latitude: 44.06388963008179, longitude: -123.10599522748855}
// Gaiety Hollow 44.932757005037324, -123.03990907682012
const hollow: GeoCoords = {latitude: 44.932757005037324, longitude: -123.03990907682012}
// Thoreau Cabin 42.44208226938825, -71.34252740053623
const thoreau: GeoCoords = {latitude: 42.44208226938825, longitude: -71.34252740053623}
const locations: Location[] = [
  {label: "Oregon", location: corvallis},
  {label: "Alaska", location: fairbanks},
  {label: "Georgia", location: atlanta},
  {label: "Arizona", location: phoenix},
];
const [selectedPlant, setSelectedPlant] = useState<any | undefined>(undefined);
const [currentLocation, setCurrentLocation] = useState<any>(locations[0] ?? {label: "Oregon", location: corvallis});
const canvasRef = useRef(null);

  // const handleDrawerToggle = (toggleName: string) => {
  //   if(openDrawer === toggleName){
  //     setOpenDrawer(null);
  //   } else {
  //     setOpenDrawer(toggleName);
  //   }
  // };
  return <div className="h-full w-full flex flex-col landscape:flex-row-reverse">
    <div className="h-1/2 w-full landscape:h-full landscape:w-1/2 landscape:ml-auto">
      <canvas ref={canvasRef} style={{height:"100%", width:"100%", imageRendering: "pixelated"}} />
      {locations.map((location) =>
        <YearMap 
          key={location.label} 
          loc={location.location} 
          plant={selectedPlant} 
          canvas={currentLocation.label === location.label? canvasRef.current : null}
        />)
      }
    </div>
    <div className="w-full h-1/2 mx-auto flex flex-wrap place-content-center landscape:h-full landscape:w-1/2">
      <Carousel contents={locations} onNavigate={(location: any) => {console.log("Changing to ", location); if(location) setCurrentLocation(location)}}></Carousel>
      { plants.map((plant: any) => {
          const plantIsSelected = selectedPlant?.name === plant.name;
          if(plant.icon) console.log(plant.icon);
//           // return <Button
//           //   title={plant.name}
//           //   color={plant.name === selectedPlant?.name ? "#00a80b" : "#64748b"} // "#474747"}
//           //   onPress={() => setSelectedPlant(plant)}
//           // />
          return <div key={plant.name} className="flex flex-col align-items-end" style={plantIsSelected ? {border: "1px solid green", padding: "0 1.25rem"}: {border: "none", padding: "0 1.25rem"}}><Pressable key={plant.name} onPress={() => setSelectedPlant(plantIsSelected ? undefined : plant)}>
              {plant.icon ? 
                <Image 
                  source={{uri: plant.icon}}
                  resizeMode="contain"
                  style={{ width: 64, height: 64  }} /> : 
                null}
              <Text className="text-slate-800 text-lg text-bold text-center">{plant.name}</Text>
            </Pressable></div>
        })
      }
    </div>
  </div>
  // return <div id='garden-design' className='grid grid-rows-12 grid-cols-12 h-full place-content-stretch landscape:grid-rows-6 landscape:grid-cols-[repeat(24,_minmax(0,_1fr))]'>
  //   <div id='current-map' className='block col-start-2 col-span-10 row-span-6 landscape:col-start-14 landscape:col-span-11 landscape:row-start-1 landscape:row-span-6 place-content-stretch'>
  //     <YearMap loc={corvallis} plant={selectedPlant} />
  //     {/* <div id='locations-map' className='flex place-items-center'>
  //       <div>
  //         <Text>Portland</Text>
  //         <YearMap loc={portland} plant={selectedPlant} />
  //       </div>
  //       <div>
  //         <Text>Fairbanks</Text>
  //         <YearMap loc={fairbanks} plant={selectedPlant} />
  //       </div>
  //       <div>
  //         <Text>Oslo</Text>
  //         <YearMap loc={oslo} plant={selectedPlant} />
  //       </div>
  //       <div>
  //         <Text>Atlanta</Text>
  //         <YearMap loc={atlanta} plant={selectedPlant} />
  //       </div>
  //       <div>
  //         <Text>Johannesburg</Text>
  //         <YearMap loc={joburg} plant={selectedPlant} />
  //       </div>
  //       <div>
  //         <Text>Phoenix</Text>
  //         <YearMap loc={phoenix} plant={selectedPlant} />
  //       </div>
  //       <div className='flex-column place-content-stretch'>
  //         <YearMap loc={corvallis} plant={selectedPlant} />
  //         <Text className='align-self-center'>Corvallis</Text>
  //       </div>
  //        <div>
  //         <Text>Coos Bay</Text>
  //         <YearMap loc={coosbay} plant={selectedPlant} />
  //       </div>
  //     </div> */}
  //   </div>
  //   {/* <button id='tools-toggle' className='content-center justify-center col-start-1 col-span-2 row-start-6 row-span-1 landscape:row-start-3' onClick={() => handleDrawerToggle('tools')}>
  //     <span>{openDrawer === 'tools' ? 'Close Tools' : 'Open Tools'}</span>
  //   </button>
  //   <button id='plants-toggle' className='content-center justify-center col-start-11 col-span-2 row-start-6 row-span-1 landscape:col-start-1 landscape:row-start-4' onClick={() => handleDrawerToggle('plants')}>
  //     <span>{openDrawer === 'plants' ? 'Close Plants' : 'Open Plants'}</span>
  //   </button>
  //   {openDrawer === 'tools' ? <div id='tools' className={`p-4 content-center justify-center col-start-2 col-span-10 row-start-7 row-span-6 border border-solid border-sky-500 landscape:col-start-3 landscape:row-start-1`}>
  //     <span>Tools coming soon!</span>
  //   </div> : null} */}
  //   <div id='plants' className="flex justify-content-center col-start-3 col-span-8 row-start-8 row-span-5 landscape:col-start-3 landscape:row-start-1">
  //     <div className="flex flex-wrap h-full align-content-center">
  //       { plants.map((plant: any) => {
  //           const plantIsSelected = selectedPlant?.name === plant.name;
  //           if(plant.icon) console.log(plant.icon);
  //           // return <Button
  //           //   title={plant.name}
  //           //   color={plant.name === selectedPlant?.name ? "#00a80b" : "#64748b"} // "#474747"}
  //           //   onPress={() => setSelectedPlant(plant)}
  //           // />
  //           return <div className="flex flex-col align-items-end " style={plantIsSelected ? {border: "1px solid green"}: {border: "none"}}><Pressable key={plant.name} onPress={() => setSelectedPlant(plantIsSelected ? undefined : plant)}>
  //               {plant.icon ? 
  //                 <Image 
  //                   source={{uri: plant.icon}}
  //                   resizeMode="contain"
  //                   style={{ width: 64, height: 64  }} /> : 
  //                 null}
  //               <Text className="text-slate-800 text-lg text-bold text-center">{plant.name}</Text>
  //             </Pressable></div>
  //         })
  //       }
  //     </div>
  //   </div>
  //   {/* {!openDrawer ? <div id='elevations' className={`block p-4 content-center justify-center col-start-2 col-span-10 row-start-7 row-span-6 border border-solid border-sky-500 landscape:col-start-3 landscape:row-start-1`}>
  //     <span>Elevations coming soon!</span>
  //   </div> : null} */}
  // </div>
}