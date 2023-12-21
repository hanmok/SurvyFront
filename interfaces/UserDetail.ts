import { GeoInfo } from "./GeoInfo";
import { Occupation } from "./Occupation";
/** age, birthDate, isMale, homeAddress, officeAddress */
export interface UserDetail {
    collectedReward: number;
    birthDate: string | null;
    age: number | null;
    isMale: number | null;
    reputation: number;
    fatigue: number;
    homeAddress: GeoInfo | null;
    officeAddress: GeoInfo | null;
    occupation: Occupation | null;
}
