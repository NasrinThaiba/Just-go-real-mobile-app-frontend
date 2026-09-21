import AsyncStorage from
"@react-native-async-storage/async-storage";



const ACCESS_TOKEN =
"jgr_access_token";


const REFRESH_TOKEN =
"jgr_refresh_token";


const AUTH_SESSION =
"jgr_auth_session";



export type AuthSession = {

  isAuthenticated:boolean;

  userId:string;

  phone:string;

  loggedInAt:string;

};



// =====================
// TOKEN STORAGE
// =====================

export async function saveTokens(

  accessToken:string,

  refreshToken:string,

){

  await AsyncStorage.setItem(

    ACCESS_TOKEN,

    accessToken,

  );


  await AsyncStorage.setItem(

    REFRESH_TOKEN,

    refreshToken,

  );

}



export async function getAccessToken(){

  return AsyncStorage.getItem(

    ACCESS_TOKEN,

  );

}



export async function getRefreshToken(){

  return AsyncStorage.getItem(

    REFRESH_TOKEN,

  );

}



export async function clearTokens(){

  await AsyncStorage.removeItem(

    ACCESS_TOKEN,

  );


  await AsyncStorage.removeItem(

    REFRESH_TOKEN,

  );

}



// =====================
// AUTH SESSION STORAGE
// =====================


export async function saveAuthSession(

  session:AuthSession,

){

  await AsyncStorage.setItem(

    AUTH_SESSION,

    JSON.stringify(session),

  );

}



export async function getAuthSession(){

  const data =
    await AsyncStorage.getItem(
      AUTH_SESSION,
    );


  if(!data){

    return null;

  }


  return JSON.parse(data) as AuthSession;

}



export async function clearAuthSession(){

  await AsyncStorage.removeItem(

    AUTH_SESSION,

  );

}