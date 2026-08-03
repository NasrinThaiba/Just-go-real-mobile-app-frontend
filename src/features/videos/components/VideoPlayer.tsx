import { View } from 'react-native';
import { useVideoPlayer, VideoView } from 'expo-video';
import YoutubePlayer from 'react-native-youtube-iframe';

type VideoPlayerProps = {
  mediaUrl: string;
  videoSource?: 'direct' | 'youtube';
  youtubeVideoId?: string;
  height?: number;
  autoPlay?: boolean;
};

function extractYouTubeVideoId(value?: string): string | null {
  if (!value) return null;

  const trimmed = value.trim();

  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed;
  }

  const match = trimmed.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|shorts\/|embed\/|live\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/,
  );

  return match?.[1] ?? null;
}

function DirectVideoPlayer({
  uri,
  height,
  autoPlay,
}: {
  uri: string;
  height: number;
  autoPlay: boolean;
}) {
  const player = useVideoPlayer(uri, (videoPlayer) => {
    videoPlayer.loop = false;

    if (autoPlay) {
      videoPlayer.play();
    }
  });

  return (
    <VideoView
      player={player}
      nativeControls
      contentFit="contain"
      style={{
        width: '100%',
        height,
        backgroundColor: '#000000',
      }}
    />
  );
}

export function VideoPlayer({
  mediaUrl,
  videoSource = 'direct',
  youtubeVideoId,
  height = 300,
  autoPlay = false,
}: VideoPlayerProps) {
  const resolvedYouTubeVideoId =
    youtubeVideoId ?? extractYouTubeVideoId(mediaUrl);

  const isYouTubeVideo =
    videoSource === 'youtube' ||
    Boolean(resolvedYouTubeVideoId);

  if (isYouTubeVideo && resolvedYouTubeVideoId) {
    return (
      <View
        style={{
          width: '100%',
          height,
          backgroundColor: '#000000',
        }}
      >
        <YoutubePlayer
          height={height}
          videoId={resolvedYouTubeVideoId}
          play={autoPlay}
          webViewStyle={{
            backgroundColor: '#000000',
          }}
        />
      </View>
    );
  }

  return (
    <DirectVideoPlayer
      uri={mediaUrl}
      height={height}
      autoPlay={autoPlay}
    />
  );
}