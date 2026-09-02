import { apiClient } from "@/lib/api/apiClient";
import type { VerifyOtpResponse } from "../types/auth.types";

export function verifyOtp(
    input:{ phone:string, otp:string, name?:string}){
        return apiClient<VerifyOtpResponse>(
            "/auth/verify-otp",
            {
                method:"POST",
                body:input,
            },
        );

}