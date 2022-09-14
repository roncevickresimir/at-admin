import { distanceTo } from "geolocation-utils";
import { t } from "i18next";
import React, { useCallback, useEffect, useState } from "react";
import { useGeolocated } from "react-geolocated";
import useDistanceFromStation from "../../../app/utils/getEndUserLocation";
import noResults from "../../../assets/images/noResults.svg";
import { getCategoryById } from "../../../lookups/categories";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";

const StationDisplay = (props: any) => {
  const station = props.station;
  const [distance, setDistance] = useState<any>(undefined);

  const getDistance = useDistanceFromStation;

  const { coords, isGeolocationAvailable } = useGeolocated({
    positionOptions: {
      enableHighAccuracy: false,
    },
    userDecisionTimeout: 5000,
  });

  useEffect(() => {
    let s = "";
    let d = distanceTo(
      {
        lat: coords?.latitude || 0,
        lon: coords?.longitude || 0,
      },
      {
        lat: station.location.lat,
        lon: station.location.lng,
      }
    );
    if (d < 1000) {
      d = Math.round(d);
      s = String(d) + "m";
    } else {
      d = Math.round(d / 1000);
      s = String(d) + "km";
    }
    setDistance(s);
  }, []);

  const [center, setCenter] = useState({
    lat: station.location.lat,
    lng: station.location.lng,
  });

  const [markerPosition, setMarkerPosition] = useState<any>({
    lat: station.location.lat,
    lng: station.location.lng,
  });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBJCY8W3xz66y3iJRAQhefYxWHo_TkUO04",
  });

  const [map, setMap] = useState<any>(); // Can't access object properties if <google.maps.Map>

  useEffect(() => {
    setCenter({
      lat: station.location.lat,
      lng: station.location.lng,
    });
    setMarkerPosition({
      lat: station.location.lat,
      lng: station.location.lng,
    });
  }, [station.location]);

  const onLoad = useCallback(function callback(map: any) {
    //const bounds = new window.google.maps.LatLngBounds(center);
    //map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  const updateMarkerPosition = (
    e: any,
    options: google.maps.LatLng | null
  ) => {};

  const updateCenter = () => {
    setCenter({
      lat: map?.center.lat(),
      lng: map?.center.lng(),
    });
  };

  return (
    <div className="flex flex--col w--400 card--secondary pos--rel overflow--hidden">
      <img
        className="image__profile image__profile--md w--100"
        src={`${
          station.images?.length
            ? "http://" + station.images[0]?.filePath
            : noResults
        }`}
        alt="stationImage"
      />
      <div className="flex flex--wrap pl-4 pr-4">
        <div className="type--lg w--100 mb-1 mt-4">{station.name}</div>
        <div className="type--color--secondary w--100  mb-4">
          {isGeolocationAvailable
            ? `${distance} ${t("STATIONS.DISPLAY.DISTANCE")}`
            : "location unavailable"}
        </div>
        <div className="type--color--brand w--100 mb-4">
          {station.categories.map((id: any) => (
            <div key={id} className="tag--primary d--ib ml-2">
              {`${getCategoryById(id)?.label}`}
            </div>
          ))}
        </div>
        <div className="type--md w--100">{station.description}</div>
      </div>
      <div className="type--color--brand w--100 mt-8 map">
        <GoogleMap
          mapContainerStyle={{
            width: "100%",
            height: "200px",
          }}
          center={center}
          zoom={12}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={(e) => updateMarkerPosition(e, e.latLng)}
          onDragEnd={updateCenter}
          options={{
            disableDefaultUI: true,
          }}
        >
          <Marker position={markerPosition} draggable />
        </GoogleMap>
      </div>
    </div>
  );
};

export default StationDisplay;
