import {
 useMutation,
} from '@tanstack/react-query';


import {
 createNews,
} from '../api/news.api';



export function useCreateNews(){


 return useMutation({

   mutationFn:
     createNews,


 });


}