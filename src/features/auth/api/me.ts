import { apiClient } from "@/lib/api/apiClient";
import type { MeResponse } from "../types/auth.types";

export function getMe(){
    return apiClient<MeResponse>(
        "/auth/me",
    );
}