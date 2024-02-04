import React from 'react';
import { Source, Layer } from 'react-map-gl';

const PetrolPumpLayer = ({ data,color }) => {
  return (
    <Source type="geojson" data={data}>
      <Layer
        id="petrolPumpLayer"
        type="circle"
        paint={{
          "circle-radius": 10,
          "circle-color": color,
          "circle-stroke-color": "#00000a",
          "circle-stroke-width": 2,
        }}
      />
    </Source>
  );
};

const ChargingPointsLayer = ({ data, color }) => {
  return (
    <Source type="geojson" data={data}>
      <Layer
        id="chargingPointsLayer"
        type="circle"
        paint={{
          'circle-radius': 20,
          'circle-color': color,
          'circle-stroke-color': '#00000a',
          'circle-stroke-width': 2,
        }}
      />
    </Source>
  );
};

const ResourcePointsLayer = ({ data, color }) => {
  return (
    <Source type="geojson" data={data}>
      <Layer
        id="chargingPointsLayer"
        type="circle"
        paint={{
          'circle-radius': 20,
          'circle-color': color,
          'circle-stroke-color': '#00000a',
          'circle-stroke-width': 2,
        }}
      />
    </Source>
  );
};

export  {PetrolPumpLayer,ChargingPointsLayer,ResourcePointsLayer};
