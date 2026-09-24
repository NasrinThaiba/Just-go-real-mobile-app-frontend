import {
  API_BASE_URL,
} from '@/services/apiClient';


import type {
  BookmarkResponse,
  BookmarkActionResponse,
  SavedContentResponse,
} from '@/features/saved/types/saved.types';


async function getErrorMessage(
  response: Response,
  fallback:string,
){

  try{

    const data = await response.json();
    return (
      data.message ||
      fallback
    );

  }
  catch{
    return fallback;
  }
}



export const SavedApi = {

  async getStatus(
    contentId:string,
    token:string,
  ):Promise<boolean>{


    const response =
      await fetch(
        `${API_BASE_URL}/contents/${contentId}/bookmark`,
        {
          headers:{
            Authorization:
              `Bearer ${token}`,
          },
        },
      );


    if(!response.ok){

      throw new Error(
        await getErrorMessage(
          response,
          "Failed to get bookmark",
        ),
      );

    }


    const result = await response.json() as BookmarkResponse;

    return result.data.isBookmarked;

  },


  async add(
    contentId:string,
    token:string,
  ):Promise<BookmarkActionResponse>{


    const response =
      await fetch(
        `${API_BASE_URL}/contents/${contentId}/bookmark`,
        {

          method:"POST",
          headers:{
            Authorization:
              `Bearer ${token}`,
          },

        },
      );



    if(!response.ok){
      throw new Error(
        await getErrorMessage(
          response,
          "Bookmark failed",
        ),
      );

    }

    return response.json();

  },


  async remove(
    contentId:string,
    token:string,
  ):Promise<BookmarkActionResponse>{

    const response =
      await fetch(
        `${API_BASE_URL}/contents/${contentId}/bookmark`,
        {

          method:"DELETE",

          headers:{
            Authorization:
              `Bearer ${token}`,
          },

        },
      );



    if(!response.ok){

      throw new Error(
        await getErrorMessage(
          response,
          "Remove bookmark failed",
        ),
      );

    }

    return response.json();


  },

  async getSaved(
    token:string,
  ):Promise<SavedContentResponse>{


    const response =
      await fetch(
        `${API_BASE_URL}/saved`,
        {

          headers:{
            Authorization:
              `Bearer ${token}`,
          },

        },
      );



    if(!response.ok){

      throw new Error(
        "Failed to load saved content",
      );

    }

    return response.json();


  },

};