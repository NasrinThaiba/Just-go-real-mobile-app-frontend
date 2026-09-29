import {
  useEffect,
  useState,
} from 'react';

import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';

import {
  SafeAreaView,
} from 'react-native-safe-area-context';

import {
  router,
  useLocalSearchParams,
} from 'expo-router';

import {
  createVideo,
  getMyVideoById,
  updateVideo,
  uploadVideoFile,
} from '../api/video.api';

import * as ImagePicker from 'expo-image-picker';

import type {
  CreateVideoPayload,
  VideoLanguage,
  VideoType,
} from '../types/video.types';

import CreateVideoContent
  from '../components/CreateVideoContent';

import CreateVideoPreview
  from '../components/CreateVideoPreview';

import CreateVideoPublish
  from '../components/CreateVideoPublish';


type Step =
  | 'content'
  | 'preview'
  | 'publish';


// =====================================================
// YOUTUBE ID
// =====================================================

function extractYoutubeId(
  url: string,
): string | undefined {

  const regex =
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/]+)/;

  const match =
    url
      .trim()
      .match(regex);

  return match?.[1];
}


// =====================================================
// SCREEN
// =====================================================

export default function CreateVideoScreen() {

  const params =
    useLocalSearchParams<{
      id?: string;
    }>();


  const videoId =
    params.id;


  const isEdit =
    Boolean(videoId);


  // ===================================================
  // STATES
  // ===================================================

  const [step, setStep] =
    useState<Step>('content');


  const [title, setTitle] =
    useState('');


  const [description, setDescription] =
    useState('');


  /**
   * Existing/permanent video URL.
   *
   * Before upload:
   * empty
   *
   * After upload:
   * S3 object URL
   */
  const [videoUrl, setVideoUrl] =
    useState('');


  /**
   * S3 object key.
   *
   * Example:
   *
   * videos/userId/abc.mp4
   */
  const [videoKey, setVideoKey] =
    useState('');


  /**
   * Selected local video.
   */
  const [videoAsset, setVideoAsset] =
    useState<
      ImagePicker.ImagePickerAsset | null
    >(null);


  /**
   * YouTube URL.
   */
  const [youtubeUrl, setYoutubeUrl] =
    useState('');


  const [thumbnailUrl, setThumbnailUrl] =
    useState('');


  const [videoType, setVideoType] =
    useState<VideoType>(
      'latest',
    );


  const [category, setCategory] =
    useState('other');


  const [language, setLanguage] =
    useState<VideoLanguage>(
      'en',
    );


  const [location, setLocation] =
    useState('');


  const [loading, setLoading] =
    useState(false);


  // ===================================================
  // LOAD VIDEO FOR EDIT
  // ===================================================

  useEffect(() => {
  if (!videoId) {
    return;
  }

  const id = videoId;

  async function loadVideo() {
    try {
      const data = await getMyVideoById(id);

      setTitle(data.title ?? '');

      setDescription(data.description ?? '');

      if (data.videoSource === 'direct') {
        setVideoUrl(data.mediaUrl ?? '');
        setVideoKey(data.mediaKey ?? '');
      } else {
        setVideoUrl('');
        setVideoKey('');
      }

      if (
        data.videoSource === 'youtube' &&
        data.youtubeVideoId
      ) {
        setYoutubeUrl(
          `https://youtube.com/watch?v=${data.youtubeVideoId}`,
        );
      } else {
        setYoutubeUrl('');
      }

      setThumbnailUrl(
        data.thumbnailUrl ?? '',
      );

      setVideoType(
        data.videoType ?? 'latest',
      );

      setCategory(
        data.category ?? '',
      );

      setLocation(
        data.location ?? '',
      );

      setLanguage(
        data.language ?? 'en',
      );

    } catch (error) {
      console.log(
        'LOAD VIDEO ERROR:',
        error,
      );
    }
  }

  loadVideo();

}, [videoId]);


  // ===================================================
  // SAVE VIDEO
  // ===================================================

  async function saveVideo() {

    try {

      setLoading(true);


      const trimmedYoutubeUrl =
        youtubeUrl.trim();


      const isYoutube =
        trimmedYoutubeUrl.length > 0;


      // =================================================
      // VIDEO URL
      // =================================================

      let permanentVideoUrl =
        videoUrl;


      // =================================================
      // VIDEO KEY
      // =================================================

      let permanentVideoKey =
        videoKey;


      // =================================================
      // NORMAL VIDEO → S3
      // =================================================

      if (
        !isYoutube &&
        videoAsset
      ) {

        console.log(
          'Uploading selected video to S3...',
        );


        const uploadResult =
          await uploadVideoFile(
            videoAsset,
          );


        permanentVideoUrl =
          uploadResult.fileUrl;


        permanentVideoKey =
          uploadResult.key;


        // Keep them in state.
        setVideoUrl(
          permanentVideoUrl,
        );


        setVideoKey(
          permanentVideoKey,
        );


        console.log(
          'S3 VIDEO URL:',
          permanentVideoUrl,
        );


        console.log(
          'S3 VIDEO KEY:',
          permanentVideoKey,
        );

      }


      // =================================================
      // VALIDATE NORMAL VIDEO
      // =================================================

      if (
        !isYoutube &&
        !permanentVideoUrl
      ) {

        throw new Error(
          'Please select a video',
        );

      }


      // =================================================
      // YOUTUBE ID
      // =================================================

      let youtubeVideoId:
        | string
        | undefined;


      if (isYoutube) {

        youtubeVideoId =
          extractYoutubeId(
            trimmedYoutubeUrl,
          );


        if (!youtubeVideoId) {

          throw new Error(
            'Please enter a valid YouTube URL',
          );

        }

      }


      // =================================================
      // PAYLOAD
      // =================================================

      const payload:
        CreateVideoPayload = {

        title:
          title.trim(),

        description:
          description.trim(),

        videoType,

        videoSource:
          isYoutube
            ? 'youtube'
            : 'direct',

        // ---------------------------------------------
        // DIRECT VIDEO
        // ---------------------------------------------

        mediaUrl:
          !isYoutube
            ? permanentVideoUrl
            : undefined,

        mediaKey:
          !isYoutube
            ? permanentVideoKey
            : undefined,

        // ---------------------------------------------
        // YOUTUBE
        // ---------------------------------------------

        youtubeVideoId:
          isYoutube
            ? youtubeVideoId
            : undefined,

        // ---------------------------------------------
        // OTHER DATA
        // ---------------------------------------------

        thumbnailUrl:
          thumbnailUrl.trim(),

        category,

        language,

        location,

        status:
          'pending',

      };


      console.log(
        'FINAL VIDEO PAYLOAD:',
        JSON.stringify(
          payload,
          null,
          2,
        ),
      );


      // =================================================
      // UPDATE
      // =================================================

      if (
        isEdit &&
        videoId
      ) {

        await updateVideo(
          videoId,
          payload,
        );

      }


      // =================================================
      // CREATE
      // =================================================

      else {

        await createVideo(
          payload,
        );

      }


      // =================================================
      // SUCCESS
      // =================================================

      Alert.alert(
        'Success',
        'Video submitted successfully',
      );


      router.replace(
        '/video',
      );

    }
    catch (error: any) {

      console.log(
        'SAVE VIDEO ERROR:',
        error,
      );


      console.log(
        'SAVE VIDEO RESPONSE:',
        error?.response?.data,
      );


      const message =
        error?.response?.data?.message ??
        error?.message ??
        'Failed to save video';


      Alert.alert(
        'Error',
        message,
      );

    }
    finally {

      setLoading(false);

    }

  }


  // ===================================================
  // UI
  // ===================================================

  return (

    <SafeAreaView
      className="flex-1 bg-slate-50"
    >

      <KeyboardAvoidingView
        className="flex-1"
        behavior={
          Platform.OS === 'ios'
            ? 'padding'
            : undefined
        }
      >

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            padding: 16,
            paddingBottom: 120,
          }}
        >

          {/* ===========================================
              CONTENT
          =========================================== */}

          {step === 'content' && (

            <CreateVideoContent

              title={title}
              setTitle={setTitle}

              description={description}
              setDescription={setDescription}

              videoType={videoType}
              setVideoType={setVideoType}

              category={category}
              setCategory={setCategory}

              language={language}
              setLanguage={setLanguage}

              videoUrl={videoUrl}
              setVideoUrl={setVideoUrl}

              videoAsset={videoAsset}
              setVideoAsset={setVideoAsset}

              youtubeUrl={youtubeUrl}
              setYoutubeUrl={setYoutubeUrl}

              thumbnailUrl={thumbnailUrl}
              setThumbnailUrl={setThumbnailUrl}

              location={location}
              setLocation={setLocation}

              onNext={() =>
                setStep('preview')
              }

            />

          )}


          {/* ===========================================
              PREVIEW
          =========================================== */}

          {step === 'preview' && (

            <CreateVideoPreview

              title={title}

              description={description}

              videoUrl={videoUrl}

              youtubeUrl={youtubeUrl}

              thumbnailUrl={thumbnailUrl}

              category={category}

              videoType={videoType}

              language={language}

              location={location}

              onBack={() =>
                setStep('content')
              }

              onNext={() =>
                setStep('publish')
              }

            />

          )}


          {/* ===========================================
              PUBLISH
          =========================================== */}

          {step === 'publish' && (

            <CreateVideoPublish

              loading={loading}

              onBack={() =>
                setStep('preview')
              }

              onPublish={saveVideo}

            />

          )}

        </ScrollView>

      </KeyboardAvoidingView>

    </SafeAreaView>

  );

}