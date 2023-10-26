// import { NavigationTitle } from "./utils/NavigationTitle";
// import { NavigationTitle } from "./utils/NavigationTitle";

import { SurveyProps } from "../interfaces/Survey";

export type RootStackParamList = {
    Home: undefined;
    Participate: { sectionId: number; surveyId: number };
    Posting: undefined;
    MyPage: undefined;
    ParticipatedSurveys: undefined;
    PostedSurveys: undefined;
    Setting: undefined;
    Login: undefined;
    MainTabs: undefined;
    MyInfo: undefined;
    Targetting: SurveyProps;
    Response: { surveyId: number };
    EndParticipation: undefined;
};

export enum NavigationTitle {
    login = "Login",
    posting = "Posting",
    participate = "Participate",
    mainTabs = "MainTabs",
    home = "Home",
    mypage = "MyPage",
    participatedSurveys = "ParticipatedSurveys",
    postedSurveys = "PostedSurveys",
    setting = "Setting",
    myinfo = "MyInfo",
    targetting = "Targetting",
    response = "Response",
    endParticipation = "EndParticipation",
}
