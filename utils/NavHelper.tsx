import { PostingSurveyState } from "../interfaces/PostingSurveyState";
import { SurveyProps } from "../interfaces/Survey";

export type RootStackParamList = {
    Home: undefined;
    Participate: { sectionId: number; surveyId: number };
    // Posting: { postingSurveyId: number | undefined };
    Posting: { postingSurveyState: PostingSurveyState | undefined };
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
    PostingBase: undefined;
    FindID: undefined;
    FoundID: { username: string };
    FindPassword: undefined;
    SettingPassword: { username: string; shouldPopAll: boolean };
    SignUp: undefined;
    MyGenre: undefined;
    PointHistory: undefined;
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
    postingBase = "PostingBase",
    findID = "FindID",
    foundID = "FoundID",
    findPassword = "FindPassword",
    settingPassword = "SettingPassword",
    signup = "SignUp",
    myGenre = "MyGenre",
    pointHistory = "PointHistory",
}
