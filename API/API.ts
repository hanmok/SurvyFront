let localRestServer = "http://localhost:3000";

let restServer = "https://dearsurvy.herokuapp.com";
// let graphServer = "https://localhost:3000/graphql";
let graphServer = "https://dearsurvy.herokuapp.com/graphql";

export const API_BASE_URL = localRestServer;
// export const API_BASE_URL = restServer;
export const GQL_URL = graphServer;

// GQL 은 Remote 서버임.. 로컬에서 아무리 테스트해도 그때그때 반영 안됨.
