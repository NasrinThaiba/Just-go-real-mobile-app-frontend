import { Image, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useVideoPlayer, VideoView } from 'expo-video';

import type { FeedItem } from '@/features/news/types/news.types';
import { getYoutubeThumbnail } from '@/utils/getYoutubeThumbnail';

type BreakingVideoSlideProps = {
  item: FeedItem;
  active?: boolean;
};

export function BreakingVideoSlide({
  item,
  active = false,
}: BreakingVideoSlideProps) {
  if (item.videoSource === 'youtube') {
    return (
      <View className="h-full w-full">
        <Image
          source={{
            uri: item.thumbnailUrl || getYoutubeThumbnail(item.mediaUrl),
          }}
          resizeMode="cover"
          className="h-full w-full"
        />

        <View className="absolute inset-0 items-center justify-center bg-black/20">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-black/65">
            <Ionicons name="play" size={27} color="#FFFFFF" />
          </View>
        </View>
      </View>
    );
  }

  return <DirectVideo mediaUrl={item.mediaUrl} active={active} />;
}

function DirectVideo({
  mediaUrl,
  active,
}: {
  mediaUrl: string;
  active: boolean;
}) {
  const player = useVideoPlayer(mediaUrl, (videoPlayer) => {
    videoPlayer.loop = true;
    videoPlayer.muted = true;
  });

  if (active) {
    player.play();
  } else {
    player.pause();
  }

  return (
    <VideoView
      player={player}
      contentFit="cover"
      nativeControls={false}
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
}
