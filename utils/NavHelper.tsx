import { PostingSurveyState } from "../interfaces/PostingSurveyState";
import { SurveyProps } from "../interfaces/Survey";

export type RootStackParamList = {
    // mains
    MainTabs: undefined;
    Home: undefined;
    MyPage: undefined;

    // auth
    Login: undefined;
    FindID: undefined;
    FoundID: { username: string };
    FindPassword: undefined;
    SettingPassword: { username: string; shouldPopAll: boolean };
    SignUp: undefined;

    // posting
    Posting: { postingSurveyState: PostingSurveyState | undefined };
    Targetting: SurveyProps;

    // participating
    Participate: { sectionId: number; surveyId: number };
    OneParticipate: { surveyId: number };
    EndParticipation: undefined;

    // mypage
    ParticipatedSurveys: undefined;
    PostedSurveys: undefined;
    Setting: undefined;
    MyInfo: undefined;
    Response: { surveyId: number };
    MyGenre: undefined;
    PointHistory: undefined;
};

export enum NavigationTitle {
    // mains
    mainTabs = "MainTabs",
    home = "Home",
    mypage = "MyPage",

    // auth
    login = "Login",
    findID = "FindID",
    foundID = "FoundID",
    findPassword = "FindPassword",
    settingPassword = "SettingPassword",
    signup = "SignUp",

    // posting
    posting = "Posting",
    targetting = "Targetting",

    // participating
    participate = "Participate",
    endParticipation = "EndParticipation",
    oneParticipate = "OneParticipate",

    // mypage
    participatedSurveys = "ParticipatedSurveys",
    postedSurveys = "PostedSurveys",
    setting = "Setting",
    myinfo = "MyInfo",
    response = "Response",
    myGenre = "MyGenre",
    pointHistory = "PointHistory",
}
