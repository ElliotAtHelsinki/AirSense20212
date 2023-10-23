import React from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ['places'];

function UseInitGGMap() {
    const {isLoaded} = useJsApiLoader({
        id: 'google-map-script',
        libraries,
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    })
    return {isLoaded};
}

export default UseInitGGMap;