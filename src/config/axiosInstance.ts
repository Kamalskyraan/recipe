import axios from "axios";

const axiosConfig = axios.create({
  baseURL: "https://transmodel.skyraantech.com/",
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosConfig;