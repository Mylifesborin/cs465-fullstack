import { Inject, Injectable } from '@angular/core';
import { BROWSER_STORAGE } from '../storage';
import { User } from '../models/user';
import { AuthResponse } from '../models/auth-response';
import { TripDataService } from './trip-data';

@Injectable({
  providedIn: 'root'
})
export class Authentication {
  authResp: AuthResponse = new AuthResponse();

  constructor(
    @Inject(BROWSER_STORAGE) private storage: Storage,
    private tripDataService: TripDataService
  ) {}

  /**
   * Get our token from our Storage provider.
   * We will name the key 'travlr-token'
   */
  public getToken(): string {
    let out = this.storage.getItem('travlr-token');
    if (!out) {
      return '';
    }
    return out;
  }

  /**
   * Save our token to local storage
   */
  public saveToken(token: string): void {
    this.storage.setItem('travlr-token', token);
  }

  /**
   * Logout by removing the token from storage
   */
  public logout(): void {
    this.storage.removeItem('travlr-token');
  }

  /**
   * Boolean to determine if we are logged in and the token is still valid
   */
  public isLoggedIn(): boolean {
    const token: string = this.getToken();
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload.exp > Date.now() / 1000;
    }
    return false;
  }

  /**
   * Retrieve the current user
   * Only safe to call if isLoggedIn() is true
   */
  public getCurrentUser(): User {
    const token: string = this.getToken();
    const { email, name } = JSON.parse(atob(token.split('.')[1]));
    return { email, name } as User;
  }

  /**
   * Login using the TripDataService login method
   */
  public login(user: User, passwd: string): void {
    this.tripDataService.login(user, passwd).subscribe({
      next: (value: any) => {
        if (value) {
          console.log(value);
          this.authResp = value;
          this.saveToken(this.authResp.token);
        }
      },
      error: (error: any) => {
        console.log('Error: ' + error);
      }
    });
  }

  /**
   * Register using the TripDataService register method
   */
  public register(user: User, passwd: string): void {
    this.tripDataService.register(user, passwd).subscribe({
      next: (value: any) => {
        if (value) {
          console.log(value);
          this.authResp = value;
          this.saveToken(this.authResp.token);
        }
      },
      error: (error: any) => {
        console.log('Error: ' + error);
      }
    });
  }
}
