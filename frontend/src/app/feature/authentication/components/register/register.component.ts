import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { registerStart } from '../../../../store/authentication/authentication.actions';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private store: Store,
    private router: Router
  ) {}
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      username: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
    });
  }

  navigateToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  onSubmit(): void {
    const registerFormValue = this.registerForm.value;
    console.log(registerFormValue);

    this.store.dispatch(
      registerStart({
        userRegisterPayload: {
          username: registerFormValue.username,
          email: registerFormValue.email,
          password: registerFormValue.password,
          firstName: registerFormValue.firstName,
          lastName: registerFormValue.lastName,
        },
      })
    );
  }
}
