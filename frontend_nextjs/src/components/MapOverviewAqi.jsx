import { useMemo } from 'react';
import { GoogleMap, OverlayView } from '@react-google-maps/api';
import AQI from '../models/AQI';
import { aqiToColor } from '../utils/constant';
import useInitGGMap from '../hooks/useInitGGMap';
import { useQuery } from 'react-query';

export const MapOverviewAqi = ({ height, dataPoints = [], ...props }) => {
    const containerStyle = useMemo(
        () => ({
            width: '100%',
            height: height,
        }),
        []
    );

    const { isLoaded } = useInitGGMap();
    // const { data: dataPoints } = useQuery(
    //     'getOverViewMapData',
    //     async () => {
    //         const data = await AQI.daily({
    //             date: new Date().getDate(),
    //             month: new Date().getMonth() + 1,
    //             year: new Date().getFullYear(),
    //         });
    //         return data.map((item) => ({
    //             aqi: item.AQIGeneral,
    //             position: {
    //                 locationName: item?.location?.location_name,
    //                 lat: item?.location?.latitude,
    //                 lng: item?.location?.longitude,
    //             },
    //         }));
    //     },
    //     {}
    // );

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={dataPoints[0]?.position}
            zoom={15}
            options={{
                minZoom: 3,
                maxZoom: 20,
            }}
        >
            {dataPoints?.map(({ position, aqi }, index) => (
                <OverlayView
                    key={index}
                    position={position}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                    <div className='relative '>
                        <div className='absolute w-full h-full flex items-center justify-center text-white text-base pb-1'>
                            {aqi}
                        </div>
                        <i
                            className='fas fa-message-middle'
                            style={{ color: aqiToColor(aqi) , fontSize:40 }}
                        />
                    </div>
                </OverlayView>
            ))}
        </GoogleMap>
    ) : (
        <></>
    );
};
