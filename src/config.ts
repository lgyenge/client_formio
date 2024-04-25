import { FormioAppConfig } from '@formio/angular';
import { FormioAuthConfig } from '@formio/angular/auth';

export const AppConfig: FormioAppConfig = {
  appUrl: 'http://localhost:3001',
  apiUrl: 'http://localhost:3001',
  icons: 'fontawesome'
};

export const AuthConfig: FormioAuthConfig = {
  login: {
    form: 'user/login'
  },
  register: {
    form: 'user/register'
  }
};
