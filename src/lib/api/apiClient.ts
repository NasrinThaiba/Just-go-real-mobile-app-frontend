import {
  getAccessToken,
} from "@/features/auth/storage/auth.storage";


type ApiOptions = {

  method?:
    | "GET"
    | "POST"
    | "PUT"
    | "PATCH"
    | "DELETE";

  body?: unknown;

};



const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL;



if (!BASE_URL) {

  throw new Error(
    "EXPO_PUBLIC_API_URL is missing",
  );

}



export async function apiClient<T>(

  path:string,

  options:ApiOptions = {},

):Promise<T>{


  const token =
    await getAccessToken();



  console.log(
    "API URL:",
    `${BASE_URL}${path}`,
  );


  console.log(
    "METHOD:",
    options.method ?? "GET",
  );


  console.log(
    "ACCESS TOKEN:",
    token,
  );



  const response =
    await fetch(

      `${BASE_URL}${path}`,

      {

        method:
          options.method ?? "GET",


        headers: {

          "Content-Type":
            "application/json",


          ...(token
            ? {
                Authorization:
                  `Bearer ${token}`,
              }
            : {}),

        },


        body:
          options.body
            ? JSON.stringify(
                options.body,
              )
            : undefined,

      },

    );



  console.log(
    "STATUS:",
    response.status,
  );



  const data =
    await response.json();



  console.log(
    "RESPONSE:",
    data,
  );



  if (!response.ok) {

    throw new Error(
      data.message ??
      "Something went wrong",
    );

  }



  return data as T;

}