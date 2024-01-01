export const convertToMin = (expectedTimeInSec: number) => {
    return Math.ceil(expectedTimeInSec / 60.0);
};

export const convertReward = (reward: number): string | null => {
    if (reward === 0) {
        // return "무료";
        return null;
    } else {
        return `${reward} 원`;
    }
};
