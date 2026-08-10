import { useState } from 'react';
import {
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

import { FavoriteButton } from '@/components/interactions/FavoriteButton';
import { CommentButton } from '@/components/interactions/CommentButton';
import { ShareButton } from '@/components/interactions/ShareButton';
import { InlineComments } from '@/components/interactions/InlineComments';

import { useCurrentInteractionUser } from '@/features/auth/hooks/useCurrentInteractionUser';
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
  const [ showComments,setShowComments ] = useState(false);
  const {
    currentUser,
    isLoading:
      isCurrentUserLoading,
  } = useCurrentInteractionUser();

  const {
    interaction,
    toggleFavorite,
    addComment,
    deleteComment,
  } = useContentInteractions(
    contentId,
    currentUser,
  );

  const totalLikes =
    initialLikes +
    (interaction.isFavorite
      ? 1
      : 0);

  const handleFavorite =
    async () => {
      try {
        const updated = await toggleFavorite();
        Toast.show({
          type: 'success',
          text1:
            updated.isFavorite
              ? 'Added to favorites'
              : 'Removed from favorites',
          position: 'top',
          visibilityTime: 1200,
        });
      } catch (error) {
        console.error('Favorite failed:', error);

        Toast.show({
          type: 'error',
          text1:
            'Unable to update favorite',
          position: 'top',
        });
      }
    };

  return (
    <View>
      <View className="flex-row items-center justify-between">
        <FavoriteButton
          selected={ interaction.isFavorite}
          count={ totalLikes }
          onPress={() =>
            void handleFavorite()
          }
        />

        <CommentButton
          count={interaction.comments.length}
          onPress={() =>
            setShowComments(
              (current) => !current,
            )
          }
        />

        <ShareButton
          title={title}
          description={description}
          url={shareUrl}
        />
      </View>

      {showComments ? (
        <InlineComments
          comments={interaction.comments}
          language={language}
          currentUserId={currentUser?.id}
          isAdmin={currentUser?.role === 'admin'}
          isUserLoading={isCurrentUserLoading}
          onAddComment={addComment}
          onDeleteComment={deleteComment}
        />
      ) : null}
    </View>
  );
}