import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { User } from './auth.model';
import { environment } from '../../environments/environment';


@Injectable({providedIn: 'root'})
export class AuthService {
  private BACKEND_URL = environment.apiUrl;
  private isUserAuthnticated = false;
  private tokenTimer: any;
  private token: string;
  private empId: string;
  private userAuthStatusSub = new Subject<boolean>();

  constructor(private httpClient: HttpClient, private router: Router) {}

  getToken() {
    return this.token;
  }

  getEmpId() {
    return this.empId;
  }

  getUserAuthd() {
    return this.isUserAuthnticated;
  }

  getAuthSub() {
    return this.userAuthStatusSub.asObservable();
  }

  onSignUp(empId1: string, name1: string, password1: string) {
    const user: User = {
      empId : empId1,
      name: name1,
      password: password1,
      angel: null,
      santa: null
    };
    this.httpClient.post(this.BACKEND_URL + 'signup', user)
    .subscribe(result => {
      this.router.navigate(["/"]);
    }, error => {
      this.userAuthStatusSub.next(false);
    });
  }

  onLogin(empId1: string, password1: string) {
    const user = {
      empId: empId1,
      password: password1
    };
    this.httpClient.post<{message: string, token: string, expiresIn: number, user: object}>
    (this.BACKEND_URL + 'login', user)
    .subscribe(result => {
      if (result && result.token) {
        const token = result.token;
        const expirationDuration = result.expiresIn;
        this.setAuthTimer(expirationDuration);
        this.isUserAuthnticated = true;
        this.userAuthStatusSub.next(true);
        const now = new Date();
        const expirationDate = new Date(
          now.getTime() + expirationDuration * 1000
        );
        this.saveAuthData(empId1, token, expirationDate);
        this.router.navigate(["/santa"]);
      }
    }, error => {
      this.userAuthStatusSub.next(false);
    });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isUserAuthnticated = true;
      this.empId = authInformation.empId;
      this.setAuthTimer(expiresIn / 1000);
      this.userAuthStatusSub.next(true);
    }
  }

  onLogOut() {
    this.token = null;
    this.empId = null;
    this.isUserAuthnticated = false;
    this.userAuthStatusSub.next(false);
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
    this.router.navigate(['/']);
  }

  private saveAuthData(empId: string, token: string, expirationDate: Date) {
    localStorage.setItem('empId', empId);
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
  }

  private getAuthData() {
    const empId1 = localStorage.getItem('emppId');
    const token1 = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    return {
      empId: empId1,
      token: token1,
      expirationDate: new Date(expirationDate)
    };
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('empId');
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.onLogOut();
    }, duration * 1000);
  }
}
