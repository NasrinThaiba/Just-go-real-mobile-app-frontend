import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

import type {
  StoredComment,
} from '@/features/interactions/types/interaction.types';
import { formatRelativeDate } from '@/utils/formatData';

type CommentsModalProps = {
  visible: boolean;
  comments: StoredComment[];
  language: 'en' | 'ta';
  onClose: () => void;
  onAddComment: (
    message: string,
  ) => Promise<unknown>;
  onDeleteComment: (
    commentId: string,
  ) => Promise<unknown>;
};

export function CommentsModal({
  visible,
  comments,
  language,
  onClose,
  onAddComment,
  onDeleteComment,
}: CommentsModalProps) {
  const [message, setMessage] =
    useState('');

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const submitComment = async () => {
    const trimmedMessage =
      message.trim();

    if (!trimmedMessage) {
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
      });
    } catch (error) {
      console.error(
        'Add comment failed:',
        error,
      );

      Toast.show({
        type: 'error',
        text1:
          'Unable to add comment',
        position: 'top',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const removeComment = async (
    commentId: string,
  ) => {
    try {
      await onDeleteComment(
        commentId,
      );

      Toast.show({
        type: 'success',
        text1: 'Comment deleted',
        position: 'top',
      });
    } catch (error) {
      console.error(
        'Delete comment failed:',
        error,
      );
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        <KeyboardAvoidingView
          behavior={
            Platform.OS === 'ios'
              ? 'padding'
              : undefined
          }
          className="flex-1"
        >
          <View className="h-14 flex-row items-center justify-between border-b border-borderSoft px-4">
            <Text className="text-xl font-black text-textMain">
              Comments
            </Text>

            <Pressable
              onPress={onClose}
              hitSlop={10}
              className="h-10 w-10 items-center justify-center rounded-full bg-slate-100"
            >
              <Ionicons
                name="close"
                size={22}
                color="#121826"
              />
            </Pressable>
          </View>

          <ScrollView
            className="flex-1"
            contentContainerStyle={{
              padding: 16,
              flexGrow: 1,
            }}
            keyboardShouldPersistTaps="handled"
          >
            {comments.length > 0 ? (
              comments.map(
                (comment) => (
                  <View
                    key={comment.id}
                    className="mb-3 rounded-2xl bg-slate-50 p-4"
                  >
                    <View className="flex-row items-start justify-between">
                      <View className="flex-1">
                        <Text className="text-sm font-extrabold text-textMain">
                          {comment.author}
                        </Text>

                        <Text className="mt-1 text-xs text-textMuted">
                          {formatRelativeDate(
                            comment.createdAt,
                            language,
                          )}
                        </Text>
                      </View>

                      <Pressable
                        onPress={() =>
                          void removeComment(
                            comment.id,
                          )
                        }
                        hitSlop={8}
                      >
                        <Ionicons
                          name="trash-outline"
                          size={18}
                          color="#DC2626"
                        />
                      </Pressable>
                    </View>

                    <Text className="mt-3 text-sm leading-6 text-slate-700">
                      {comment.message}
                    </Text>
                  </View>
                ),
              )
            ) : (
              <View className="flex-1 items-center justify-center py-16">
                <Ionicons
                  name="chatbubbles-outline"
                  size={48}
                  color="#98A2B3"
                />

                <Text className="mt-3 font-bold text-textMuted">
                  No comments yet
                </Text>

                <Text className="mt-1 text-sm text-slate-400">
                  Be the first to comment
                </Text>
              </View>
            )}
          </ScrollView>

          <View className="flex-row items-end border-t border-borderSoft bg-white px-4 py-3">
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Write a comment..."
              multiline
              textAlignVertical="top"
              className="max-h-28 min-h-12 flex-1 rounded-2xl bg-slate-100 px-4 py-3 text-base text-textMain"
            />

            <Pressable
              onPress={() =>
                void submitComment()
              }
              disabled={
                isSubmitting ||
                !message.trim()
              }
              className={`ml-3 h-12 w-12 items-center justify-center rounded-full bg-primary ${
                isSubmitting ||
                !message.trim()
                  ? 'opacity-40'
                  : ''
              }`}
            >
              <Ionicons
                name="send"
                size={20}
                color="#FFFFFF"
              />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}