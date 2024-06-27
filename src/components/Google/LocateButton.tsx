import React, { useState } from 'react';

interface LocateButtonProps {
    map: L.Map | null;
    marker: L.Marker | null;
    onLocationChange: (coordinates: { lat: number; lng: number }) => void;
}

const LocateButton: React.FC<LocateButtonProps> = ({ map, marker, onLocationChange }) => {
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleLocate = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newPosition = { lat: latitude, lng: longitude };
                    if (map && marker) {
                        map.setView(newPosition, 15);
                        marker.setLatLng(newPosition);
                        onLocationChange(newPosition);
                        setErrorMessage(null); // Clear error message
                    }
                },
                (error) => {
                    console.error('Error getting location', error);
                    if (error.code === error.PERMISSION_DENIED) {
                        setErrorMessage('Location access denied. Please enable location services.');
                    } else {
                        setErrorMessage('Error getting location. Please try again.');
                    }
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            setErrorMessage('Geolocation is not supported by this browser.');
        }
    };

    return (
        <div>
            <button onClick={handleLocate}>Current position</button>
            {errorMessage && <p style={{ color: 'red' }}>{errorMessage}</p>}
        </div>
    );
};

export default LocateButton;
