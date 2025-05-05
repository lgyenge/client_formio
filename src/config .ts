import { FormioAppConfig } from '@formio/angular';
import { FormioAuthConfig } from '@formio/angular/auth';


/* !!!!!!!!!!!!!!!!!!!!!!!!!trai app cofig!!!!!!!!!!!!!!!!!!!!!!!! --> ezt kivenni */
export const AppConfig: FormioAppConfig = {
  appUrl: 'https://trai.dimeb.hu',
  apiUrl: 'https://trai.dimeb.hu',
  icons: 'fontawesome',
};

/* !!!!!!!!!!!!!!!!!!!!!!!! trai app cofig end !!!!!!!!!!!!!!!!!!!!!!!*/


/* !!!!!!!!!!!!!!!!!!!!!! local app cofig !!!!!!!!!!!!!!!!!!!!!!!! --> ezt kivenni 
export const AppConfig: FormioAppConfig = {
  //appUrl: 'http://192.168.0.20:3001', // andrea gépe
  //apiUrl: 'http://192.168.0.20:3001',
  //appUrl: 'http://192.168.0.34:3001', // huawei
  //apiUrl: 'http://192.168.0.34:3001',
  appUrl: 'http://localhost:3001',
  apiUrl: 'http://localhost:3001',
  icons: 'fontawesome',
};
/* !!!!!!!!!!!!!!!!!!!!!!!!local app cofig end !!!!!!!!!!!!!!!!!!!!!!!! */


export const AuthConfig: FormioAuthConfig = {
  login: {
    form: 'user/login',
  },
  register: {
    form: 'user/register',
  },
};
