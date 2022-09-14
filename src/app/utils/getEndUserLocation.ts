import React from "react";
import { useGeolocated } from "react-geolocated";
import { distanceTo } from "geolocation-utils";

interface ILocation {
  lat: number;
  lng: number;
}

const useDistanceFromStation = (stationLocation: ILocation) => {
  const { coords, isGeolocationAvailable } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });

  const distance = distanceTo(
    {
      lat: coords?.latitude || 0,
      lon: coords?.longitude || 0,
    },
    {
      lat: stationLocation.lat,
      lon: stationLocation.lng,
    }
  );

  return !isGeolocationAvailable ? undefined : distance;
};

export default useDistanceFromStation;
