import AsyncStorage from "@react-native-async-storage/async-storage";
import Storage from "react-native-storage";
import { UserState } from "../interfaces/UserState";
import { GeoInfo } from "../interfaces/GeoInfo";
import { logObject } from "./Log";

class UserDataManager {
	private storage: Storage;

	constructor() {
		this.storage = new Storage({
			storageBackend: AsyncStorage,
		});
	}

	public async saveUserState(data: UserState) {
		logObject("savedUserState", data);
		await this.storage.save({ key: "userInfo", data, expires: null });
	}

	public async loadUserState(): Promise<UserState> {
		try {
			const userState: UserState = await this.storage.load({
				key: "userInfo",
				autoSync: true,
				syncInBackground: true,
			});
			logObject("loadedUserState", userState);

			return userState;
		} catch (error) {
			console.error(error);
			return null;
		}
	}
}

class GeoDataManager {
	private storage: Storage;

	constructor() {
		this.storage = new Storage({
			storageBackend: AsyncStorage,
		});
	}

	public async saveWholeGeos(data: GeoInfo[]) {
		// logObject("saving geo data", data);
		await this.storage.save({ key: "wholeGeoInfo", data, expires: null });
	}

	public async loadWholeGeo(): Promise<GeoInfo[]> {
		console.log("loadWholeGeo called");
		try {
			const geoInfo: GeoInfo[] = await this.storage.load({
				key: "wholeGeoInfo",
				autoSync: true,
				syncInBackground: true,
			});

			return geoInfo;
		} catch (error) {
			console.error("Error loading geo info:", error);
			return null;
		}
	}
}

export const userDataManager = new UserDataManager();
export const geoDataManager = new GeoDataManager();
