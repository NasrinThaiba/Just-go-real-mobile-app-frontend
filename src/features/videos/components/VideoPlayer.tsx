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


function extractYouTubeVideoId(
  value?: string,
): string | undefined {

  if (!value) {
    return undefined;
  }

  const match = value.match(
    /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );

  return match?.[1];
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

  console.log('DIRECT VIDEO URI:', uri);

  const player = useVideoPlayer(
    uri,
    (player) => {

      player.loop = false;

      if (autoPlay) {
        player.play();
      }

    },
  );


  return (
    <VideoView
      player={player}
      nativeControls
      style={{
        width: '100%',
        height,
        backgroundColor: '#000',
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
    youtubeVideoId ||
    extractYouTubeVideoId(mediaUrl);


  const isYouTubeVideo =
    videoSource === 'youtube' &&
    Boolean(resolvedYouTubeVideoId);


  console.log(
    'VIDEO PLAYER:',
    {
      mediaUrl,
      videoSource,
      youtubeVideoId,
      resolvedYouTubeVideoId,
      isYouTubeVideo,
    },
  );


  if (
    isYouTubeVideo &&
    resolvedYouTubeVideoId
  ) {

    return (
      <View
        style={{
          width: '100%',
          height,
          backgroundColor: '#000',
        }}
      >

        <YoutubePlayer
          height={height}
          videoId={resolvedYouTubeVideoId}
          play={autoPlay}

          webViewProps={{
            allowsInlineMediaPlayback: true,
            javaScriptEnabled: true,
            domStorageEnabled: true,
            originWhitelist: ['*'],
          }}

          webViewStyle={{
            backgroundColor: '#000',
          }}

          initialPlayerParams={{
            controls: true,
            modestbranding: true,
            rel: false,
          }}
        />

      </View>
    );
  }


  if (!mediaUrl) {
    return (
      <View
        style={{
          width: '100%',
          height,
          backgroundColor: '#000',
        }}
      />
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