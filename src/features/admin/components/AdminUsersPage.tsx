import {
  FlatList,
  Pressable,
  Text,
  View,
  ActivityIndicator,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { SafeAreaView } from 'react-native-safe-area-context';

import {
  useAdminUsers,
} from '@/features/admin/hooks/useAdminUsers';



export default function AdminUsersPage(){


  const {
    users,
    isLoading,
    error,
    blockUser,
    unblockUser,
  } = useAdminUsers();





  const handleStatus =
    async(
      id:string,
      status:'active' | 'blocked',
    )=>{


      try {


        console.log(
          "BUTTON CLICK:",
          id,
          status,
        );



        if(status === 'active'){

          await blockUser(id);

        }
        else{

          await unblockUser(id);

        }



      }
      catch(error){

        console.log(
          "STATUS ERROR:",
          error,
        );

      }


    };







  if(isLoading){

    return (

      <View className="flex-1 items-center justify-center bg-slate-50">

        <ActivityIndicator
          size="large"
          color="#17336B"
        />

        <Text className="mt-3 text-slate-500 font-semibold">
          Loading users...
        </Text>

      </View>

    );

  }





  if(error){

    return (

      <View className="flex-1 items-center justify-center px-5 bg-slate-50">

        <View className="rounded-2xl bg-red-50 p-5">

          <Text className="font-bold text-red-600">

            {error}

          </Text>

        </View>

      </View>

    );

  }







  return (

    <SafeAreaView
      className="flex-1 bg-slate-50"
    >


      {/* HEADER */}

      <View
        className="
        border-b
        border-slate-200
        bg-white
        px-5
        py-4
        "
      >

        <Text
          className="
          text-2xl
          font-black
          text-slate-900
          "
        >
          User Management
        </Text>


        <Text
          className="
          mt-1
          text-sm
          text-slate-500
          "
        >
          Manage registered users
        </Text>


      </View>







      <FlatList


        data={users}


        keyExtractor={
          item=>item.id
        }


        showsVerticalScrollIndicator={false}


        contentContainerStyle={{
          padding:16,
          paddingBottom:40,
        }}





        renderItem={({item})=>(


          <View

            className="
            mb-4
            rounded-3xl
            border
            border-slate-200
            bg-white
            p-5
            "

          >



            {/* PROFILE */}


            <View
              className="
              flex-row
              items-center
              "
            >



              <View

                className="
                h-14
                w-14
                items-center
                justify-center
                rounded-full
                bg-slate-100
                "

              >

                <Ionicons

                  name="person"

                  size={28}

                  color="#64748B"

                />


              </View>





              <View
                className="
                ml-4
                flex-1
                "
              >



                <Text

                  className="
                  text-lg
                  font-black
                  text-slate-900
                  "

                >

                  {item.name}

                </Text>





                <Text

                  className="
                  mt-1
                  text-sm
                  text-slate-500
                  "

                >

                  {item.email || item.phone}

                </Text>





                <View
                  className="
                  mt-3
                  flex-row
                  "
                >




                  {/* ROLE */}

                  <View

                    className="
                    rounded-full
                    bg-blue-50
                    px-3
                    py-1
                    "

                  >

                    <Text

                      className="
                      text-xs
                      font-bold
                      uppercase
                      text-blue-700
                      "

                    >

                      {item.role}

                    </Text>


                  </View>





                  {/* STATUS */}

                  <View

                    className={`

                    ml-2
                    rounded-full
                    px-3
                    py-1

                    ${
                      item.status === 'active'
                      ? 'bg-green-50'
                      : 'bg-red-50'
                    }

                    `}

                  >


                    <Text

                      className={`

                      text-xs
                      font-bold
                      uppercase

                      ${
                        item.status === 'active'
                        ? 'text-green-700'
                        : 'text-red-700'
                      }

                      `}

                    >

                      {item.status}

                    </Text>


                  </View>




                </View>



              </View>




            </View>








            {/* ACTION */}

            {
              item.role !== 'admin' && (


                <Pressable


                  onPress={()=>{

                    handleStatus(
                      item.id,
                      item.status,
                    );

                  }}



                  className={`

                  mt-5
                  flex-row
                  items-center
                  justify-center
                  rounded-2xl
                  py-3.5


                  ${
                    item.status === 'active'
                    ? 'bg-red-50'
                    : 'bg-green-50'
                  }

                  `}


                >



                  <Ionicons


                    name={

                      item.status === 'active'

                      ? 'ban-outline'

                      : 'checkmark-circle-outline'

                    }



                    size={21}



                    color={

                      item.status === 'active'

                      ? '#DC2626'

                      : '#16A34A'

                    }


                  />





                  <Text

                    className={`

                    ml-2
                    text-sm
                    font-extrabold


                    ${
                      item.status === 'active'
                      ? 'text-red-600'
                      : 'text-green-600'
                    }

                    `}

                  >

                    {
                      item.status === 'active'
                      ? 'Block User'
                      : 'Unblock User'
                    }


                  </Text>




                </Pressable>


              )
            }





          </View>


        )}

      />



    </SafeAreaView>


  );

}