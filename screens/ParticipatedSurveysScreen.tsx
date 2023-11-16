import { useEffect, useState } from "react";
import { loadUserState } from "../utils/Storage";

import ParticipatedSurveyItems from "../components/mypage/ParticipatedSurveyItems";

function ParticipatedSurveysScreen() {
    const [userId, setUserId] = useState<number>(null);

    useEffect(() => {
        const getUserId = async () => {
            const userId = await loadUserState();
            setUserId(userId.userId);
        };

        getUserId();
    }, [userId]);

    return <ParticipatedSurveyItems userId={userId} />;
}

export default ParticipatedSurveysScreen;
