import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import {
  FlatList,
  Image,
  Pressable,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type CategoryItem = {
  id: string;
  label: string;
  image: string;
};

const categories: CategoryItem[] = [
  {
    id: 'politics',
    label: 'Politics',
    image:
      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=900',
  },
  {
    id: 'business',
    label: 'Business',
    image:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=900',
  },
  {
    id: 'science',
    label: 'Science',
    image:
      'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=900',
  },
  {
    id: 'technology',
    label: 'Technology',
    image:
      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=900',
  },
  {
    id: 'sports',
    label: 'Sports',
    image:
      'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=900',
  },
  {
    id: 'cinema',
    label: 'Cinema',
    image:
      'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=900',
  },
  {
    id: 'education',
    label: 'Education',
    image:
      'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=900',
  },
  {
    id: 'health',
    label: 'Health',
    image:
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=900',
  },
  {
    id: 'world',
    label: 'World',
    image:
      'https://images.unsplash.com/photo-1521295121783-8a321d551ad2?w=900',
  },
  {
    id: 'automobile',
    label: 'Automobile',
    image:
      'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=900',
  },
];

export default function CategoriesScreen() {
  const router = useRouter();

  const openCategory = (category: string) => {
    router.push({
      pathname: '/news',
      params: {
        category,
      },
    });
  };

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-white"
    >
      {/* Header */}
      <View className="flex-row items-center border-b border-borderSoft px-4 py-3">
        <Pressable
          onPress={() => router.back()}
          hitSlop={10}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100"
        >
          <Ionicons
            name="arrow-back"
            size={23}
            color="#121826"
          />
        </Pressable>

        <View className="ml-2 flex-1">
          <Text className="text-xl font-black text-textMain">
            Categories
          </Text>

          <Text className="mt-1 text-xs font-semibold text-textMuted">
            Browse news by category
          </Text>
        </View>

        <Pressable
          hitSlop={10}
          className="h-10 w-10 items-center justify-center rounded-full active:bg-slate-100"
        >
          <Ionicons
            name="search-outline"
            size={22}
            color="#121826"
          />
        </Pressable>
      </View>

      {/* Two-column category grid */}
      <FlatList
        data={categories}
        numColumns={2}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        columnWrapperStyle={{
          gap: 12,
        }}
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 40,
          gap: 12,
        }}
        renderItem={({ item }) => (
          <CategoryGridCard
            item={item}
            onPress={() =>
              openCategory(item.label)
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

type CategoryGridCardProps = {
  item: CategoryItem;
  onPress: () => void;
};

function CategoryGridCard({
  item,
  onPress,
}: CategoryGridCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="h-40 flex-1 overflow-hidden rounded-[22px] bg-slate-900 active:opacity-80"
    >
      <Image
        source={{
          uri: item.image,
        }}
        resizeMode="cover"
        className="h-full w-full"
      />

      <View className="absolute inset-0 bg-black/35" />

      <View className="absolute inset-x-0 bottom-0 p-4">
        <Text
          numberOfLines={1}
          className="text-lg font-black text-white"
        >
          {item.label}
        </Text>

        <View className="mt-2 flex-row items-center">
          <Text className="text-xs font-semibold text-white/80">
            View news
          </Text>

          <Ionicons
            name="arrow-forward"
            size={14}
            color="#FFFFFF"
            style={{
              marginLeft: 5,
            }}
          />
        </View>
      </View>
    </Pressable>
  );
}