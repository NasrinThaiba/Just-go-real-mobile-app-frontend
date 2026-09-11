import { apiClient } from '@/shared/api/axiosInstance';


import type {
  FeedItem,
  CreateNewsPayload,
} from '../types/news.types';





// ===============================
// CREATE NEWS
// ===============================

export async function createNews(

  payload:CreateNewsPayload,

):Promise<FeedItem>{


  const response =
    await apiClient.post(

      '/news',

      payload,

    );


  return response.data.data;

}






// ===============================
// GET MY NEWS BY ID
// ===============================

export async function getMyNewsById(

  id:string,

):Promise<FeedItem>{


  const response =
    await apiClient.get(

      `/news/me/${id}`,

    );


  return response.data.data;

}







// ===============================
// UPDATE NEWS
// ===============================

export async function updateNews(

  id:string,

  payload:
    Partial<CreateNewsPayload>,

):Promise<FeedItem>{


  const response =
    await apiClient.patch(

      `/news/${id}`,

      payload,

    );


  return response.data.data;

}