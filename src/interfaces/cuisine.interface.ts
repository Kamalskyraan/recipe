export interface ICuisineTranslation {
  lang_code: string;
  cuisine_name: string;
}

export interface IAddUpdateCuisine {
  id?: number;
  image?: string;
  status: string;
  translations: ICuisineTranslation[];
}
