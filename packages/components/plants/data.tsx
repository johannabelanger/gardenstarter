export type LightRequirement = {
  minimum: number,
  ideal: number,
}
export type TemperatureRequirement = {
  minimum: number,
  maximum: number,
}
export type Plant = {
  name: string,
  icon?: string,
  light: LightRequirement,
  temp: TemperatureRequirement,
}

// show tomato potential
// if(lightData.hoursOfLight > 8 && averageTemp > 12 && averageTemp < 30){
//   hue = 0;
//   // if(lightData.hoursOfLight < 8){
//   //   saturation = 30;
//   // }
// }

// "https://cdn-icons-png.flaticon.com/128/1790/1790387.png",
const tomato: Plant = {
  name: "Tomato",
  icon: "https://cdn-icons-png.flaticon.com/128/4056/4056876.png", 
  light: {
    minimum: 6,
    ideal: 8
  },
  temp: {
    minimum: 12,
    maximum: 30,
  },
}

// show peppers potential
// if(lightData.hoursOfLight > 6 && averageTemp > 21 && averageTemp < 29){
//   hue = 0;
//   // if(lightData.hoursOfLight < 8){
//   //   saturation = 30;
//   // }
// }

// "https://cdn-icons-png.flaticon.com/128/2909/2909814.png",
const pepper: Plant = {
  name: "Pepper",
  icon: "https://cdn-icons-png.flaticon.com/128/2149/2149892.png", 
  light: {
    minimum: 6,
    ideal: 8,
  },
  temp: {
    minimum: 15,
    maximum: 24,
  },
}

// show swiss chard potential
// if(lightData.hoursOfLight > 3 && averageTemp > 10 && averageTemp < 24){
//   hue = 0;
//   // if(lightData.hoursOfLight < 8){
//   //   saturation = 30;
//   // }
// }

// "https://cdn-icons-png.flaticon.com/128/4056/4056889.png",
const chard: Plant = {
  name: "Chard",
  icon: "https://cdn-icons-png.flaticon.com/128/4056/4056910.png",
  light: {
    minimum: 3,
    ideal: 8
  },
  temp: {
    minimum: 10,
    maximum: 24,
  },
}

// show lettuce potential
// if(lightData.hoursOfLight > 3 && averageTemp > 7 && averageTemp < 21){
//   hue = 0;
//   // if(lightData.hoursOfLight < 8){
//   //   saturation = 30;
//   // }
// }

// "https://cdn-icons-png.flaticon.com/128/5080/5080863.png",
const lettuce: Plant = {
  name: "Lettuce",
  icon: "https://cdn-icons-png.flaticon.com/128/1514/1514951.png",
  light: {
    minimum: 3,
    ideal: 8
  },
  temp: {
    minimum: 7,
    maximum: 21,
  },
}

// "https://cdn-icons-png.flaticon.com/128/7315/7315544.png",
//show pea potential
const pea: Plant = {
  name: "Pea",
  icon: "https://cdn-icons-png.flaticon.com/128/4056/4056848.png",
  light: {
    minimum: 6,
    ideal: 8
  },
  temp: {
    minimum: 10,
    maximum: 24,
  },
}

//show beet potential
// https://cdn-icons-png.flaticon.com/128/2482/2482120.png",
const beet: Plant = {
  name: "Beet",
  icon: "https://cdn-icons-png.flaticon.com/128/2149/2149863.png", 
  light: {
    minimum: 6,
    ideal: 8
  },
  temp: {
    minimum: 10,
    maximum: 38,
  },
}

export const plants: Plant[] = [tomato, pepper, chard, pea, lettuce, beet];