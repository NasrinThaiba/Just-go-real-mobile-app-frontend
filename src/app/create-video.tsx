import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
    useVideoPlayer,
    VideoView,
} from 'expo-video';
import { useEffect, useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    ScrollView,
    Text,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import YoutubePlayer from 'react-native-youtube-iframe';

import { AppButton } from '@/components/ui/AppButton';
import { AppInput } from '@/components/ui/AppInput';

import type {
    FeedItem,
    SupportedLanguage,
    VideoType,
} from '@/features/news/types/news.types';
import {
    getCreatedVideoById,
    saveCreatedVideo,
    updateCreatedVideo,
} from '@/features/videos/storage/videoStorage';

type CategoryValue =
  | 'politics'
  | 'business'
  | 'sports'
  | 'cinema'
  | 'technology'
  | 'science'
  | 'world'
  | 'education'
  | 'health';

type LocationValue =
  | 'tamil-nadu'
  | 'chennai'
  | 'coimbatore'
  | 'madurai'
  | 'tiruchirappalli'
  | 'salem'
  | 'tirunelveli'
  | 'tenkasi'
  | 'thoothukudi'
  | 'erode'
  | 'vellore';

type StepNumber = 1 | 2 | 3;
type SaveMode = 'publish' | 'draft';
type VideoSourceValue = 'direct' | 'youtube';

type DropdownOption<T extends string> = {
  label: string;
  value: T;
};

type DropdownProps<T extends string> = {
  label: string;
  placeholder: string;
  value: T | '';
  options: DropdownOption<T>[];
  onChange: (value: T) => void;
  icon: keyof typeof Ionicons.glyphMap;
  required?: boolean;
};

type ChoiceCardProps<T extends string> = {
  label: string;
  value: T;
  selected: boolean;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: (value: T) => void;
};

const LANGUAGE_OPTIONS: DropdownOption<SupportedLanguage>[] = [
  { label: 'English', value: 'en' },
  { label: 'தமிழ்', value: 'ta' },
];

const VIDEO_TYPE_OPTIONS: Array<
  DropdownOption<VideoType> & {
    icon: keyof typeof Ionicons.glyphMap;
  }
> = [
  {
    label: 'News',
    value: 'news',
    icon: 'newspaper-outline',
  },
  {
    label: 'Breaking',
    value: 'breaking',
    icon: 'flash-outline',
  },
  {
    label: 'Live',
    value: 'live',
    icon: 'radio-outline',
  },
  {
    label: 'Interview',
    value: 'interview',
    icon: 'mic-outline',
  },
  {
    label: 'Short',
    value: 'short',
    icon: 'play-circle-outline',
  },
  {
    label: 'Featured',
    value: 'featured',
    icon: 'star-outline',
  },
];

const CATEGORY_OPTIONS: Array<
  DropdownOption<CategoryValue> & {
    icon: keyof typeof Ionicons.glyphMap;
  }
> = [
  {
    label: 'Politics',
    value: 'politics',
    icon: 'business-outline',
  },
  {
    label: 'Business',
    value: 'business',
    icon: 'bar-chart-outline',
  },
  {
    label: 'Sports',
    value: 'sports',
    icon: 'football-outline',
  },
  {
    label: 'Cinema',
    value: 'cinema',
    icon: 'film-outline',
  },
  {
    label: 'Technology',
    value: 'technology',
    icon: 'hardware-chip-outline',
  },
  {
    label: 'Science',
    value: 'science',
    icon: 'flask-outline',
  },
  {
    label: 'World',
    value: 'world',
    icon: 'earth-outline',
  },
  {
    label: 'Education',
    value: 'education',
    icon: 'school-outline',
  },
  {
    label: 'Health',
    value: 'health',
    icon: 'medkit-outline',
  },
];

const LOCATION_OPTIONS: DropdownOption<LocationValue>[] = [
  { label: 'Tamil Nadu', value: 'tamil-nadu' },
  { label: 'Chennai', value: 'chennai' },
  { label: 'Coimbatore', value: 'coimbatore' },
  { label: 'Madurai', value: 'madurai' },
  { label: 'Tiruchirappalli', value: 'tiruchirappalli' },
  { label: 'Salem', value: 'salem' },
  { label: 'Tirunelveli', value: 'tirunelveli' },
  { label: 'Tenkasi', value: 'tenkasi' },
  { label: 'Thoothukudi', value: 'thoothukudi' },
  { label: 'Erode', value: 'erode' },
  { label: 'Vellore', value: 'vellore' },
];

function extractYouTubeVideoId(
  value: string,
): string | null {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return null;
  }

  const directIdPattern =
    /^[a-zA-Z0-9_-]{11}$/;

  if (directIdPattern.test(trimmedValue)) {
    return trimmedValue;
  }

  const patterns = [
    /(?:youtube\.com\/watch\?(?:.*&)?v=)([a-zA-Z0-9_-]{11})/,
    /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/shorts\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /(?:youtube\.com\/live\/)([a-zA-Z0-9_-]{11})/,
  ];

  for (const pattern of patterns) {
    const match =
      trimmedValue.match(pattern);

    if (match?.[1]) {
      return match[1];
    }
  }

  return null;
}

function ChoiceCard<T extends string>({
  label,
  value,
  selected,
  icon,
  onPress,
}: ChoiceCardProps<T>) {
  return (
    <Pressable
      onPress={() => onPress(value)}
      className={`mr-3 min-w-[104px] items-center justify-center rounded-2xl border px-4 py-4 active:opacity-70 ${
        selected
          ? 'border-primary bg-primarySoft'
          : 'border-borderSoft bg-slate-50'
      }`}
    >
      <Ionicons
        name={icon}
        size={23}
        color={selected ? '#F0442D' : '#121826'}
      />

      <Text
        className={`mt-2 text-sm font-extrabold ${
          selected ? 'text-primary' : 'text-textMain'
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function Dropdown<T extends string>({
  label,
  placeholder,
  value,
  options,
  onChange,
  icon,
  required = false,
}: DropdownProps<T>) {
  const [visible, setVisible] =
    useState(false);

  const selectedOption =
    options.find(
      (option) =>
        option.value === value,
    );

  return (
    <>
      <Text className="mb-2 text-sm font-extrabold text-textMain">
        {label}
        {required ? (
          <Text className="text-primary">
            {' '}*
          </Text>
        ) : null}
      </Text>

      <Pressable
        onPress={() =>
          setVisible(true)
        }
        className="h-14 flex-row items-center rounded-2xl border border-borderSoft bg-white px-4 active:opacity-70"
      >
        <View className="h-9 w-9 items-center justify-center rounded-full bg-slate-100">
          <Ionicons
            name={icon}
            size={19}
            color="#344054"
          />
        </View>

        <Text
          numberOfLines={1}
          className={`ml-3 flex-1 text-base ${
            selectedOption
              ? 'font-bold text-textMain'
              : 'text-slate-400'
          }`}
        >
          {selectedOption?.label ??
            placeholder}
        </Text>

        <Ionicons
          name="chevron-down"
          size={20}
          color="#667085"
        />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="fade"
        onRequestClose={() =>
          setVisible(false)
        }
      >
        <Pressable
          onPress={() =>
            setVisible(false)
          }
          className="flex-1 justify-end bg-black/45"
        >
          <Pressable
            onPress={(event) =>
              event.stopPropagation()
            }
            className="max-h-[72%] rounded-t-[28px] bg-white"
          >
            <View className="flex-row items-center justify-between border-b border-borderSoft px-5 py-4">
              <View>
                <Text className="text-xl font-black text-textMain">
                  Select {label}
                </Text>

                <Text className="mt-1 text-sm text-textMuted">
                  Choose one option to continue
                </Text>
              </View>

              <Pressable
                onPress={() =>
                  setVisible(false)
                }
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
              contentContainerStyle={{
                padding: 16,
                paddingBottom: 34,
              }}
              showsVerticalScrollIndicator={
                false
              }
            >
              {options.map(
                (option) => {
                  const selected =
                    option.value ===
                    value;

                  return (
                    <Pressable
                      key={
                        option.value
                      }
                      onPress={() => {
                        onChange(
                          option.value,
                        );
                        setVisible(false);
                      }}
                      className={`mb-3 flex-row items-center justify-between rounded-2xl border px-4 py-4 ${
                        selected
                          ? 'border-primary bg-primarySoft'
                          : 'border-borderSoft bg-slate-50'
                      }`}
                    >
                      <Text
                        className={`text-base font-extrabold ${
                          selected
                            ? 'text-primary'
                            : 'text-textMain'
                        }`}
                      >
                        {
                          option.label
                        }
                      </Text>

                      {selected ? (
                        <Ionicons
                          name="checkmark-circle"
                          size={23}
                          color="#F0442D"
                        />
                      ) : null}
                    </Pressable>
                  );
                },
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}

function getOptionLabel<
  T extends string,
>(
  options: DropdownOption<T>[],
  value: T | '',
) {
  return (
    options.find(
      (option) =>
        option.value === value,
    )?.label ?? ''
  );
}

function Stepper({
  activeStep,
  onStepPress,
}: {
  activeStep: StepNumber;
  onStepPress: (
    step: StepNumber,
  ) => void;
}) {
  const steps: {
    number: StepNumber;
    label: string;
  }[] = [
    {
      number: 1,
      label: 'Content',
    },
    {
      number: 2,
      label: 'Preview',
    },
    {
      number: 3,
      label: 'Publish',
    },
  ];

  return (
    <View className="mt-5 flex-row items-center justify-center">
      {steps.map(
        (step, index) => {
          const active =
            activeStep ===
            step.number;

          const completed =
            activeStep >
            step.number;

          return (
            <View
              key={
                step.number
              }
              className="flex-row items-center"
            >
              <Pressable
                onPress={() =>
                  onStepPress(
                    step.number,
                  )
                }
                hitSlop={8}
                className="flex-row items-center"
              >
                <View
                  className={`h-8 w-8 items-center justify-center rounded-full ${
                    active ||
                    completed
                      ? 'bg-primary'
                      : 'border border-slate-300 bg-white'
                  }`}
                >
                  {completed ? (
                    <Ionicons
                      name="checkmark"
                      size={17}
                      color="#FFFFFF"
                    />
                  ) : (
                    <Text
                      className={`text-sm font-black ${
                        active
                          ? 'text-white'
                          : 'text-textMuted'
                      }`}
                    >
                      {
                        step.number
                      }
                    </Text>
                  )}
                </View>

                <Text
                  className={`ml-2 text-sm ${
                    active
                      ? 'font-extrabold text-primary'
                      : 'font-semibold text-textMuted'
                  }`}
                >
                  {
                    step.label
                  }
                </Text>
              </Pressable>

              {index <
              steps.length -
                1 ? (
                <View
                  className={`mx-3 h-px w-8 ${
                    completed
                      ? 'bg-primary'
                      : 'bg-slate-300'
                  }`}
                />
              ) : null}
            </View>
          );
        },
      )}
    </View>
  );
}

function SelectedVideoPreview({
  uri,
  active = false,
}: {
  uri: string;
  active?: boolean;
}) {
  const player =
    useVideoPlayer(
      uri,
      (
        videoPlayer,
      ) => {
        videoPlayer.loop =
          true;
      },
    );

  useEffect(() => {
    if (active) {
      player.play();
    } else {
      player.pause();
    }
  }, [active, player]);

  return (
    <VideoView
      player={player}
      nativeControls
      contentFit="contain"
      style={{
        width: '100%',
        height: '100%',
      }}
    />
  );
}

export default function CreateVideoScreen() {
  const router = useRouter();

  const params =
    useLocalSearchParams<{
      id?: string;
      mode?: string;
    }>();

  const editingVideoId =
    typeof params.id ===
    'string'
      ? params.id
      : undefined;

  const isEditMode =
    params.mode ===
      'edit' &&
    Boolean(
      editingVideoId,
    );

  const [
    activeStep,
    setActiveStep,
  ] =
    useState<StepNumber>(
      1,
    );

  const [
    title,
    setTitle,
  ] = useState('');

  const [
    description,
    setDescription,
  ] = useState('');

  const [
    language,
    setLanguage,
  ] =
    useState<
      SupportedLanguage | ''
    >('');

  const [
    videoType,
    setVideoType,
  ] =
    useState<
      VideoType | ''
    >('news');

  const [
    category,
    setCategory,
  ] =
    useState<
      CategoryValue | ''
    >('');

  const [
    location,
    setLocation,
  ] =
    useState<
      LocationValue | ''
    >('');

  const [
    videoSource,
    setVideoSource,
  ] =
    useState<VideoSourceValue>(
      'direct',
    );

  const [
    videoUri,
    setVideoUri,
  ] =
    useState<string | null>(
      null,
    );

  const [
    youtubeUrl,
    setYoutubeUrl,
  ] = useState('');

  const [
    youtubeVideoId,
    setYoutubeVideoId,
  ] =
    useState<string | null>(
      null,
    );

  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    isLoadingPost,
    setIsLoadingPost,
  ] = useState(false);

  useEffect(() => {
    const loadExistingVideo =
      async () => {
        if (
          !isEditMode ||
          !editingVideoId
        ) {
          return;
        }

        try {
          setIsLoadingPost(
            true,
          );

          const existingVideo =
            await getCreatedVideoById(
              editingVideoId,
            );

          if (
            !existingVideo
          ) {
            Toast.show({
              type: 'error',
              text1:
                'Video not found',
              text2:
                'Unable to load this video post.',
            });

            router.back();
            return;
          }

          setTitle(
            existingVideo.title ??
              '',
          );

          setDescription(
            existingVideo.description ??
              '',
          );

          setLanguage(
            existingVideo.language,
          );

          setVideoType(
            existingVideo.videoType ??
              'news',
          );

          setCategory(
            existingVideo.category as CategoryValue,
          );

          setLocation(
            existingVideo.location as LocationValue,
          );

          const existingSource =
            existingVideo.videoSource ===
              'youtube' &&
            existingVideo.youtubeVideoId
              ? 'youtube'
              : 'direct';

          setVideoSource(
            existingSource,
          );

          if (
            existingSource ===
            'youtube'
          ) {
            const existingId =
              existingVideo.youtubeVideoId ??
              extractYouTubeVideoId(
                existingVideo.mediaUrl,
              );

            setYoutubeVideoId(
              existingId,
            );

            setYoutubeUrl(
              existingId
                ? `https://www.youtube.com/watch?v=${existingId}`
                : existingVideo.mediaUrl,
            );

            setVideoUri(null);
          } else {
            setVideoUri(
              existingVideo.mediaUrl ??
                null,
            );

            setYoutubeUrl('');
            setYoutubeVideoId(
              null,
            );
          }
        } catch (error) {
          console.error(
            'Failed to load video:',
            error,
          );

          Toast.show({
            type: 'error',
            text1:
              'Unable to load video',
            text2:
              'Please try again.',
          });
        } finally {
          setIsLoadingPost(
            false,
          );
        }
      };

    void loadExistingVideo();
  }, [
    editingVideoId,
    isEditMode,
    router,
  ]);

  const chooseVideo =
    async () => {
      try {
        const permission =
          await ImagePicker.requestMediaLibraryPermissionsAsync();

        if (
          !permission.granted
        ) {
          Toast.show({
            type: 'error',
            text1:
              'Permission required',
            text2:
              'Allow gallery access to select a video.',
          });

          return;
        }

        const result =
          await ImagePicker.launchImageLibraryAsync(
            {
              mediaTypes: [
                'videos',
              ],
              allowsEditing:
                false,
              quality: 1,
              videoMaxDuration:
                300,
            },
          );

        if (
          !result.canceled &&
          result.assets[0]
            ?.uri
        ) {
          setVideoUri(
            result.assets[0]
              .uri,
          );
        }
      } catch (error) {
        console.error(
          'Video selection failed:',
          error,
        );

        Toast.show({
          type: 'error',
          text1:
            'Video selection failed',
          text2:
            'Unable to select the video.',
        });
      }
    };

  const handleYouTubeUrlChange =
    (value: string) => {
      setYoutubeUrl(value);

      setYoutubeVideoId(
        extractYouTubeVideoId(
          value,
        ),
      );
    };

  const selectVideoSource =
    (
      source: VideoSourceValue,
    ) => {
      setVideoSource(source);

      if (
        source ===
        'direct'
      ) {
        setYoutubeUrl('');
        setYoutubeVideoId(
          null,
        );
      } else {
        setVideoUri(null);
      }
    };

  const hasValidVideo =
    videoSource === 'direct'
      ? Boolean(videoUri)
      : Boolean(
          youtubeVideoId,
        );

  const validateForPublish =
    () => {
      const checks = [
        [
          title.trim(),
          'Title required',
          'Enter the video title.',
        ],
        [
          category,
          'Category required',
          'Select a video category.',
        ],
        [
          videoType,
          'Video type required',
          'Select the type of video.',
        ],
        [
          description.trim(),
          'Description required',
          'Enter the video description.',
        ],
        [
          hasValidVideo,
          'Video required',
          videoSource ===
          'youtube'
            ? 'Enter a valid YouTube URL.'
            : 'Select a video from the gallery.',
        ],
        [
          language,
          'Language required',
          'Select the video language.',
        ],
        [
          location,
          'Location required',
          'Select the video location.',
        ],
      ] as const;

      const failed =
        checks.find(
          ([condition]) =>
            !condition,
        );

      if (failed) {
        Toast.show({
          type: 'error',
          text1:
            failed[1],
          text2:
            failed[2],
        });

        return false;
      }

      return true;
    };

  const validateForDraft =
    () => {
      if (
        !title.trim()
      ) {
        Toast.show({
          type: 'error',
          text1:
            'Title required',
          text2:
            'Enter at least a title before saving the draft.',
        });

        return false;
      }

      return true;
    };

  const goToStep = (
    step: StepNumber,
  ) => {
    if (step === 1) {
      setActiveStep(1);
      return;
    }

    if (
      !validateForPublish()
    ) {
      return;
    }

    setActiveStep(step);
  };

  const saveVideo =
    async (
      mode: SaveMode,
    ) => {
      const isDraft =
        mode === 'draft';

      if (
        isDraft
          ? !validateForDraft()
          : !validateForPublish()
      ) {
        return;
      }

      const finalLanguage =
        language || 'en';

      const finalVideoType =
        videoType || 'news';

      const finalCategory =
        category || 'world';

      const finalLocation =
        location ||
        'tamil-nadu';

      const finalMediaUrl =
        videoSource ===
          'youtube' &&
        youtubeVideoId
          ? `https://www.youtube.com/watch?v=${youtubeVideoId}`
          : videoUri ?? '';

      const thumbnailUrl =
        videoSource ===
          'youtube' &&
        youtubeVideoId
          ? `https://img.youtube.com/vi/${youtubeVideoId}/hqdefault.jpg`
          : undefined;

      try {
        setIsSaving(true);

        const now =
          new Date().toISOString();

        const status =
          isDraft
            ? 'draft'
            : 'pending';

        if (
          isEditMode &&
          editingVideoId
        ) {
          await updateCreatedVideo(
            editingVideoId,
            {
              title:
                title.trim(),
              description:
                description.trim(),
              videoType:
                finalVideoType,
              language:
                finalLanguage,
              category:
                finalCategory,
              location:
                finalLocation,
              mediaUrl:
                finalMediaUrl,
              videoSource,
              youtubeVideoId:
                videoSource ===
                'youtube'
                  ? youtubeVideoId ??
                    undefined
                  : undefined,
              thumbnailUrl,
              status,
              publishedAt:
                undefined,
            },
          );
        } else {
          const createdVideo: FeedItem =
            {
              id: `local-video-${Date.now()}`,
              title:
                title.trim(),
              description:
                description.trim(),
              type: 'video',
              videoType:
                finalVideoType,
              language:
                finalLanguage,
              category:
                finalCategory,
              location:
                finalLocation,
              mediaUrl:
                finalMediaUrl,
              videoSource,
              youtubeVideoId:
                videoSource ===
                'youtube'
                  ? youtubeVideoId ??
                    undefined
                  : undefined,
              thumbnailUrl,
              author:
                'Local User',
              views: 0,
              likes: 0,
              status,
              createdAt:
                now,
            };

          await saveCreatedVideo(
            createdVideo,
          );
        }

        Toast.show({
          type: 'success',
          text1: isDraft
            ? 'Draft saved'
            : isEditMode
              ? 'Video updated'
              : 'Video submitted',
          text2: isDraft
            ? 'You can continue editing it from My Posts.'
            : 'Your video is waiting for admin approval.',
          visibilityTime:
            1600,
        });

        setTimeout(() => {
          router.replace(
            '/my-posts',
          );
        }, 700);
      } catch (error) {
        console.error(
          'Video save failed:',
          error,
        );

        Toast.show({
          type: 'error',
          text1: isDraft
            ? 'Draft save failed'
            : isEditMode
              ? 'Update failed'
              : 'Submission failed',
          text2:
            'Unable to save the video.',
        });
      } finally {
        setIsSaving(false);
      }
    };

  const renderVideoSourceSelector =
    () => (
      <>
        <Text className="mb-3 mt-6 text-sm font-extrabold text-textMain">
          Video Source
          <Text className="text-primary">
            {' '}*
          </Text>
        </Text>

        <View className="flex-row gap-3">
          <Pressable
            onPress={() =>
              selectVideoSource(
                'direct',
              )
            }
            className={`flex-1 items-center rounded-2xl border px-4 py-4 active:opacity-70 ${
              videoSource ===
              'direct'
                ? 'border-primary bg-primarySoft'
                : 'border-borderSoft bg-slate-50'
            }`}
          >
            <Ionicons
              name="cloud-upload-outline"
              size={24}
              color={
                videoSource ===
                'direct'
                  ? '#F0442D'
                  : '#121826'
              }
            />

            <Text
              className={`mt-2 text-sm font-extrabold ${
                videoSource ===
                'direct'
                  ? 'text-primary'
                  : 'text-textMain'
              }`}
            >
              Upload Video
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              selectVideoSource(
                'youtube',
              )
            }
            className={`flex-1 items-center rounded-2xl border px-4 py-4 active:opacity-70 ${
              videoSource ===
              'youtube'
                ? 'border-primary bg-primarySoft'
                : 'border-borderSoft bg-slate-50'
            }`}
          >
            <Ionicons
              name="logo-youtube"
              size={24}
              color={
                videoSource ===
                'youtube'
                  ? '#F0442D'
                  : '#121826'
              }
            />

            <Text
              className={`mt-2 text-sm font-extrabold ${
                videoSource ===
                'youtube'
                  ? 'text-primary'
                  : 'text-textMain'
              }`}
            >
              YouTube URL
            </Text>
          </Pressable>
        </View>
      </>
    );

  const renderVideoInput =
    () => {
      if (
        videoSource ===
        'youtube'
      ) {
        return (
          <>
            <Text className="mb-2 mt-6 text-sm font-extrabold text-textMain">
              YouTube URL
              <Text className="text-primary">
                {' '}*
              </Text>
            </Text>

            <AppInput
              value={
                youtubeUrl
              }
              onChangeText={
                handleYouTubeUrlChange
              }
              placeholder="https://www.youtube.com/watch?v=..."
              autoCapitalize="none"
              autoCorrect={false}
            />

            {youtubeUrl &&
            !youtubeVideoId ? (
              <Text className="mt-2 text-sm font-semibold text-red-500">
                Enter a valid YouTube URL
              </Text>
            ) : null}

            {youtubeVideoId ? (
              <View className="mt-4 overflow-hidden rounded-3xl bg-black">
                <YoutubePlayer
                  height={230}
                  videoId={
                    youtubeVideoId
                  }
                  play={false}
                  webViewStyle={{
                    backgroundColor:
                      '#000000',
                  }}
                />
              </View>
            ) : null}
          </>
        );
      }

      return (
        <>
          <Text className="mb-2 mt-6 text-sm font-extrabold text-textMain">
            Video Upload
            <Text className="text-primary">
              {' '}*
            </Text>
          </Text>

          <Pressable
            onPress={() =>
              void chooseVideo()
            }
            className="min-h-56 overflow-hidden rounded-3xl border border-dashed border-red-300 bg-red-50/40 active:opacity-80"
          >
            {videoUri ? (
              <View className="relative h-60 w-full bg-black">
                <SelectedVideoPreview
                  uri={
                    videoUri
                  }
                />

                <View className="absolute inset-x-3 bottom-3 flex-row items-center justify-between rounded-2xl bg-black/65 px-4 py-3">
                  <View className="flex-row items-center">
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#FFFFFF"
                    />

                    <Text className="ml-2 text-sm font-extrabold text-white">
                      Video selected
                    </Text>
                  </View>

                  <Text className="text-sm font-extrabold text-white">
                    Change
                  </Text>
                </View>
              </View>
            ) : (
              <View className="flex-1 items-center justify-center px-6 py-8">
                <View className="h-14 w-14 items-center justify-center rounded-full bg-red-100">
                  <Ionicons
                    name="videocam-outline"
                    size={30}
                    color="#F0442D"
                  />
                </View>

                <Text className="mt-4 text-base font-black text-textMain">
                  Upload video
                </Text>

                <Text className="mt-2 text-center text-sm leading-5 text-textMuted">
                  Select a video from your gallery
                </Text>

                <View className="mt-4 rounded-xl bg-primary px-5 py-3">
                  <Text className="text-sm font-extrabold text-white">
                    Choose Video
                  </Text>
                </View>

                <Text className="mt-4 text-xs font-medium text-textMuted">
                  Maximum duration: 5 minutes
                </Text>
              </View>
            )}
          </Pressable>
        </>
      );
    };

  const renderContentStep =
    () => (
      <>
        <Text className="text-lg font-black text-textMain">
          Basic Information
        </Text>

        <Text className="mb-2 mt-5 text-sm font-extrabold text-textMain">
          Video Title
          <Text className="text-primary">
            {' '}*
          </Text>
        </Text>

        <View className="relative">
          <AppInput
            value={title}
            onChangeText={(
              value,
            ) =>
              setTitle(
                value.slice(
                  0,
                  150,
                ),
              )
            }
            placeholder="Enter video title"
            className="pr-16"
          />

          <Text className="absolute bottom-4 right-4 text-xs font-medium text-textMuted">
            {
              title.length
            }
            /150
          </Text>
        </View>

        <Text className="mb-3 mt-6 text-sm font-extrabold text-textMain">
          Category
          <Text className="text-primary">
            {' '}*
          </Text>
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
        >
          {CATEGORY_OPTIONS.map(
            (option) => (
              <ChoiceCard
                key={
                  option.value
                }
                label={
                  option.label
                }
                value={
                  option.value
                }
                selected={
                  category ===
                  option.value
                }
                icon={
                  option.icon
                }
                onPress={
                  setCategory
                }
              />
            ),
          )}
        </ScrollView>

        <Text className="mb-3 mt-6 text-sm font-extrabold text-textMain">
          Video Type
          <Text className="text-primary">
            {' '}*
          </Text>
        </Text>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={
            false
          }
        >
          {VIDEO_TYPE_OPTIONS.map(
            (option) => (
              <ChoiceCard
                key={
                  option.value
                }
                label={
                  option.label
                }
                value={
                  option.value
                }
                selected={
                  videoType ===
                  option.value
                }
                icon={
                  option.icon
                }
                onPress={
                  setVideoType
                }
              />
            ),
          )}
        </ScrollView>

        <Text className="mb-2 mt-6 text-sm font-extrabold text-textMain">
          Description
          <Text className="text-primary">
            {' '}*
          </Text>
        </Text>

        <View className="relative">
          <AppInput
            value={
              description
            }
            onChangeText={(
              value,
            ) =>
              setDescription(
                value.slice(
                  0,
                  2000,
                ),
              )
            }
            placeholder="Write a detailed description..."
            multiline
            textAlignVertical="top"
            className="min-h-40 pb-10 pt-4"
          />

          <Text className="absolute bottom-4 right-4 text-xs font-medium text-textMuted">
            {
              description.length
            }
            /2000
          </Text>
        </View>

        {renderVideoSourceSelector()}

        {renderVideoInput()}

        <View className="mt-6">
          <Dropdown
            label="Language"
            placeholder="Select language"
            value={language}
            options={
              LANGUAGE_OPTIONS
            }
            onChange={
              setLanguage
            }
            icon="language-outline"
            required
          />
        </View>

        <View className="mt-5">
          <Dropdown
            label="Location"
            placeholder="Select location"
            value={location}
            options={
              LOCATION_OPTIONS
            }
            onChange={
              setLocation
            }
            icon="location-outline"
            required
          />
        </View>

        <View className="mt-8">
          <AppButton
            title="Continue to Preview"
            onPress={() =>
              goToStep(2)
            }
            disabled={
              isSaving ||
              isLoadingPost
            }
            className="h-14 rounded-2xl"
          />
        </View>
      </>
    );

  const renderPreviewStep =
    () => (
      <>
        <Text className="text-lg font-black text-textMain">
          Video Preview
        </Text>

        <Text className="mt-1 text-sm text-textMuted">
          Review your content before publishing.
        </Text>

        <View className="mt-5 overflow-hidden rounded-3xl border border-borderSoft bg-white">
          {videoSource ===
            'youtube' &&
          youtubeVideoId ? (
            <View className="bg-black">
              <YoutubePlayer
                height={240}
                videoId={
                  youtubeVideoId
                }
                play={
                  activeStep ===
                  2
                }
                webViewStyle={{
                  backgroundColor:
                    '#000000',
                }}
              />
            </View>
          ) : videoUri ? (
            <View className="h-60 bg-black">
              <SelectedVideoPreview
                uri={
                  videoUri
                }
                active={
                  activeStep ===
                  2
                }
              />
            </View>
          ) : null}

          <View className="p-5">
            <View className="flex-row flex-wrap gap-2">
              <View className="rounded-full bg-primarySoft px-3 py-1.5">
                <Text className="text-xs font-extrabold text-primary">
                  {getOptionLabel(
                    VIDEO_TYPE_OPTIONS,
                    videoType,
                  )}
                </Text>
              </View>

              <View className="rounded-full bg-blue-50 px-3 py-1.5">
                <Text className="text-xs font-extrabold text-blue-700">
                  {getOptionLabel(
                    CATEGORY_OPTIONS,
                    category,
                  )}
                </Text>
              </View>

              <View className="rounded-full bg-slate-100 px-3 py-1.5">
                <Text className="text-xs font-bold text-textMuted">
                  {getOptionLabel(
                    LANGUAGE_OPTIONS,
                    language,
                  )}
                </Text>
              </View>
            </View>

            <Text className="mt-5 text-3xl font-black leading-10 text-textMain">
              {
                title.trim()
              }
            </Text>

            <View className="mt-4 flex-row items-center">
              <Ionicons
                name="location-outline"
                size={18}
                color="#667085"
              />

              <Text className="ml-2 text-sm font-semibold text-textMuted">
                {getOptionLabel(
                  LOCATION_OPTIONS,
                  location,
                )}
              </Text>
            </View>

            <Text className="mt-6 text-base leading-8 text-slate-700">
              {
                description.trim()
              }
            </Text>
          </View>
        </View>

        <View className="mt-8 flex-row gap-3">
          <AppButton
            title="Back"
            variant="secondary"
            onPress={() =>
              setActiveStep(
                1,
              )
            }
            className="flex-1"
          />

          <AppButton
            title="Continue to Publish"
            onPress={() =>
              goToStep(3)
            }
            className="flex-1"
          />
        </View>
      </>
    );

  const renderPublishStep =
    () => (
      <>
        <Text className="text-lg font-black text-textMain">
          Publish Video
        </Text>

        <Text className="mt-1 text-sm leading-5 text-textMuted">
          Publish now for admin review, or save it as a draft and continue later.
        </Text>

        <View className="mt-6 rounded-3xl border border-borderSoft bg-slate-50 p-5">
          <View className="h-14 w-14 items-center justify-center rounded-full bg-primarySoft">
            <Ionicons
              name="paper-plane-outline"
              size={27}
              color="#F0442D"
            />
          </View>

          <Text className="mt-4 text-xl font-black text-textMain">
            Ready to submit?
          </Text>

          <Text className="mt-2 text-sm leading-6 text-textMuted">
            Published submissions are sent to the admin for approval before appearing in the app.
          </Text>

          <View className="mt-5 flex-row items-center rounded-2xl bg-white px-4 py-4">
            <Ionicons
              name="shield-checkmark-outline"
              size={21}
              color="#667085"
            />

            <Text className="ml-3 flex-1 text-sm leading-5 text-textMuted">
              Your content can be edited again from My Posts.
            </Text>
          </View>
        </View>

        <View className="mt-8">
          <AppButton
            title={
              isEditMode
                ? 'Update & Publish'
                : 'Publish Video'
            }
            onPress={() =>
              void saveVideo(
                'publish',
              )
            }
            loading={
              isSaving
            }
            disabled={
              isLoadingPost
            }
            className="h-14 rounded-2xl"
          />

          <Pressable
            onPress={() =>
              void saveVideo(
                'draft',
              )
            }
            disabled={
              isSaving ||
              isLoadingPost
            }
            className="mt-3 h-14 flex-row items-center justify-center rounded-2xl bg-primarySoft active:opacity-70"
          >
            <Ionicons
              name="document-outline"
              size={20}
              color="#F0442D"
            />

            <Text className="ml-2 text-base font-black text-primary">
              Save as Draft
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              setActiveStep(
                2,
              )
            }
            disabled={
              isSaving
            }
            className="mt-4 h-12 items-center justify-center"
          >
            <Text className="text-sm font-bold text-textMuted">
              Back to Preview
            </Text>
          </Pressable>
        </View>
      </>
    );

  return (
    <SafeAreaView
      edges={['top']}
      className="flex-1 bg-white"
    >
      <View className="border-b border-borderSoft bg-white px-4 pb-4 pt-2">
        <View className="flex-row items-center justify-between">
          <Pressable
            onPress={() =>
              router.back()
            }
            hitSlop={10}
            className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-50"
          >
            <Ionicons
              name="arrow-back"
              size={24}
              color="#121826"
            />
          </Pressable>

          <View className="flex-1 items-center px-3">
            <Text className="text-xl font-black text-textMain">
              {isEditMode
                ? 'Edit Video'
                : 'Create Video'}
            </Text>

            <Text className="mt-1 text-xs font-medium text-textMuted">
              Upload or share YouTube videos
            </Text>
          </View>

          <View className="h-11 w-11 items-center justify-center rounded-2xl bg-slate-50">
            <Ionicons
              name="videocam-outline"
              size={23}
              color="#121826"
            />
          </View>
        </View>

        <Stepper
          activeStep={
            activeStep
          }
          onStepPress={
            goToStep
          }
        />
      </View>

      <KeyboardAvoidingView
        behavior={
          Platform.OS ===
          'ios'
            ? 'padding'
            : undefined
        }
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            paddingHorizontal:
              18,
            paddingTop: 22,
            paddingBottom:
              44,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={
            false
          }
        >
          {activeStep === 1
            ? renderContentStep()
            : null}

          {activeStep === 2
            ? renderPreviewStep()
            : null}

          {activeStep === 3
            ? renderPublishStep()
            : null}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
