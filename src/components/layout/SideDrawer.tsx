import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

type SideDrawerProps = {
  visible: boolean;
  onClose: () => void;
};

const menuItems = [
  { label: 'Home', icon: 'home-outline', route: '/(tabs)' },
  { label: 'News', icon: 'newspaper-outline', route: '/(tabs)/news' },
  { label: 'Trending', icon: 'trending-up-outline', route: '/(tabs)/trending' },
  { label: 'Videos', icon: 'play-circle-outline', route: '/(tabs)/video' },
  { label: 'Create News', icon: 'create-outline', route: '/create-news' },
  { label: 'Create Video', icon: 'videocam-outline', route: '/create-video' },
] as const;

export function SideDrawer({ visible, onClose }: SideDrawerProps) {
  const router = useRouter();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable onPress={onClose} className="flex-1 bg-black/50">
        <Pressable
          onPress={(event) => event.stopPropagation()}
          className="h-full w-[82%] bg-white px-5 pt-14"
        >
          <View className="mb-8 flex-row items-center justify-between">
            <Text className="text-xl font-black text-navy">
              Just Go <Text className="text-primary">Real</Text>
            </Text>

            <Pressable onPress={onClose} hitSlop={10}>
              <Ionicons name="close" size={25} color="#121826" />
            </Pressable>
          </View>

          {menuItems.map((item) => (
            <Pressable
              key={item.label}
              onPress={() => {
                onClose();
                router.push(item.route as never);
              }}
              className="min-h-14 flex-row items-center gap-3 border-b border-slate-100"
            >
              <View className="h-10 w-10 items-center justify-center rounded-full bg-primarySoft">
                <Ionicons
                  name={item.icon}
                  size={20}
                  color="#F0442D"
                />
              </View>

              <Text className="flex-1 font-bold text-textMain">
                {item.label}
              </Text>

              <Ionicons
                name="chevron-forward"
                size={19}
                color="#98A2B3"
              />
            </Pressable>
          ))}
        </Pressable>
      </Pressable>
    </Modal>
  );
}
