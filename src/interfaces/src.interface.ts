export interface ValidationError extends Error {
  status?: number;
  errors?: string;
}

//src

export interface Itip {
  id?: number;

  desp?: string;
  image?: number;
  status?: TipStatus;
}

export enum TipStatus {
  active = "active",
  inactive = "inactive",
}

export interface IFindTip {
  id?: number;
  status?: string;
  lang_code?: string;
}
export interface IrandTip {
  lang_code?: string;
  c_date?: string;
}

export interface ICountryAdd {
  id?: number;
  image: string;
  status: string;
}
