import YoutubePlayer from 'react-native-youtube-iframe';

type YouTubePlayerProps = {
  videoId: string;
  playing?: boolean;
};

export function YouTubeVideoPlayer({
  videoId,
  playing = false,
}: YouTubePlayerProps) {
  return (
    <YoutubePlayer
      height={230}
      play={playing}
      videoId={videoId}
    />
  );
}