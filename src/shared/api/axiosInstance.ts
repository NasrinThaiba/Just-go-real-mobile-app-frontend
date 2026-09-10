import axios from 'axios';
import {
  getAccessToken,
} from '@/features/auth/storage/auth.storage';


export const apiClient =
  axios.create({

    baseURL:
      process.env.EXPO_PUBLIC_API_URL,

    timeout:15000,

    headers:{
      'Content-Type':
        'application/json',
    },

  });



apiClient.interceptors.request.use(

  async(config)=>{


    const token =
      await getAccessToken();



    console.log(
      "API TOKEN:",
      token,
    );



    if(token){

      config.headers.Authorization =
        `Bearer ${token}`;

    }



    console.log(
      "REQUEST URL:",
      `${config.baseURL}${config.url}`,
    );


    console.log(
      "AUTH HEADER:",
      config.headers.Authorization,
    );



    return config;

  },


  error=>{

    return Promise.reject(error);

  },

);