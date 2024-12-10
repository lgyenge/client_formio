import { FormioAppConfig } from '@formio/angular';
import { FormioAuthConfig } from '@formio/angular/auth';


/* !!!!!!!!!!!!!!!!!!!!!!!!!trai app cofig!!!!!!!!!!!!!!!!!!!!!!!! --> ezt kivenni*/
export const AppConfig: FormioAppConfig = {
  appUrl: 'https://trai.dimeb.hu',
  apiUrl: 'https://trai.dimeb.hu',
  icons: 'fontawesome',
};

export const LotConfig = {
  lotId: '66f800b85745f22fe9d17440',
};
/* !!!!!!!!!!!!!!!!!!!!!!!! trai app cofig end !!!!!!!!!!!!!!!!!!!!!!!*/


/* !!!!!!!!!!!!!!!!!!!!!! local app cofig !!!!!!!!!!!!!!!!!!!!!!!! --> ezt kivenni *
export const AppConfig: FormioAppConfig = {
  appUrl: 'http://localhost:3001',
  apiUrl: 'http://localhost:3001',
  icons: 'fontawesome',
};
export const LotConfig = {
  lotId: '66f67387bad81693536044c3',
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
