import { apiClient } from '@/lib/api/apiClient';

import type {
  FeedItem,
} from '@/features/news/types/news.types';


// =====================================================
// POSTS TYPES
// =====================================================

type AdminPostsResponse = {
  message:string;

  data:{
    items:FeedItem[];
  };
};


type AdminDashboardResponse = {
  message:string;

  data:{
    summary:{
      total:number;
      pending:number;
      published:number;
      rejected:number;
    };
  };
};


type AdminPostResponse = {
  message:string;

  data:{
    item:FeedItem;
  };
};


type AdminDeleteResponse = {
  message:string;
};



// =====================================================
// DASHBOARD
// =====================================================

export async function getAdminDashboard(){

  const response =
    await apiClient<AdminDashboardResponse>(
      '/admin/dashboard',
      {
        method:'GET',
      },
    );


  return response.data.summary;

}



// =====================================================
// POSTS
// =====================================================

export async function getAdminPosts(){

  const response =
    await apiClient<AdminPostsResponse>(
      '/admin/posts',
      {
        method:'GET',
      },
    );


  return response.data.items;

}



export async function getAdminPostById(
  id:string,
){

  const response =
    await apiClient<AdminPostResponse>(
      `/admin/posts/${id}`,
      {
        method:'GET',
      },
    );


  return response.data.item;

}



// =====================================================
// APPROVE
// =====================================================

export async function approveAdminPost(
  id:string,
){

  const response =
    await apiClient<AdminPostResponse>(
      `/admin/posts/${id}/approve`,
      {
        method:'PATCH',
      },
    );


  return response.data.item;

}



// =====================================================
// REJECT
// =====================================================

export async function rejectAdminPost(
  id:string,
  reason?:string,
){

  const response =
    await apiClient<AdminPostResponse>(
      `/admin/posts/${id}/reject`,
      {
        method:'PATCH',

        body:{
          ...(reason
            ? {reason}
            : {}),
        },
      },
    );


  return response.data.item;

}



// =====================================================
// UNPUBLISH
// =====================================================

export async function unpublishAdminPost(
  id:string,
){

  const response =
    await apiClient<AdminPostResponse>(
      `/admin/posts/${id}/unpublish`,
      {
        method:'PATCH',
      },
    );


  return response.data.item;

}



// =====================================================
// DELETE
// =====================================================

export async function deleteAdminPost(
  id:string,
){

  const response =
    await apiClient<AdminDeleteResponse>(
      `/admin/posts/${id}`,
      {
        method:'DELETE',
      },
    );


  return response;

}



// =====================================================
// USERS
// =====================================================


export type AdminUser = {

  id:string;

  name:string;

  phone:string;

  email:string;

  role:
  | 'reader'
  | 'reporter'
  | 'editor'
  | 'admin';


  status:
  | 'active'
  | 'blocked';


  avatar:string;


  createdAt:string;

  updatedAt:string;

};



type AdminUsersResponse = {

  message:string;


  data:{
    users:AdminUser[];
  };

};



type AdminUserResponse = {

  message:string;


  data:{
    user:AdminUser;
  };

};



// =====================================================
// GET USERS
// =====================================================


export async function getAdminUsers(){

  const response =
    await apiClient<AdminUsersResponse>(
      '/admin/users',
      {
        method:'GET',
      },
    );


  return response.data.users;

}



// =====================================================
// BLOCK USER
// =====================================================


export async function blockAdminUser(
  id:string,
){

  const response =
    await apiClient<any>(
      `/admin/users/${id}/block`,
      {
        method:'PATCH',
        body:{},
      },
    );


  console.log(
    "BLOCK RESPONSE:",
    response,
  );


  return response.data?.user ?? response.user;

}


// =====================================================
// UNBLOCK USER
// =====================================================


export async function unblockAdminUser(
  id:string,
){

  const response =
    await apiClient<any>(
      `/admin/users/${id}/unblock`,
      {
        method:'PATCH',
        body:{},
      },
    );


  console.log(
    "UNBLOCK RESPONSE:",
    response,
  );


  return response.data?.user ?? response.user;

}


// =====================================================
// UPDATE ROLE
// =====================================================


export async function updateAdminUserRole(
  id:string,

  role:
  | 'reader'
  | 'reporter'
  | 'editor'
  | 'admin',

){

  const response =
    await apiClient<AdminUserResponse>(
      `/admin/users/${id}/role`,
      {

        method:'PATCH',

        body:{
          role,
        },

      },
    );


  return response.data.user;

}