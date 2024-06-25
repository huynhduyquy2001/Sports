import React, { useEffect, useRef } from 'react';
import L, { Map as LeafletMap, Marker as LeafletMarker } from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapFieldProps {
    path: string;
    label: string;
    value: { lat: number; lng: number } | null;
    onChange: (value: { path: string; value: { lat: number; lng: number } }) => void;
}

const MapField: React.FC<MapFieldProps> = ({ path, label, value, onChange }) => {
    const mapRef = useRef<LeafletMap | null>(null);
    const markerRef = useRef<LeafletMarker | null>(null);

    useEffect(() => {
        if (!mapRef.current) {
            // Use Geolocation to get current position
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;

                    mapRef.current = L.map('map').setView([latitude, longitude], 13);

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(mapRef.current);

                    markerRef.current = L.marker([latitude, longitude], {
                        draggable: true
                    }).addTo(mapRef.current);

                    markerRef.current.on('dragend', function (e) {
                        const { lat, lng } = e.target.getLatLng();
                        onChange({ path, value: { lat, lng } });
                    });

                    if (value) {
                        const { lat, lng } = value;
                        markerRef.current.setLatLng([lat, lng]);
                        mapRef.current.setView([lat, lng], 13);
                    } else {
                        onChange({ path, value: { lat: latitude, lng: longitude } });
                    }
                },
                (error) => {
                    console.error('Geolocation error:', error);
                    // Fallback to default location if geolocation fails
                    const defaultLat = 51.505;
                    const defaultLng = -0.09;
                    mapRef.current = L.map('map').setView([defaultLat, defaultLng], 13);

                    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    }).addTo(mapRef.current);

                    markerRef.current = L.marker([defaultLat, defaultLng], {
                        draggable: true
                    }).addTo(mapRef.current);

                    markerRef.current.on('dragend', function (e) {
                        const { lat, lng } = e.target.getLatLng();
                        onChange({ path, value: { lat, lng } });
                    });

                    if (value) {
                        const { lat, lng } = value;
                        markerRef.current.setLatLng([lat, lng]);
                        mapRef.current.setView([lat, lng], 13);
                    } else {
                        onChange({ path, value: { lat: defaultLat, lng: defaultLng } });
                    }
                }
            );
        }
    }, [value, onChange, path]);

    return (
        <div>
            <label htmlFor={path}>{label}</label>
            <div id="map" style={{ height: '500px' }}></div>
        </div>
    );
};

export default MapField;
