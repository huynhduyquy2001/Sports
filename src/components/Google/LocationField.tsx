import React, { useState, useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { OpenStreetMapProvider, GeoSearchControl } from 'leaflet-geosearch';
import 'leaflet-geosearch/dist/geosearch.css';

// Import images from public directory
const markerIconUrl = '/marker-icon.png';
const markerShadowUrl = '/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIconUrl,
    shadowUrl: markerShadowUrl,
    iconAnchor: [12, 41], // Đặt phần nhọn của icon tại đúng vị trí trên bản đồ
    popupAnchor: [0, -41], // Đặt popup phía trên phần nhọn của icon
});

L.Marker.prototype.options.icon = DefaultIcon;

const containerStyle = {
    width: '100%',
    height: '70vh',
};

interface LocationFieldProps {
    defaultCoordinates: { lat: number; lng: number };
    onLocationChange: (coordinates: { lat: number; lng: number }) => void;
}

const LocationField: React.FC<LocationFieldProps> = ({ defaultCoordinates, onLocationChange }) => {
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const [markerPosition, setMarkerPosition] = useState(defaultCoordinates);
    const [initialPosition] = useState(defaultCoordinates);

    useEffect(() => {
        if (!mapRef.current) {
            mapRef.current = L.map('map').setView([defaultCoordinates.lat, defaultCoordinates.lng], 15);

            const WorldTopoMapLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
                attribution: '&copy; <a href="https://www.opentopomap.org/copyright">OpenWorldTopoMap</a> contributors',
            });
            const satelliteLayer = L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_satellite/{z}/{x}/{y}.jpg', {
                minZoom: 0,
                maxZoom: 20,
                attribution: '&copy; CNES, Distribution Airbus DS, © Airbus DS, © PlanetObserver (Contains Copernicus Data) | &copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            });
            const streetLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            });

            const baseLayers = {
                "Street": streetLayer,
                "WorldTopoMap": WorldTopoMapLayer,
                "Satellite": satelliteLayer,
            };

            streetLayer.addTo(mapRef.current); // Add default layer

            L.control.layers(baseLayers).addTo(mapRef.current);

            markerRef.current = L.marker([defaultCoordinates.lat, defaultCoordinates.lng], {
                draggable: true,
            }).addTo(mapRef.current);

            markerRef.current.on('dragend', function (e) {
                const { lat, lng } = e.target.getLatLng();
                const newPosition = { lat, lng };
                if (newPosition.lat !== markerPosition.lat || newPosition.lng !== markerPosition.lng) {
                    setMarkerPosition(newPosition);
                    onLocationChange(newPosition);
                }
            });

            mapRef.current.on('click', function (e: L.LeafletMouseEvent) {
                const { lat, lng } = e.latlng;
                const newPosition = { lat, lng };
                if (newPosition.lat !== markerPosition.lat || newPosition.lng !== markerPosition.lng) {
                    markerRef.current?.setLatLng(newPosition);
                    setMarkerPosition(newPosition);
                    onLocationChange(newPosition);
                }
            });

            const provider = new OpenStreetMapProvider({
                params: {
                    countrycodes: 'VN', // Giới hạn tìm kiếm trong Việt Nam
                    'accept-language': 'vi', // Ưu tiên kết quả tìm kiếm bằng tiếng Việt
                },
            });

            const searchControl = GeoSearchControl({
                provider: provider,
                style: 'bar',
                showMarker: false,
                retainZoomLevel: true,
                autoClose: true,
                searchLabel: 'Enter address',
            });

            mapRef.current.addControl(searchControl);

            mapRef.current.on('geosearch/showlocation', function (event: any) {
                const { lat, lng } = event.location;
                const newPosition = { lat, lng };
                if (newPosition.lat !== markerPosition.lat || newPosition.lng !== markerPosition.lng) {
                    markerRef.current?.setLatLng(newPosition);
                    mapRef.current?.setView(newPosition, 15);
                    setMarkerPosition(newPosition);
                    onLocationChange(newPosition);
                }
            });

        } else {
            mapRef.current.setView([defaultCoordinates.lat, defaultCoordinates.lng], 15);
            markerRef.current?.setLatLng([defaultCoordinates.lat, defaultCoordinates.lng]);
        }
    }, [defaultCoordinates, onLocationChange]);

    const handleLocate = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newPosition = { lat: latitude, lng: longitude };
                    if (newPosition.lat !== markerPosition.lat || newPosition.lng !== markerPosition.lng) {
                        mapRef.current?.setView(newPosition, 15);
                        markerRef.current?.setLatLng(newPosition);
                        setMarkerPosition(newPosition);
                        onLocationChange(newPosition);
                    }
                },
                (error) => {
                    console.error('Error getting location', error);
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            alert('Location access denied. Please enable location services in your browser settings.');
                            break;
                        case error.POSITION_UNAVAILABLE:
                            alert('Location information is unavailable. Please try again.');
                            break;
                        case error.TIMEOUT:
                            alert('The request to get your location timed out. Please try again.');
                            break;
                        default:
                            alert('An unknown error occurred. Please try again.');
                            break;
                    }
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
            alert('Geolocation is not supported by this browser.');
        }
    };


    const handleReset = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        if (initialPosition.lat !== markerPosition.lat || initialPosition.lng !== markerPosition.lng) {
            mapRef.current?.setView(initialPosition, 15);
            markerRef.current?.setLatLng(initialPosition);
            setMarkerPosition(initialPosition);
            onLocationChange(initialPosition);
        }
    };

    return (
        <div>
            <div id="map" style={containerStyle}></div>
            <div style={{ marginTop: '10px' }}>
                <button onClick={handleLocate}>Current position</button>
                <button onClick={handleReset}>Return to the saved location</button>
            </div>
        </div>
    );
};

export default LocationField;



// import React, { useState, useEffect } from 'react';
// import MyGoogleMap from './MyGoogleMap';

// const LocationField = ({ onLocationChange, defaultCoordinates }) => {
//     const [coordinates, setCoordinates] = useState(defaultCoordinates);

//     useEffect(() => {
//         if (!coordinates.lat || !coordinates.lng) {
//             if (navigator.geolocation) {
//                 navigator.geolocation.getCurrentPosition(
//                     (position) => {
//                         const { latitude, longitude } = position.coords;
//                         const currentPosition = { lat: latitude, lng: longitude };
//                         setCoordinates(currentPosition);
//                         onLocationChange(currentPosition); // Pass the coordinates to the parent component
//                     },
//                     (error) => {
//                         console.error("Error getting the current position: ", error);
//                     }
//                 );
//             } else {
//                 console.error("Geolocation is not supported by this browser.");
//             }
//         }
//     }, [coordinates, onLocationChange]);

//     const handleLocationSelect = (newCoordinates) => {
//         setCoordinates(newCoordinates);
//         onLocationChange(newCoordinates); // Pass the coordinates to the parent component
//     };

//     return (
//         <div>
//             <label htmlFor="address">Address</label>
//             <MyGoogleMap
//                 apiKey={process.env.REACT_APP_GOOGLE_MAP_API_KEY}
//                 onLocationSelect={handleLocationSelect}
//                 defaultCoordinates={coordinates}
//             />
//             <div>
//                 <strong>Selected Coordinates:</strong> {coordinates.lat}, {coordinates.lng}
//             </div>
//         </div>
//     );
// };

// export default LocationField;
