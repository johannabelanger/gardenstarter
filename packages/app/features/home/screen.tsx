
import { A, H1, P, Text, TextLink } from 'app/design/typography'
import { Row } from 'app/design/layout'
import { View } from 'app/design/view'

import { MotiLink } from 'solito/moti'

import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import SunMap from '../../../components/map';
import {useState, useEffect} from 'react';

export function HomeScreen() {
  // Mom and Dad's 44.59194405984583, -123.25520772742998
const corvallis: {latitude: number, longitude: number} = {latitude: 44.59194405984583, longitude: -123.25520772742998}
// Oslo 59.89564166395883, 10.785743417155842
const oslo: {latitude: number, longitude: number} = {latitude: 59.89564166395883, longitude: 10.785743417155842}
// Johannesberg -26.181043152226504, 28.025551235811378
const joburg: {latitude: number, longitude: number} = {latitude: -26.181043152226504, longitude: 28.025551235811378}
  return (
      <View className="flex-1 items-center justify-center p-3">
        <H1>gardenstarter!</H1>
        <div style={{display: "flex"}}>
          <div>
            <Text>Corvallis</Text>
            <SunMap loc={corvallis} />
          </div>
          <div>
            <Text>Oslo</Text>
            <SunMap loc={oslo} />
          </div>
          <div>
            <Text>Johannesburg</Text>
            <SunMap loc={joburg} />
          </div>
        </div>
      </View>
  )
}
