import React, { useCallback, useEffect, useState } from 'react';
import { Autocomplete, GoogleMap, OverlayView } from '@react-google-maps/api';
import { HANOI_LOCATION } from '../utils/constant';
import { EnvironmentOutlined } from '@ant-design/icons';
import { Popover } from 'antd';
import useInitGGMap from '../hooks/useInitGGMap';

const MapCreateLocation = ({ width, height, marker, setMarker }) => {
    const { isLoaded } = useInitGGMap();

    const [map, setMap] = useState(null);
    const [autoComplete, setAutoComplete] = useState(null);
    // const [marker, setMarker] = useState(HANOI_LOCATION)
    const onLoad = useCallback(
        async (map) => {
            const bounds = new window.google.maps.LatLngBounds(marker.position);
            await map.fitBounds(bounds);
            setMap(map);
        },
        [map]
    );

    useEffect(() => {
        if (map) {
            const bounds = new window.google.maps.LatLngBounds(marker.position);
            map.fitBounds(bounds);
        }
    }, [marker]);

    const onLoadAutoComplete = useCallback((autocomplete) => {
        setAutoComplete(autocomplete);
    }, []);

    const onPlaceChanged = useCallback(() => {
        if (autoComplete !== null) {
            const location = autoComplete.getPlace().geometry.location;
            setMarker && setMarker({
                position: { lat: location.lat(), lng: location.lng() },
                name: autoComplete.getPlace().formatted_address,
            });
        } else {
            // console.log('Autocomplete is not loaded yet!');
        }
    }, [autoComplete]);

    const onUnmount = useCallback(() => {
        setMap(null);
    }, []);

    const onUnmountAutocomplete = useCallback(() => {
        setAutoComplete(null);
    }, []);

    return isLoaded ? (
        <GoogleMap
            mapContainerStyle={{ width, height }}
            center={HANOI_LOCATION.position}
            zoom={10}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
                minZoom: 3,
                maxZoom: 20,
            }}
        >
            <Autocomplete
                onLoad={onLoadAutoComplete}
                onUnmount={onUnmountAutocomplete}
                onPlaceChanged={onPlaceChanged}
            >
                <input
                    type='text'
                    placeholder='Nhập tên địa điểm'
                    style={{
                        boxSizing: `border-box`,
                        border: `1px solid transparent`,
                        width: `50%`,
                        height: `32px`,
                        padding: `0 12px`,
                        borderRadius: `3px`,
                        boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
                        fontSize: `16px`,
                        outline: `none`,
                        textOverflow: `ellipses`,
                        position: 'absolute',
                        left: '35%',
                        top: '5px',
                        marginLeft: '-120px',
                    }}
                />
            </Autocomplete>
            {/* {
                dataPoints.map(({position, aqi}, index) =>
                    <OverlayView key={index} position={position} mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}>
                        <div className='relative'>
                            <div
                                className='absolute w-full h-full flex items-center justify-center text-white pb-1'>{aqi}</div>
                            <i className='fas fa-message-middle text-2xl' style={{color: aqiToColor(aqi)}}/>
                        </div>
                    </OverlayView>
                )
            }*/}
            {map && (
                <OverlayView
                    position={marker.position}
                    mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
                >
                    <div className='flex flex-col gap-2'>
                        <span className='font-bold'>{marker.name}</span>
                        <Popover
                            content={
                                <div className='flex flex-col'>
                                    <span>{marker.name}</span>
                                </div>
                            }
                        >
                            <EnvironmentOutlined
                                style={{ color: 'red', fontSize: '300%' }}
                            />
                        </Popover>
                    </div>
                </OverlayView>
            )}
        </GoogleMap>
    ) : (
        <></>
    );
};

export default MapCreateLocation;