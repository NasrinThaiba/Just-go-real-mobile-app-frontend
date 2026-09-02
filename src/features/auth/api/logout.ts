import { apiClient } from "@/lib/api/apiClient";

export function logout(refreshToken:string){
    return apiClient(
        "/auth/logout",
        {
            method:"POST",
            body:{
                refreshToken,
            },
        },
    );
}