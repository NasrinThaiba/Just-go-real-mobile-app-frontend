import type { FeedItem } from '@/features/news/types/news.types';
import type { SupportedLanguage } from '@/types/common.types';


export function filterNewsByLanguage(
  news: FeedItem[] = [],
  language: SupportedLanguage,
): FeedItem[] {

  const filtered =
    news.filter(
      (item) =>
        item.language === language,
    );


  return filtered.length > 0
    ? filtered
    : news;

}



export function getBreakingNews(
  news: FeedItem[] = [],
  language: SupportedLanguage,
  limit:number,
): FeedItem[] {

  return news
    .filter(
      (item) =>
        item.type === 'news' &&
        item.newsType === 'breaking' &&
        item.status === 'published' &&
        item.language === language,
    )
    .sort(
      (first, second) => {

        const firstDate =
          first.publishedAt ??
          first.createdAt;


        const secondDate =
          second.publishedAt ??
          second.createdAt;


        return (
          new Date(secondDate).getTime() -
          new Date(firstDate).getTime()
        );

      },
    )
    .slice(
      0,
      limit,
    );

}



export function filterNewsByCategory(
  news: FeedItem[] = [],
  category:string,
  language?:SupportedLanguage,
):FeedItem[] {


  const categoryNews =
    news.filter(
      (item) =>
        item.category
          .toLowerCase()
          ===
        category.toLowerCase(),
    );


  return language
    ? filterNewsByLanguage(
        categoryNews,
        language,
      )
    : categoryNews;

}



export function getTrendingNews(
  news: FeedItem[] = [],
  language:SupportedLanguage,
):FeedItem[] {


  return [
    ...filterNewsByLanguage(
      news,
      language,
    ),
  ].sort(

    (first,second)=>

      second.views +
      second.likes * 2
      -
      (
        first.views +
        first.likes * 2
      ),

  );

}



export function getVideoNews(
  news:FeedItem[] = [],
  language:SupportedLanguage,
):FeedItem[] {


  return news

    .filter(
      (item)=>

        item.type === 'video' &&

        item.status === 'published' &&

        item.language === language,
    )

    .sort(
      (first,second)=>{

        const firstDate =
          first.publishedAt ??
          first.createdAt;


        const secondDate =
          second.publishedAt ??
          second.createdAt;


        return (

          new Date(secondDate).getTime()

          -

          new Date(firstDate).getTime()

        );

      },
    );

}



export function findNewsById(
  news:FeedItem[] = [],
  id?:string,
):FeedItem|null {


  if(!id){

    return null;

  }


  return (
    news.find(
      (item)=>
        item.id === id,
    )
    ??
    null
  );

}