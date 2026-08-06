import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import type { FeedItem } from '@/features/news/types/news.types';

const STORAGE_KEY =
  '@just-go-real/saved-content';

type SavedContentContextValue = {
  savedItems: FeedItem[];
  savedNews: FeedItem[];
  savedVideos: FeedItem[];
  isLoading: boolean;
  isSaved: (id: string) => boolean;
  toggleSaved: (
    item: FeedItem,
  ) => Promise<void>;
  removeSaved: (
    id: string,
  ) => Promise<void>;
};

const SavedContentContext =
  createContext<
    SavedContentContextValue | undefined
  >(undefined);

type SavedContentProviderProps = {
  children: ReactNode;
};

export function SavedContentProvider({
  children,
}: SavedContentProviderProps) {
  const [
    savedItems,
    setSavedItems,
  ] = useState<FeedItem[]>([]);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const loadSavedItems = async () => {
      try {
        const storedItems =
          await AsyncStorage.getItem(
            STORAGE_KEY,
          );

        if (!storedItems) {
          return;
        }

        const parsedItems: unknown =
          JSON.parse(storedItems);

        if (Array.isArray(parsedItems)) {
          setSavedItems(
            parsedItems as FeedItem[],
          );
        }
      } catch (error) {
        console.error(
          'Failed to load saved items:',
          error,
        );
      } finally {
        setIsLoading(false);
      }
    };

    void loadSavedItems();
  }, []);

  const saveItemsToStorage =
    useCallback(
      async (
        items: FeedItem[],
      ) => {
        try {
          await AsyncStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(items),
          );
        } catch (error) {
          console.error(
            'Failed to persist saved items:',
            error,
          );
        }
      },
      [],
    );

  const isSaved = useCallback(
    (id: string) =>
      savedItems.some(
        (item) => item.id === id,
      ),
    [savedItems],
  );

  const toggleSaved = useCallback(
    async (item: FeedItem) => {
      setSavedItems(
        (currentItems) => {
          const alreadySaved =
            currentItems.some(
              (savedItem) =>
                savedItem.id ===
                item.id,
            );

          const nextItems =
            alreadySaved
              ? currentItems.filter(
                  (savedItem) =>
                    savedItem.id !==
                    item.id,
                )
              : [
                  item,
                  ...currentItems,
                ];

          void saveItemsToStorage(
            nextItems,
          );

          return nextItems;
        },
      );
    },
    [saveItemsToStorage],
  );

  const removeSaved = useCallback(
    async (id: string) => {
      setSavedItems(
        (currentItems) => {
          const nextItems =
            currentItems.filter(
              (item) =>
                item.id !== id,
            );

          void saveItemsToStorage(
            nextItems,
          );

          return nextItems;
        },
      );
    },
    [saveItemsToStorage],
  );

  const savedNews = useMemo(
    () =>
      savedItems.filter(
        (item) =>
          item.type === 'news',
      ),
    [savedItems],
  );

  const savedVideos = useMemo(
    () =>
      savedItems.filter(
        (item) =>
          item.type === 'video',
      ),
    [savedItems],
  );

  const value =
    useMemo<SavedContentContextValue>(
      () => ({
        savedItems,
        savedNews,
        savedVideos,
        isLoading,
        isSaved,
        toggleSaved,
        removeSaved,
      }),
      [
        savedItems,
        savedNews,
        savedVideos,
        isLoading,
        isSaved,
        toggleSaved,
        removeSaved,
      ],
    );

  return (
    <SavedContentContext.Provider
      value={value}
    >
      {children}
    </SavedContentContext.Provider>
  );
}

export function useSavedContent() {
  const context = useContext(
    SavedContentContext,
  );

  if (!context) {
    throw new Error(
      'useSavedContent must be used inside SavedContentProvider',
    );
  }

  return context;
}