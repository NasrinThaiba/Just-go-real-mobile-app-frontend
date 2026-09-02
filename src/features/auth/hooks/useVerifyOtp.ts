import {useMutation} from "@tanstack/react-query";
import {verifyOtp} from "../api/verifyOtp";
import {saveTokens} from "../storage/auth.storage";
import {useAuthStore} from "../store/auth.store";

export function useVerifyOtp(){
  const setUser =
    useAuthStore(
      state=>state.setUser,
    );

  return useMutation({
    mutationFn:
      verifyOtp,

    onSuccess:
      async(response)=>{

        const {accessToken,refreshToken,user} = response.data;
            await saveTokens(
                accessToken,
                refreshToken,
            );

            setUser(user);
      },
  });
}