import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
/** broser AI javaslata */
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  constructor(private http: HttpClient) {}

  getAccessToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  setAccessToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  isTokenExpired(): boolean {
    const token = this.getAccessToken();
    if (!token) return true;
    // Assume token is a JWT. This is a simplified check
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp < now;
    } catch (e) {
      return true;
    }
  }

  // Attempt to refresh the token using a refresh token
  refreshToken(): Observable<any> {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) {
      // No refresh token available
      return throwError(() => new Error('No refresh token available'));
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    return this.http.post<any>('/api/refresh-token', { refreshToken }, { headers }).pipe(
      catchError((error) => {
        this.clearTokens();
        return throwError(() => error);
      }),
      switchMap((response) => {
        this.setAccessToken(response.accessToken);
        return new Observable((observer) => {
          observer.next(response.accessToken);
          observer.complete();
        });
      })
    );
  }

  // Intercept HTTP errors to handle token expiration
  handleHttpError(error: HttpErrorResponse): Observable<any> {
    if (error.status === 401 && this.getRefreshToken()) {
      // Attempt to refresh the token
      return this.refreshToken();
    } else {
      // Other errors, or no refresh token available
      this.clearTokens(); // Make sure to clear tokens if they're invalid
      return throwError(() => error); // Re-throw the error
    }
  }
}