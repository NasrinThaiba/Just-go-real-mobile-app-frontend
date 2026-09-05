import { useMutation } from "@tanstack/react-query";
import { verifyOtp } from "../api/verifyOtp";
import { saveTokens, saveAuthSession } from "../storage/auth.storage";
import { useAuthStore } from "../store/auth.store";

export function useVerifyOtp() {

  const setUser =
    useAuthStore(
      (state) => state.setUser,
    );


  return useMutation({

    mutationFn:
      verifyOtp,


    onSuccess:
      async (response) => {


        const {
          accessToken,
          refreshToken,
          user,
        } = response.data;



        // Save JWT tokens
        await saveTokens(
          accessToken,
          refreshToken,
        );



        // Save persistent session
        await saveAuthSession({

          isAuthenticated: true,

          userId:
            user.id,

          phone:
            user.phone,

          loggedInAt:
            new Date()
              .toISOString(),

        });



        // Update Zustand
        setUser(user);

      },

  });

}