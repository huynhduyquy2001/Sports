import React from 'react';
import { useField } from 'payload/components/forms';
import LocationField from './LocationField';

const ParentComponent: React.FC = () => {
    const { value: locationLatitude, setValue: setLocationLatitude } = useField({ path: 'locationLatitude' });
    const { value: locationLongitude, setValue: setLocationLongitude } = useField({ path: 'locationLongitude' });

    const handleLocationChange = (newCoordinates: { lat: number; lng: number }) => {
        setLocationLatitude(newCoordinates.lat);
        setLocationLongitude(newCoordinates.lng);
    };

    const defaultCoordinates = {
        lat: typeof locationLatitude === 'number' ? locationLatitude : 10.762622,
        lng: typeof locationLongitude === 'number' ? locationLongitude : 106.660172,
    };

    return (
        <div>
            <LocationField
                onLocationChange={handleLocationChange}
                defaultCoordinates={defaultCoordinates}
            />
        </div>
    );
};
export default ParentComponent;







// import React from 'react';
// import { useField } from 'payload/components/forms';
// import LocationField from './LocationField';

// const ParentComponent = () => {
//     const { value: locationLatitude, setValue: setLocationLatitude } = useField({ path: 'locationLatitude' });
//     const { value: locationLongitude, setValue: setLocationLongitude } = useField({ path: 'locationLongitude' });

//     const handleLocationChange = (newCoordinates) => {
//         setLocationLatitude(newCoordinates.lat);
//         setLocationLongitude(newCoordinates.lng);
//     };

//     const defaultCoordinates = {
//         lat: locationLatitude !== undefined && locationLatitude !== null ? locationLatitude : 10.762622,
//         lng: locationLongitude !== undefined && locationLongitude !== null ? locationLongitude : 106.660172,
//     };

//     return (
//         <div>
//             <LocationField
//                 onLocationChange={handleLocationChange}
//                 defaultCoordinates={defaultCoordinates}
//             />
//         </div>
//     );
// };

// export default ParentComponent;
