import { GeoInfo } from "../../interfaces/GeoInfo";
import { API_BASE_URL } from "../API";
import BaseApi from "../BaseAPI";

export class GeoService extends BaseApi {
    async fetchAllGeoInfos(): Promise<ApiResponse<GeoInfo[]>> {
        const url = `${API_BASE_URL}/geo`;
        return this.fetchData<GeoInfo[]>(url, "GET");
    }
}
