import React, { useState, useCallback, memo, useEffect } from "react";
import { FieldProps, useField } from "formik";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { ILocation } from "../../../interfaces/IStation";

const MyLocationInput = ({ form, field }: FieldProps) => {
  const [formikField] = useField(form.getFieldProps(field.name));

  const [center, setCenter] = useState({
    lat: formikField.value.lat,
    lng: formikField.value.lng,
  });

  const [markerPosition, setMarkerPosition] = useState<any>({
    lat: formikField.value.lat,
    lng: formikField.value.lng,
  });

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: "AIzaSyBJCY8W3xz66y3iJRAQhefYxWHo_TkUO04",
  });

  const [map, setMap] = useState<any>(); // Can't access object properties if <google.maps.Map>

  useEffect(() => {
    setCenter({
      lat: formikField.value.lat,
      lng: formikField.value.lng,
    });
    setMarkerPosition({
      lat: formikField.value.lat,
      lng: formikField.value.lng,
    });
  }, [formikField.value]);

  const onLoad = useCallback(function callback(map: any) {
    //const bounds = new window.google.maps.LatLngBounds(center);
    //map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback(function callback(map: any) {
    setMap(null);
  }, []);

  const updateMarkerPosition = (e: any, options: google.maps.LatLng | null) => {
    form.setFieldValue(field.name, {
      lat: options?.lat(),
      lng: options?.lng(),
    });
    setMarkerPosition({
      lat: options?.lat(),
      lng: options?.lng(),
    });
  };

  const updateCenter = () => {
    setCenter({
      lat: map?.center.lat(),
      lng: map?.center.lng(),
    });
  };

  return isLoaded ? (
    <>
      <GoogleMap
        mapContainerStyle={{
          width: "100%",
          height: "400px",
        }}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        onClick={(e) => updateMarkerPosition(e, e.latLng)}
        onDragEnd={updateCenter}
      >
        <Marker position={markerPosition} draggable />
      </GoogleMap>

      {<div className="field__validation"></div>}
    </>
  ) : (
    <></>
  );
};

export default memo(MyLocationInput);
