import { useState } from 'react';
import {
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

import { FavoriteButton } from '@/components/interactions/FavoriteButton';
import { CommentButton } from '@/components/interactions/CommentButton';
import { ShareButton } from '@/components/interactions/ShareButton';
import { CommentsModal } from '@/components/interactions/CommentsModal';

import { useContentInteractions } from '@/features/interactions/hooks/useContentInteractions';

type ContentActionsProps = {
  contentId: string;
  title: string;
  description: string;
  initialLikes?: number;
  language: 'en' | 'ta';
  shareUrl?: string;
};

export function ContentActions({
  contentId,
  title,
  description,
  initialLikes = 0,
  language,
  shareUrl,
}: ContentActionsProps) {
  const [
    commentsVisible,
    setCommentsVisible,
  ] = useState(false);

  const {
    interaction,
    toggleFavorite,
    addComment,
    deleteComment,
  } = useContentInteractions(
    contentId,
  );

  const totalLikes =
    initialLikes +
    (interaction.isFavorite
      ? 1
      : 0);

  const handleFavorite =
    async () => {
      try {
        const updated =
          await toggleFavorite();

        Toast.show({
          type: 'success',
          text1:
            updated.isFavorite
              ? 'Added to favorites'
              : 'Removed from favorites',
          position: 'top',
        });
      } catch (error) {
        console.error(
          'Favorite failed:',
          error,
        );
      }
    };

  return (
    <>
      <View className="mt-8 flex-row items-center justify-between border-t border-borderSoft pt-5">
        <FavoriteButton
          selected={
            interaction.isFavorite
          }
          count={totalLikes}
          onPress={() =>
            void handleFavorite()
          }
        />

        <CommentButton
          count={
            interaction.comments
              .length
          }
          onPress={() =>
            setCommentsVisible(true)
          }
        />

        <ShareButton
          title={title}
          description={
            description
          }
          url={shareUrl}
        />
      </View>

      <CommentsModal
        visible={commentsVisible}
        comments={
          interaction.comments
        }
        language={language}
        onClose={() =>
          setCommentsVisible(false)
        }
        onAddComment={
          addComment
        }
        onDeleteComment={
          deleteComment
        }
      />
    </>
  );
}