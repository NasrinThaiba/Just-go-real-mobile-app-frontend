import {
  apiClient,
} from '@/lib/api/apiClient';

import type {
  UpdateProfileResponse,
} from '../types/profile.types';


type UploadUrlResponse = {

  message: string;

  data: {

    uploadUrl: string;

    fileUrl: string;

  };

};



export async function uploadProfileImage(
  imageUri: string,
) {

  /*
   * 1. Get the image file information
   */
  const fileName =
    imageUri.split('/').pop() ??
    `profile-${Date.now()}.jpg`;


  const extension =
    fileName
      .split('.')
      .pop()
      ?.toLowerCase();


  const contentType =
    extension === 'png'
      ? 'image/png'
      : 'image/jpeg';


  /*
   * 2. Ask backend for a
   *    presigned S3 upload URL
   */
  const uploadResponse =
    await apiClient<UploadUrlResponse>(
      '/media/upload-url',
      {

        method: 'POST',

        body: {

          fileName,

          contentType,

        },

      },
    );


  const {
    uploadUrl,
    fileUrl,
  } =
    uploadResponse.data;


  /*
   * 3. Convert local URI into Blob
   */
  const imageResponse =
    await fetch(imageUri);


  const blob =
    await imageResponse.blob();


  /*
   * 4. Upload directly to S3
   */
  const s3Response =
    await fetch(
      uploadUrl,
      {

        method: 'PUT',

        headers: {

          'Content-Type':
            contentType,

        },

        body: blob,

      },
    );


  if (!s3Response.ok) {

    throw new Error(
      'Failed to upload profile image',
    );

  }


  /*
   * 5. Save S3 URL
   *    to the user's profile
   */
  const profileResponse =
    await apiClient<UpdateProfileResponse>(
      '/users/me',
      {

        method: 'PATCH',

        body: {

          profileImage:
            fileUrl,

        },

      },
    );


  return profileResponse.data.user;

}