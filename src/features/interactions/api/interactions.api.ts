import { API_BASE_URL } from '@/services/apiClient';

export type InteractionSummary = {
  likes: number;
  shares: number;
  comments: number;
};

export type LikeStatus = {
  isLiked: boolean;
};

type SummaryResponse = {
  message?: string;
  data?: InteractionSummary;
};

type LikeResponse = {
  message?: string;
  data?: {
    isLiked?: boolean;
  };
};

async function getErrorMessage(
  response: Response,
  fallback: string,
) {
  try {
    const result = await response.json();

    return (
      result?.message ||
      result?.error ||
      fallback
    );
  } catch {
    return fallback;
  }
}

export const interactionsApi = {
  /**
   * GET /contents/:contentId/interactions
   */
  async getSummary(
    contentId: string,
  ): Promise<InteractionSummary> {
    const response = await fetch(
      `${API_BASE_URL}/contents/${contentId}/interactions`,
    );

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(
          response,
          'Failed to load interactions',
        ),
      );
    }

    const result =
      (await response.json()) as SummaryResponse;

    return (
      result.data ?? {
        likes: 0,
        shares: 0,
        comments: 0,
      }
    );
  },

  /**
   * GET /contents/:contentId/like
   */
  async getLikeStatus(
    contentId: string,
    token: string,
  ): Promise<boolean> {
    const response = await fetch(
      `${API_BASE_URL}/contents/${contentId}/like`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(
          response,
          'Failed to get like status',
        ),
      );
    }

    const result =
      (await response.json()) as LikeResponse;

    return result.data?.isLiked ?? false;
  },

  /**
   * POST /contents/:contentId/like
   */
  async like(
 contentId:string,
 token:string,
):Promise<{
 data:{
  isLiked:boolean;
  likes:number;
 }
}> {

 const response =
 await fetch(
 `${API_BASE_URL}/contents/${contentId}/like`,
 {
  method:"POST",

  headers:{
   Authorization:
   `Bearer ${token}`,
  },
 }
 );


 if(!response.ok){

  throw new Error(
   "Like failed"
  );

 }


 return response.json();

},



async unlike(
 contentId:string,
 token:string,
):Promise<{
 data:{
  isLiked:boolean;
  likes:number;
 }
}> {


const response =
await fetch(
`${API_BASE_URL}/contents/${contentId}/like`,
{
 method:"DELETE",

 headers:{
  Authorization:
  `Bearer ${token}`,
 },
}
);


if(!response.ok){

 throw new Error(
  "Unlike failed"
 );

}


return response.json();

},

  /**
   * POST /contents/:contentId/share
   */
  async share(
    contentId: string,
    token?: string,
  ): Promise<void> {
    const response = await fetch(
      `${API_BASE_URL}/contents/${contentId}/share`,
      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',

          ...(token
            ? {
                Authorization: `Bearer ${token}`,
              }
            : {}),
        },
      },
    );

    if (!response.ok) {
      throw new Error(
        await getErrorMessage(
          response,
          'Failed to record share',
        ),
      );
    }
  },
};