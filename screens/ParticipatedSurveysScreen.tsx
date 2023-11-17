import { useEffect, useState } from "react";

import ParticipatedSurveyItems from "../components/mypage/ParticipatedSurveyItems";
import { useCustomContext } from "../features/context/CustomContext";

function ParticipatedSurveysScreen() {
    const { userId } = useCustomContext();

    return <ParticipatedSurveyItems userId={userId} />;
}

export default ParticipatedSurveysScreen;
