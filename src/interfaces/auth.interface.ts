export interface IGuest {
  user_id: string;
  device_id: string;
  country: string;
  food_type: string;
  prefer_lang: string;
}
export interface IOtp {
  otp: string;
  email: string;
  
}


export interface CreateUserParams {
  user_name: string;
  email: string;
  password: string;
  login_type: string;
}
