import { ApiResponse } from "./ApiResponse";

export interface TokenResponse extends ApiResponse {
    accessToken?: string
    error: any
    idToken?:string
}