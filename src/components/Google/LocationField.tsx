import React, { useState } from 'react';
import MyGoogleMap from './MyGoogleMap';

const LocationField = () => {
    const [address, setAddress] = useState('');
    const [coordinates, setCoordinates] = useState({ lat: 10.762622, lng: 106.660172 });

    const handleLocationSelect = (newCoordinates) => {
        setCoordinates(newCoordinates);
    };

    return (
        <div>
            <label htmlFor="address">Address</label>
            <input
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
            <MyGoogleMap
                apiKey='AIzaSyA9sBBVDt7s4y2AhNxUF7V_qLaIlt5FtEE'
                onLocationSelect={handleLocationSelect}
            />
            <div>
                <strong>Selected Coordinates:</strong> {coordinates.lat}, {coordinates.lng}
            </div>
        </div>
    );
};

export default LocationField;
