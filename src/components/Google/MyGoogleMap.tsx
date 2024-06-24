import React, { useState, useCallback, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '450px'
};

const defaultCenter = {
    lat: 10.762622,
    lng: 106.660172 // Tọa độ trung tâm mặc định (TP.HCM)
};

const MyGoogleMap = ({ apiKey, onLocationSelect }) => {
    const [center, setCenter] = useState(defaultCenter);
    const [markerPosition, setMarkerPosition] = useState(defaultCenter);

    // Function to get the current position
    const getCurrentPosition = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const currentPosition = {
                        lat: latitude,
                        lng: longitude
                    };
                    setCenter(currentPosition);
                    setMarkerPosition(currentPosition);
                },
                (error) => {
                    console.error("Error getting the current position: ", error);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    };

    useEffect(() => {
        getCurrentPosition();
    }, []);

    const onMapClick = useCallback((event) => {
        const { latLng } = event;
        const newPosition = {
            lat: latLng.lat(),
            lng: latLng.lng()
        };
        setMarkerPosition(newPosition);
        onLocationSelect(newPosition);
    }, [onLocationSelect]);

    return (
        <LoadScript googleMapsApiKey={apiKey}>
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={15}
                onClick={onMapClick}
            >
                <Marker position={markerPosition} />
            </GoogleMap>
        </LoadScript>
    );
};

export default MyGoogleMap;
