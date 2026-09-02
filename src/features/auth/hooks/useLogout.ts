import {useMutation} from "@tanstack/react-query";
import {logout} from "../api/logout";
import {
  getRefreshToken,
  clearTokens,
} from "../storage/auth.storage";
import {useAuthStore} from "../store/auth.store";


export function useLogout(){
  const clearUser =
    useAuthStore(
      state=>state.clearUser,
    );

  return useMutation({
    mutationFn:
      async()=>{
        const token = await getRefreshToken();

        if(token){
          return logout(token,
          );

        }


      },



    onSuccess:
      async()=>{


        await clearTokens();


        clearUser();


      },


  });


}