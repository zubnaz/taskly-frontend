import axios from "axios";
import { baseUrl } from "./baseUrl";
export const api = axios.create(
    {
        baseURL: baseUrl
    }
)