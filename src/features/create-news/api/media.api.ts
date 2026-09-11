import { apiClient } from '@/shared/api/axiosInstance';


export async function createUploadUrl(
  fileName:string,
  fileType:string,
){


 const response =
   await apiClient.post(
     '/media/upload-url',
     {
       fileName,
       fileType,
     },
   );


 return response.data.data;

}