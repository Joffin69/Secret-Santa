import { Component, OnInit, OnDestroy } from '@angular/core';

import { SantaService } from './santa.service';
import { Subscription } from 'rxjs';


@Component({
  templateUrl: './santa.component.html',
  styleUrls: ['./santa.component.css']
})
export class SantaComponent implements OnInit, OnDestroy {
  public userHasAngel = false;
  public userHasNoAngel = false;
  private fetchedUsers: Array<{}>;
  public userData: any;
  public isLoading = false;
  private angelSubs: Subscription;
  private userSub: Subscription;

  constructor(private santaService: SantaService) {}

  ngOnInit() {
    this.userSub = this.santaService.getUser()
    .subscribe(user => {
      this.userData = user.santaData;
      this.isLoading = true;
      if (user.angelId) {
        this.userData.angelId = user.angelId;
      }
      if (this.userData && this.userData.hasOwnProperty('angel')) {
        this.userHasAngel = true;
        return;
      }
      this.isLoading = false;
      if (this.userData && this.userData.hasOwnProperty('empId')) {
        this.santaService.getUsers(this.userData.empId)
        .subscribe(users => {
          this.isLoading = true;
          if (users && users.userData) {
            this.fetchedUsers = users.userData;
          }
        });
        if (!this.fetchedUsers || this.fetchedUsers.length === 0) {
          this.userHasNoAngel = true;
        }
      }
    });

  }

  shuffle(array: Array<{}>) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1)) ;
      [array[i], array[j]] = [array[j] , array[i]];
    }
    return array;
  }

  getAngel() {
    let randUser: any;
    if (this.fetchedUsers.length > 0) {
      this.fetchedUsers = this.shuffle(this.fetchedUsers);
      randUser = this.fetchedUsers[Math.floor(Math.random() * this.fetchedUsers.length)];
      const index = this.fetchedUsers.indexOf(randUser);
      if (index > -1) {
        this.fetchedUsers.splice(index, 1);
      }
      this.angelSubs = this.santaService.setAngel(this.userData.empId, randUser.name)
      .subscribe(result => {
        this.userData = result.userData;
        this.userData.angelId = result.angelId;
        this.userHasAngel = true;
      }, error => {
        console.log(error);
      });
    }
  }

  ngOnDestroy() {
    if (this.angelSubs) {
      this.angelSubs.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }
}
