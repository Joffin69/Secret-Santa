import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { User } from '../auth/auth.model';
import { environment } from '../../environments/environment';

@Injectable({providedIn: 'root'})
export class SantaService {
  private BACKEND_URL = environment.apiUrl;

  constructor(private httpClient: HttpClient) {}

  getUser() {
    const empId = localStorage.getItem('empId');
    return this.httpClient.get<{message: string, santaData: User, angelId: string}>(this.BACKEND_URL + 'getUser/' + empId);
  }

  getUsers(empId: string) {
    return this.httpClient.get<{message: string, userData: User[]}>(this.BACKEND_URL + empId);
  }

  setAngel(empId1: string, name1: string) {
    const user = {
      empId: empId1,
      name: name1
    };
    return this.httpClient.post<{message: string, userData: object, angelId: string}>(this.BACKEND_URL + 'setangel', user);
  }

}
