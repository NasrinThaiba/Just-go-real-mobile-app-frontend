import { apiClient } from "@/lib/api/apiClient";
import type { RequestOtpResponse } from "../types/auth.types";

export function requestOtp(phone:string){
    return apiClient<RequestOtpResponse>(
        "/auth/request-otp",
        {
            method:"POST",
            body:{ phone },
        },
    );
}