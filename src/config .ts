import { FormioAppConfig } from '@formio/angular';
import { FormioAuthConfig } from '@formio/angular/auth';


/* !!!!!!!!!!!!!!!!!!!!!!!!!trai app cofig!!!!!!!!!!!!!!!!!!!!!!!! --> ezt kivenni/
export const AppConfig: FormioAppConfig = {
  appUrl: 'https://trai.dimeb.hu',
  apiUrl: 'https://trai.dimeb.hu',
  icons: 'fontawesome',
};

export const LotConfig = {
  lotId: '66f800b85745f22fe9d17440',
};
/* !!!!!!!!!!!!!!!!!!!!!!!! trai app cofig end !!!!!!!!!!!!!!!!!!!!!!!*/


/* !!!!!!!!!!!!!!!!!!!!!! local app cofig !!!!!!!!!!!!!!!!!!!!!!!! --> ezt kivenni */
export const AppConfig: FormioAppConfig = {
  //appUrl: 'http://192.168.0.20:3001', // andrea gépe
  //apiUrl: 'http://192.168.0.20:3001',
  //appUrl: 'http://192.168.0.34:3001', // huawei
  //apiUrl: 'http://192.168.0.34:3001',
  appUrl: 'http://localhost:3001',
  apiUrl: 'http://localhost:3001',
  //appUrl: 'https://a3ae-2001-4c4c-1959-4f00-00-1007.ngrok-free.app', //ngrok nem működdik
  //apiUrl: 'https://a3ae-2001-4c4c-1959-4f00-00-1007.ngrok-free.app',
  icons: 'fontawesome',
};

/*
//server - formio

/*
//server - formio
export const LotConfig = {
  lotId: '66f67387bad81693536044c3',
}; */

//server - formio_450
export const LotConfig = {
 // lotId: '67c3088b5ef3a25d7535d8ba',
  lotId: '67e016961904985aaad53d2e',
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
