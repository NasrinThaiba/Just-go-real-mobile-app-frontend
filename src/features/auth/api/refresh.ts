import { apiClient } from "@/lib/api/apiClient";
import type { RefreshTokenResponse } from "../types/auth.types";

export function refreshToken(refreshToken:string){
    return apiClient<RefreshTokenResponse>(
        "/auth/refresh",
            {
                method:"POST",
                body:{
                    refreshToken,
                },
            },
    );
}