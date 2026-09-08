import {
  useCallback,
  useEffect,
  useState,
} from 'react';

import {
  getAdminUsers,
  blockAdminUser,
  unblockAdminUser,
  updateAdminUserRole,
} from '@/features/admin/api/admin.api';

import type {
  AdminUser,
} from '@/features/admin/api/admin.api';



export function useAdminUsers() {


  const [
    users,
    setUsers,
  ] = useState<AdminUser[]>([]);



  const [
    isLoading,
    setIsLoading,
  ] = useState(true);



  const [
    isUpdating,
    setIsUpdating,
  ] = useState(false);



  const [
    error,
    setError,
  ] = useState<string | null>(null);





  // LOAD USERS

  const loadUsers =
    useCallback(
      async()=>{

        try {

          setIsLoading(true);
          setError(null);


          const result =
            await getAdminUsers();


          setUsers(result);


        }
        catch(error){

          console.log(
            "GET USERS ERROR:",
            error,
          );


          setError(
            error instanceof Error
            ? error.message
            : "Unable to load users",
          );

        }
        finally{

          setIsLoading(false);

        }

      },
      [],
    );





  useEffect(()=>{

    void loadUsers();

  },[loadUsers]);








  // BLOCK USER

  const blockUser =
    useCallback(
      async(
        id:string,
      )=>{

        try {


          setIsUpdating(true);


          console.log(
            "BLOCK USER:",
            id,
          );


          await blockAdminUser(id);



          setUsers(
            currentUsers =>
              currentUsers.map(
                user =>
                  user.id === id
                  ? {
                      ...user,
                      status:'blocked',
                    }
                  : user,
              ),
          );


        }
        catch(error){

          console.log(
            "BLOCK ERROR:",
            error,
          );


          throw error;

        }
        finally{

          setIsUpdating(false);

        }


      },
      [],
    );









  // UNBLOCK USER

  const unblockUser =
    useCallback(
      async(
        id:string,
      )=>{

        try {


          setIsUpdating(true);


          console.log(
            "UNBLOCK USER:",
            id,
          );


          await unblockAdminUser(id);



          setUsers(
            currentUsers =>
              currentUsers.map(
                user =>
                  user.id === id
                  ? {
                      ...user,
                      status:'active',
                    }
                  : user,
              ),
          );



        }
        catch(error){


          console.log(
            "UNBLOCK ERROR:",
            error,
          );


          throw error;

        }
        finally{

          setIsUpdating(false);

        }


      },
      [],
    );









  // UPDATE ROLE

  const updateRole =
    useCallback(
      async(
        id:string,

        role:
        | 'reader'
        | 'reporter'
        | 'editor'
        | 'admin',

      )=>{


        try {


          setIsUpdating(true);


          const updatedUser =
            await updateAdminUserRole(
              id,
              role,
            );



          setUsers(
            currentUsers =>
              currentUsers.map(
                user =>
                  user.id === id
                  ? {
                      ...user,
                      ...updatedUser,
                    }
                  : user,
              ),
          );


        }
        catch(error){

          console.log(
            "ROLE UPDATE ERROR:",
            error,
          );


          throw error;

        }
        finally{

          setIsUpdating(false);

        }


      },
      [],
    );









  const refresh =
    useCallback(
      async()=>{

        await loadUsers();

      },
      [
        loadUsers,
      ],
    );






  return {

    users,

    isLoading,

    isUpdating,

    error,

    refresh,

    blockUser,

    unblockUser,

    updateRole,

  };


}