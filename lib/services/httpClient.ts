import axios from "axios";

import axiosRetry from "axios-retry";

axiosRetry(axios, { retries: 3 });

export const httpClient = axios.create({
    baseURL: "https://app.mytonswap.com/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// httpClient.interceptors.request.use((config) => {
//     config.headers["app-id"]
//     return config;
// })
