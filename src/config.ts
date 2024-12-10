import { FormioAppConfig } from '@formio/angular';
import { FormioAuthConfig } from '@formio/angular/auth';

export const AppConfig: FormioAppConfig = {
  //appUrl: 'http://localhost:3001',
  //apiUrl: 'http://localhost:3001',
  appUrl: 'https://trai.dimeb.hu',
  apiUrl: 'https://trai.dimeb.hu',
  icons: 'fontawesome',
};
/*
//localhost Lot
export const LotConfig = {
  lotId: '66f67387bad81693536044c3',
};
 */
//trai Lot
export const LotConfig = {
  lotId: '66f800b85745f22fe9d17440',
};

export const AuthConfig: FormioAuthConfig = {
  login: {
    form: 'user/login',
  },
  register: {
    form: 'user/register',
  },
};
