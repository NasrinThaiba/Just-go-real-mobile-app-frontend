import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Alert,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import Toast from 'react-native-toast-message';

import type {
  StoredComment,
} from '@/features/interactions/types/interaction.types';
import { formatRelativeDate } from '@/utils/formatDate';

type InlineCommentsProps = {
  comments: StoredComment[];
  language: 'en' | 'ta';

  currentUserId?: string;
  isAdmin?: boolean;
  isUserLoading?: boolean;

  onAddComment: (
    message: string,
  ) => Promise<unknown>;

  onDeleteComment: (
    commentId: string,
  ) => Promise<unknown>;
};

export function InlineComments({
  comments,
  language,
  currentUserId,
  isAdmin = false,
  isUserLoading = false,
  onAddComment,
  onDeleteComment,
}: InlineCommentsProps) {
  const [
    message,
    setMessage,
  ] = useState('');

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    deletingCommentId,
    setDeletingCommentId,
  ] = useState<string | null>(
    null,
  );

  const submitComment =
    async () => {
      const trimmedMessage =
        message.trim();

      if (
        !trimmedMessage ||
        isSubmitting ||
        isUserLoading
      ) {
        return;
      }

      try {
        setIsSubmitting(true);

        await onAddComment(
          trimmedMessage,
        );

        setMessage('');

        Toast.show({
          type: 'success',
          text1: 'Comment added',
          position: 'top',
          visibilityTime: 1200,
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1:
            error instanceof Error
              ? error.message
              : 'Unable to add comment',
          position: 'top',
        });
      } finally {
        setIsSubmitting(false);
      }
    };

  const removeComment =
    async (
      commentId: string,
    ) => {
      if (deletingCommentId) {
        return;
      }

      try {
        setDeletingCommentId(
          commentId,
        );

        await onDeleteComment(
          commentId,
        );

        Toast.show({
          type: 'success',
          text1: 'Comment deleted',
          position: 'top',
          visibilityTime: 1200,
        });
      } catch (error) {
        Toast.show({
          type: 'error',
          text1:
            error instanceof Error
              ? error.message
              : 'Unable to delete comment',
          position: 'top',
        });
      } finally {
        setDeletingCommentId(
          null,
        );
      }
    };

  const confirmDelete = (
    commentId: string,
  ) => {
    if (Platform.OS === 'web') {
      const confirmed =
        window.confirm(
          'Delete this comment permanently?',
        );

      if (confirmed) {
        void removeComment(
          commentId,
        );
      }

      return;
    }

    Alert.alert(
      'Delete comment?',
      'This comment will be permanently deleted.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: () => {
            void removeComment(
              commentId,
            );
          },
        },
      ],
    );
  };

  return (
    <View className="mt-5 pt-4">
      <View className="flex-row items-center">
        <Text className="text-[15px] font-black text-textMain">
          Comments
        </Text>

        <Text className="ml-2 text-sm font-semibold text-textMuted">
          {comments.length}
        </Text>
      </View>

      {comments.length > 0 ? (
        <View className="mt-4">
          {comments.map(
            (comment) => {
              const isOwner =
                Boolean(
                  currentUserId,
                ) &&
                Boolean(
                  comment.authorId,
                ) &&
                comment.authorId ===
                  currentUserId;

              const canDelete =
                isOwner ||
                isAdmin;

              const isDeleting =
                deletingCommentId ===
                comment.id;

              const authorInitial =
                comment.author
                  ?.trim()
                  .charAt(0)
                  .toUpperCase() ||
                'U';

              return (
                <View
                  key={comment.id}
                  className="mb-4 flex-row items-start"
                >
                  <View className="h-9 w-9 items-center justify-center rounded-full bg-primarySoft">
                    <Text className="text-xs font-black text-primary">
                      {authorInitial}
                    </Text>
                  </View>

                  <View className="ml-3 flex-1 rounded-2xl bg-slate-50 px-4 py-3">
                    <View className="flex-row items-start justify-between">
                      <View className="mr-2 flex-1">
                        <Text
                          numberOfLines={1}
                          className="text-sm font-extrabold text-textMain"
                        >
                          {comment.author}
                        </Text>

                        <Text className="mt-0.5 text-[10px] text-textMuted">
                          {formatRelativeDate(
                            comment.createdAt,
                            language,
                          )}
                        </Text>
                      </View>

                      {canDelete ? (
                        <Pressable
                          onPress={() =>
                            confirmDelete(
                              comment.id,
                            )
                          }
                          disabled={
                            isDeleting ||
                            isUserLoading
                          }
                          hitSlop={8}
                          accessibilityRole="button"
                          accessibilityLabel="Delete comment"
                          className={`h-9 w-9 items-center justify-center rounded-full bg-red-50 ${
                            isDeleting ||
                            isUserLoading
                              ? 'opacity-40'
                              : ''
                          }`}
                        >
                          <Ionicons
                            name={
                              isDeleting
                                ? 'hourglass-outline'
                                : 'trash-outline'
                            }
                            size={17}
                            color="#DC2626"
                          />
                        </Pressable>
                      ) : null}
                    </View>

                    <Text className="mt-2 text-sm leading-5 text-slate-700">
                      {comment.message}
                    </Text>
                  </View>
                </View>
              );
            },
          )}
        </View>
      ) : (
        <View className="py-5">
          <Text className="text-sm font-bold text-textMuted">
            No comments yet
          </Text>

          <Text className="mt-1 text-xs text-slate-400">
            Be the first to comment
          </Text>
        </View>
      )}

      <View className="mt-2 flex-row items-end rounded-2xl border border-borderSoft bg-slate-50 px-3 py-2">
        <TextInput
          value={message}
          onChangeText={
            setMessage
          }
          placeholder={
            isUserLoading
              ? 'Loading your profile...'
              : 'Write a comment...'
          }
          placeholderTextColor="#98A2B3"
          editable={
            !isUserLoading
          }
          multiline
          maxLength={500}
          textAlignVertical="top"
          className="max-h-24 min-h-10 flex-1 px-1 py-2 text-sm text-textMain"
        />

        <Pressable
          onPress={() =>
            void submitComment()
          }
          disabled={
            isSubmitting ||
            isUserLoading ||
            !message.trim()
          }
          accessibilityRole="button"
          accessibilityLabel="Send comment"
          className={`ml-2 h-9 w-9 items-center justify-center rounded-full bg-primary ${
            isSubmitting ||
            isUserLoading ||
            !message.trim()
              ? 'opacity-40'
              : ''
          }`}
        >
          <Ionicons
            name={
              isSubmitting ||
              isUserLoading
                ? 'hourglass-outline'
                : 'send'
            }
            size={17}
            color="#FFFFFF"
          />
        </Pressable>
      </View>
    </View>
  );
}