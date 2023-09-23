// import { NavigationTitle } from "./utils/NavigationTitle";
// import { NavigationTitle } from "./utils/NavigationTitle";

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
}
