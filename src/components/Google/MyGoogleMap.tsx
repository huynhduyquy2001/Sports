import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '450px',
};
const defaultCenter = {
    lat: 10.762622,
    lng: 106.660172 // Tọa độ trung tâm mặc định (TP.HCM)
};
const MyGoogleMap = ({ apiKey, onLocationSelect, defaultCoordinates }) => {
    const [markerPosition, setMarkerPosition] = useState(defaultCoordinates);
    const [initialCenter, setInitialCenter] = useState(defaultCoordinates);

    useEffect(() => {
        setMarkerPosition(defaultCoordinates);
        //setInitialCenter(defaultCoordinates);
    }, [defaultCoordinates]);

    const onMapClick = useCallback((event) => {
        const { latLng } = event;
        const newPosition = {
            lat: latLng.lat(),
            lng: latLng.lng(),
        };
        setMarkerPosition(newPosition);
        onLocationSelect(newPosition);
    }, [onLocationSelect]);

    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={initialCenter}  // Chỉ đặt center một lần
                zoom={15}
                onClick={onMapClick}
            >
                <Marker position={markerPosition} />
            </GoogleMap>
        </LoadScript>
    );
};

export default MyGoogleMap;
