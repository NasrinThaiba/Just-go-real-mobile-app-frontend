export async function backendClient<T>(
  path:string,
  options?:RequestInit,
){

const response =
await fetch(
`${process.env.BACKEND_URL}${path}`,
{

...options,

headers:{
"Content-Type":
"application/json",

...(options?.headers || {})

}

}
);



const data =
await response.json();



if(!response.ok){

throw new Error(
data.message ||
"Backend error"
);

}



return data as T;

}