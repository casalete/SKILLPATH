import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { registerStart } from '../../../../store/authentication/actions';

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
    registerForm: FormGroup;

    constructor(private fb: FormBuilder, private store: Store, private router: Router) {}
    ngOnInit(): void {
        this.registerForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
            displayName: ['', Validators.required],
            firstName: ['', Validators.required],
            lastName: ['', Validators.required],
        });
    }

    navigateToLogin(): void {
        this.router.navigate(['/auth/login']);
    }

    onSubmit(): void {
        const registerFormValue = this.registerForm.value;
        this.store.dispatch(
            registerStart({
                userRegisterPayload: {
                    displayName: registerFormValue.displayName,
                    email: registerFormValue.email,
                    password: registerFormValue.password,
                    firstName: registerFormValue.firstName,
                    lastName: registerFormValue.lastName,
                },
            }),
        );
    }
}
