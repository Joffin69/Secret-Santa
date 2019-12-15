import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { AuthService } from '../auth.service';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignUpComponent {

  constructor(private authService: AuthService) {}

  onSignUp(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.onSignUp(form.value.empId, form.value.name, form.value.password);
    form.resetForm();
  }
}
