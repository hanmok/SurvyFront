import Toast, { ToastType } from "react-native-toast-message";

const showToast = (
    messageType: ToastType,
    message: string,
    message2?: string
) => {
    Toast.show({
        type: messageType,
        text1: message,
        text2: message2,
    });
};

export default showToast;

// 전에꺼 왜 지금.. ?
// LOG  posting api: {"surveyId":974,"questionId":"457084","selectableOptionId":"469664","answerText":"","userId":804,"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgwNCwiaWF0IjoxNzAwODk1NjQ5LCJleHAiOjE3MDA5ODIwNDl9.cY84odQqFBkw3pe2qxh6_2B_b9YX_f0W6Ww19_e9fcE"}

// LOG  posting api: {"surveyId":984,"questionId":"457114","selectableOptionId":"469734","answerText":"쇼","userId":804,"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgwNCwiaWF0IjoxNzAwODk1NjQ5LCJleHAiOjE3MDA5ODIwNDl9.cY84odQqFBkw3pe2qxh6_2B_b9YX_f0W6Ww19_e9fcE"}
// LOG  posting api: {"surveyId":984,"questionId":"457094","selectableOptionId":"469684","answerText":"","userId":804,"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgwNCwiaWF0IjoxNzAwODk1NjQ5LCJleHAiOjE3MDA5ODIwNDl9.cY84odQqFBkw3pe2qxh6_2B_b9YX_f0W6Ww19_e9fcE"}
// LOG  posting api: {"surveyId":984,"questionId":"457104","selectableOptionId":"469714","answerText":"","userId":804,"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgwNCwiaWF0IjoxNzAwODk1NjQ5LCJleHAiOjE3MDA5ODIwNDl9.cY84odQqFBkw3pe2qxh6_2B_b9YX_f0W6Ww19_e9fcE"}
// LOG  posting api: {"surveyId":984,"questionId":"457104","selectableOptionId":"469724","answerText":"","userId":804,"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgwNCwiaWF0IjoxNzAwODk1NjQ5LCJleHAiOjE3MDA5ODIwNDl9.cY84odQqFBkw3pe2qxh6_2B_b9YX_f0W6Ww19_e9fcE"}
// LOG  posting api: {"surveyId":984,"questionId":"457124","selectableOptionId":"469754","answerText":"","userId":804,"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgwNCwiaWF0IjoxNzAwODk1NjQ5LCJleHAiOjE3MDA5ODIwNDl9.cY84odQqFBkw3pe2qxh6_2B_b9YX_f0W6Ww19_e9fcE"}
// LOG  posting api: {"surveyId":984,"questionId":"457134","selectableOptionId":"469784","answerText":"","userId":804,"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgwNCwiaWF0IjoxNzAwODk1NjQ5LCJleHAiOjE3MDA5ODIwNDl9.cY84odQqFBkw3pe2qxh6_2B_b9YX_f0W6Ww19_e9fcE"}
// LOG  posting api: {"surveyId":984,"questionId":"457144","selectableOptionId":"469794","answerText":"","userId":804,"accessToken":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjgwNCwiaWF0IjoxNzAwODk1NjQ5LCJleHAiOjE3MDA5ODIwNDl9.cY84odQqFBkw3pe2qxh6_2B_b9YX_f0W6Ww19_e9fcE"}
