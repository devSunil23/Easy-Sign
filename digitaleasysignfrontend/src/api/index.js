import axios from "axios";
import { env } from "../utilities/function";
import { getCookie } from "../utilities/cookies";
const accessToken = getCookie('accessToken')

export default axios.create({
    baseURL:env("BACKEND_SERVER") ,
    headers:{
        "Content-Type": "application/json",
        "Authorization":`Bearer ${accessToken }`
    },
    withCredentials: false,
})