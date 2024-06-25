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

            const LocateControl = L.Control.extend({
                onAdd: function () {
                    const button = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom');
                    button.innerHTML = 'Current position';
                    button.style.backgroundColor = 'white';
                    button.style.width = 'auto';
                    button.style.height = 'auto';
                    button.style.padding = '5px';
                    button.onclick = function (e) {
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
                                }
                            );
                        } else {
                            console.error('Geolocation is not supported by this browser.');
                        }
                    };
                    return button;
                },
            });

            const ResetPositionControl = L.Control.extend({
                onAdd: function () {
                    const button = L.DomUtil.create('button', 'leaflet-bar leaflet-control leaflet-control-custom');
                    button.innerHTML = 'Return to the saved location';
                    button.style.backgroundColor = 'white';
                    button.style.width = 'auto';
                    button.style.height = 'auto';
                    button.style.padding = '5px';
                    button.style.zIndex = '100';
                    button.onclick = function (e) {
                        e.preventDefault();
                        if (initialPosition.lat !== markerPosition.lat || initialPosition.lng !== markerPosition.lng) {
                            mapRef.current?.setView(initialPosition, 15);
                            markerRef.current?.setLatLng(initialPosition);
                            setMarkerPosition(initialPosition);
                            onLocationChange(initialPosition);
                        }
                    };
                    return button;
                },
            });

            mapRef.current.addControl(new LocateControl({ position: 'topleft' }));
            mapRef.current.addControl(new ResetPositionControl({ position: 'topleft' }));
        } else {
            mapRef.current.setView([defaultCoordinates.lat, defaultCoordinates.lng], 15);
            markerRef.current?.setLatLng([defaultCoordinates.lat, defaultCoordinates.lng]);
        }
    }, [defaultCoordinates, onLocationChange]);

    return <div id="map" style={containerStyle}></div>;
};

export default LocationField;
