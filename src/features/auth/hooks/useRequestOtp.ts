import {useMutation} from "@tanstack/react-query";
import {requestOtp} from "../api/requestOtp";


export function useRequestOtp(){

  return useMutation({

    mutationFn:
      (phone:string)=>
        requestOtp(phone),

  });

}