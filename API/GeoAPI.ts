// let currentLocation = await Location.getCurrentPositionAsync({});
// logObject("current location: ", currentLocation);
// // setLocation(currentLocation)
// const longitude = currentLocation.coords.longitude
// const latitude = currentLocation.coords.latitude
// const url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${longitude}&y=${latitude}&input_coord=WGS84`
// const restKEY = "5973832cf035c04ef3cd75c15c90c7cc"
// // GET
// // Header Authorization: KakaoAK restKey

import { GeoInfo } from "../interfaces/GeoInfo";
import { logObject } from "../utils/Log";
import { API_BASE_URL } from "./API";

// // Content-type: application/json;charset=UTF-8
const restKEY = "5973832cf035c04ef3cd75c15c90c7cc";
export async function getAddress(
    lon: number,
    lat: number
): Promise<ApiResponse> {
    const url = `https://dapi.kakao.com/v2/local/geo/coord2address.json?x=${lon}&y=${lat}&input_coord=WGS84`;
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `KakaoAK ${restKEY}`,
            },
        });
        if (!response.ok) {
            console.log(`GEOAPI error!`);
            throw new Error("GEO API error");
        }

        // const responseData: ApiResponse = await response.json();
        const geoData: GeoResponse = await response.json();
        const big = geoData.documents[0].address.region_1depth_name;
        const small = geoData.documents[0].address.region_2depth_name;
        console.log(`big: ${big}, small: ${small}`);
        // logObject("geo object: ", responseData);

        // const sth = responseData.documents.address.region_1depth_name // 경기
        // const sth = responseData.documents.address.region_2depth_name // 군포시

        const apiResponse: ApiResponse = {
            statusCode: 200,
            message: "success",
            data: { big, small },
        };
        logObject(`geo response:`, apiResponse);
        return apiResponse;
    } catch (error) {
        console.error(`Getting GEO error`, error);
        throw error;
    }
}

interface GeoResponse {
    meta: {
        total_count: number;
    };
    documents: {
        address: {
            region_1depth_name: string;
            region_2depth_name: string;
        };
    }[];
}

// const printLocation = () => {
//     console.log("hi");
//     Geolocation.getCurrentPosition(position => {
//         const currentLongiture = position.coords.longitude;
//         const latitude = position.coords.latitude;
//         console.log("current longitude: " + currentLongiture);
//         console.log("current latitude: " + latitude);
//     });
// };

export async function fetchAllGeoInfos(): Promise<GeoInfo[]> {
    const url = `${API_BASE_URL}/geo`;

    try {
        const response = await fetch(url, {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const responseData: GeoInfo[] = await response.json();

        // logObject("geo response jsona", responseData);
        return responseData;
    } catch (error) {
        console.error("geo fetching error", error);
        throw error;
    }
}
