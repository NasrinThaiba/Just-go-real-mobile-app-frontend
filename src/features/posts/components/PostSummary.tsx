import {
  Pressable,
  Text,
  View,
} from 'react-native';


import {
  PostSummaryCard,
} from '@/features/posts/components/PostSummaryCard';


import type {
  MyPostFilter,
} from '@/features/posts/hooks/useMyPosts';


type PostSummaryData = {

  totalPosts: number;

  totalNews: number;

  totalVideos: number;

  totalFavorites: number;

  totalViews: number;

  totalPublished: number;

};


type PostSummaryProps = {

  summary: PostSummaryData;

  activeFilter: MyPostFilter;

  filteredCount: number;

  onFilterChange: (
    filter: MyPostFilter,
  ) => void;

};


const FILTERS: {
  label: string;
  value: MyPostFilter;
}[] = [

  {
    label: 'All',
    value: 'all',
  },

  {
    label: 'News',
    value: 'news',
  },

  {
    label: 'Videos',
    value: 'video',
  },

  {
    label: 'Published',
    value: 'published',
  },

];


export function PostSummary({

  summary,

  activeFilter,

  filteredCount,

  onFilterChange,

}: PostSummaryProps) {


  return (

    <>

      {/* =========================
          TITLE
      ========================= */}

      <Text className="text-2xl font-black text-textMain">

        Your Content

      </Text>


      <Text className="mt-1 text-sm text-textMuted">

        Manage your submitted news and videos.

      </Text>



      {/* =========================
          SUMMARY CARDS
      ========================= */}

      <View
        className="
          mt-5
          flex-row
          flex-wrap
          justify-between
          gap-y-3
        "
      >

        {/* TOTAL POSTS */}

        <PostSummaryCard
          title="Total Posts"
          value={summary.totalPosts}
          icon="documents-outline"
          iconColor="#F0442D"
          iconBackground="#FFF1ED"
        />


        {/* NEWS */}

        <PostSummaryCard
          title="News"
          value={summary.totalNews}
          icon="newspaper-outline"
          iconColor="#2563EB"
          iconBackground="#EFF6FF"
        />


        {/* VIDEOS */}

        <PostSummaryCard
          title="Videos"
          value={summary.totalVideos}
          icon="play-circle-outline"
          iconColor="#7C3AED"
          iconBackground="#F5F3FF"
        />


        {/* VIEWS */}

        <PostSummaryCard
          title="Views"
          value={summary.totalViews}
          icon="eye-outline"
          iconColor="#059669"
          iconBackground="#ECFDF5"
        />


        {/* LIKES */}

        <PostSummaryCard
          title="Likes"
          value={summary.totalFavorites}
          icon="heart-outline"
          iconColor="#E11D48"
          iconBackground="#FFF1F2"
        />


        {/* PUBLISHED */}

        <PostSummaryCard
          title="Published"
          value={summary.totalPublished}
          icon="checkmark-circle-outline"
          iconColor="#16A34A"
          iconBackground="#ECFDF5"
        />

      </View>



      {/* =========================
          FILTER
      ========================= */}

      <View
        className="
          mt-6
          flex-row
          rounded-2xl
          border
          border-borderSoft
          bg-white
          p-1
        "
      >

        {FILTERS.map((filter) => {

          const selected =
            activeFilter === filter.value;


          return (

            <Pressable
              key={filter.value}
              onPress={() =>
                onFilterChange(
                  filter.value,
                )
              }
              className={`
                flex-1
                items-center
                rounded-xl
                py-3

                ${
                  selected
                    ? 'bg-primarySoft'
                    : 'bg-white'
                }
              `}
            >

              <Text
                className={`
                  text-sm
                  font-extrabold

                  ${
                    selected
                      ? 'text-primary'
                      : 'text-textMuted'
                  }
                `}
              >

                {filter.label}

              </Text>

            </Pressable>

          );

        })}

      </View>



      {/* =========================
          COUNT
      ========================= */}

      <View
        className="
          mb-4
          mt-5
          flex-row
          items-center
          justify-between
        "
      >

        <Text className="text-lg font-black text-textMain">

          {
            activeFilter === 'published'
              ? 'Published Posts'
              : 'Submitted Posts'
          }

        </Text>


        <Text className="text-sm font-bold text-textMuted">

          {filteredCount}

        </Text>

      </View>

    </>

  );

}