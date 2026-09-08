import {
  getAccessToken,
} from '@/features/auth/storage/auth.storage';


type ApiOptions = {

  method?:
    | 'GET'
    | 'POST'
    | 'PUT'
    | 'PATCH'
    | 'DELETE';


  body?: unknown;

};



const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL;



if(!BASE_URL){

  throw new Error(
    'EXPO_PUBLIC_API_URL is missing',
  );

}




export async function apiClient<T>(

  path:string,

  options:ApiOptions = {},

):Promise<T>{



  const token =
    await getAccessToken();



  const url =
    `${BASE_URL}${path}`;



  console.log(
    'REQUEST URL:',
    url,
  );


  console.log(
    'REQUEST METHOD:',
    options.method ?? 'GET',
  );


  console.log(
    'HAS TOKEN:',
    !!token,
  );




  const response =
    await fetch(

      url,

      {

        method:
          options.method ?? 'GET',


        headers:{

          'Content-Type':
            'application/json',


          ...(token
            ? {

              Authorization:
                `Bearer ${token}`,

            }
            : {}),

        },



        body:

          options.body !== undefined

          ? JSON.stringify(
              options.body,
            )

          : undefined,


      },

    );





  console.log(
    'RESPONSE STATUS:',
    response.status,
  );




  const text =
    await response.text();




  let data:any = {};



  try{

    data =
      text
      ? JSON.parse(text)
      : {};

  }

  catch{

    data={
      message:text,
    };

  }





  console.log(
    'RESPONSE DATA:',
    data,
  );




  if(!response.ok){

    throw new Error(
      data.message ??
      'API request failed',
    );

  }




  return data as T;

}