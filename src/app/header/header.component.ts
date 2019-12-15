import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth/auth.service';



@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public isUserAuthd: boolean;
  private userAuthSub: Subscription;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.isUserAuthd = this.authService.getUserAuthd();
    this.userAuthSub = this.authService.getAuthSub()
    .subscribe(value => {
      this.isUserAuthd = value;
    });
  }

  onLogout() {
    this.authService.onLogOut();
  }

  ngOnDestroy() {
    this.userAuthSub.unsubscribe();
  }
}
