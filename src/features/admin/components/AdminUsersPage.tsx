import {
  Alert,
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

type AdminUser = {
  id: string;
  name: string;
  email: string;
  role:
    | 'reader'
    | 'reporter'
    | 'editor'
    | 'admin';
  status:
    | 'active'
    | 'blocked';
  avatar: string;
};

const USERS: AdminUser[] = [
  {
    id: 'admin-1',
    name: 'Admin User',
    email: 'admin@justgoreal.com',
    role: 'admin',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Admin+User&background=17336B&color=ffffff',
  },
  {
    id: 'user-1',
    name: 'Reporter User',
    email: 'reporter@justgoreal.com',
    role: 'reporter',
    status: 'active',
    avatar: 'https://ui-avatars.com/api/?name=Reporter+User&background=F0442D&color=ffffff',
  },
];

export default function AdminUsersPage() {
  const router = useRouter();

  const blockUser = (
    user: AdminUser,
  ) => {
    Alert.alert(
      'Block user',
      `Block ${user.name}?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Block',
          style: 'destructive',
          onPress: () => {
            console.log( 'Block user:', user.id );
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-slate-50"
    >
      <View className="h-14 flex-row items-center border-b border-borderSoft bg-white px-4">
        <Pressable
          onPress={() =>
            router.back()
          }
          className="h-10 w-10 items-center justify-center rounded-full"
        >
          <Ionicons
            name="arrow-back"
            size={24}
            color="#121826"
          />
        </Pressable>

        <Text className="ml-2 text-xl font-black text-textMain">
          User Management
        </Text>
      </View>

      <FlatList
        data={USERS}
        keyExtractor={(item) =>
          item.id
        }
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 50,
        }}
        renderItem={({ item }) => (
          <View className="mb-3 rounded-2xl border border-borderSoft bg-white p-4">
            <View className="flex-row items-center">
              <Image
                source={{
                  uri: item.avatar,
                }}
                className="h-14 w-14 rounded-full bg-slate-100"
              />

              <View className="ml-3 flex-1">
                <Text className="text-base font-black text-textMain">
                  {item.name}
                </Text>

                <Text className="mt-1 text-sm text-textMuted">
                  {item.email}
                </Text>

                <View className="mt-2 flex-row items-center">
                  <View className="rounded-full bg-blue-50 px-3 py-1">
                    <Text className="text-xs font-extrabold uppercase text-blue-700">
                      {item.role}
                    </Text>
                  </View>

                  <View
                    className={`ml-2 rounded-full px-3 py-1 ${
                      item.status ===
                      'active'
                        ? 'bg-green-50'
                        : 'bg-red-50'
                    }`}
                  >
                    <Text
                      className={`text-xs font-extrabold uppercase ${
                        item.status ===
                        'active'
                          ? 'text-green-700'
                          : 'text-red-700'
                      }`}
                    >
                      {item.status}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {item.role !==
            'admin' ? (
              <Pressable
                onPress={() =>
                  blockUser(item)
                }
                className="mt-4 flex-row items-center justify-center rounded-xl border border-red-200 bg-red-50 py-3"
              >
                <Ionicons
                  name="ban-outline"
                  size={19}
                  color="#DC2626"
                />

                <Text className="ml-2 font-extrabold text-red-600">
                  Block User
                </Text>
              </Pressable>
            ) : null}
          </View>
        )}
      />
    </SafeAreaView>
  );
}