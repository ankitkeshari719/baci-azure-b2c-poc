import log from 'loglevel';

// const env = process.env.REACT_APP_NODE_ENV?.toLocaleLowerCase();

// let featureFlags = {
//     feedback: true,
//     pulseCheck: true,
//     rateApp: false,
//     report: true,
//     stressTest: true,
// };
//let api_url = "http://localhost:8081";

const featureFlags = {
  feedback: process.env.REACT_APP_FEEDBACK,
  pulseCheck: process.env.REACT_APP_PULSE_CHECK,
  rateApp: false,
  report: process.env.REACT_APP_REPORT,
  stressTest: process.env.REACT_APP_STRESS_TEST,
};
const api_url = process.env.REACT_APP_API_URL+"";


// if (env === 'production') {
//     featureFlags = {
//         feedback: false,
//         pulseCheck: false,
//         rateApp: false,
//         report: true,
//         stressTest: false,
//     };
//     api_url = "https://prod-api-container-app.happywave-6f9d3247.australiaeast.azurecontainerapps.io"
//     log.setLevel(log.levels.ERROR);
// } else if (env === 'test') {
//     featureFlags = {
//         feedback: true,
//         pulseCheck: true,
//         rateApp: false,
//         report: true,
//         stressTest: false,
//     };
//     api_url = "https://baciapi.azurewebsites.net"
//     log.setLevel(log.levels.TRACE);
// } else if (env === 'development') {
//     featureFlags = {
//         feedback: process.env.FEEDBACK
//         pulseCheck: process.env.PULSE_CHECK
//         rateApp: false,
//         report: process.env.REPORT
//         stressTest: process.env.STRESS_TEST
//     };
//     api_url = "https://baciapi.azurewebsites.net"
//     log.setLevel(log.levels.TRACE);
// }

export const FEATURE_FLAGS_SET = featureFlags;
export const API_URL = api_url;
