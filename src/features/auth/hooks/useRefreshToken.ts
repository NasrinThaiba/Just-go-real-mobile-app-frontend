import {useMutation} from "@tanstack/react-query";
import {refreshToken} from "../api/refresh";
import {
  getRefreshToken,
  saveTokens,
} from "../storage/auth.storage";


export function useRefreshToken(){
  return useMutation({
    mutationFn:
      async()=>{
        const token =
          await getRefreshToken();

        if(!token){
          throw new Error(
            "Refresh token missing",
          );

        }

        return refreshToken(
          token,
        );
      },

    onSuccess:
      async(response)=>{
        await saveTokens(
          response.data.accessToken,
          response.data.refreshToken,
        );
      },
  });
}