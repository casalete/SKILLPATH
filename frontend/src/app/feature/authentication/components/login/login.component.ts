import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { loginStart } from '../../../../store/authentication/actions';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
    loginForm: FormGroup;

    constructor(private fb: FormBuilder, private store: Store, private router: Router) {}

    ngOnInit(): void {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
        });
    }

    navigateToRegister(): void {
        this.router.navigate(['/auth/register']);
    }

    onSubmit(): void {
        const val = this.loginForm.value;

        if (val.email && val.password) {
            this.store.dispatch(
                loginStart({
                    userCredentials: { email: val.email, password: val.password },
                }),
            );
        }
    }
}
