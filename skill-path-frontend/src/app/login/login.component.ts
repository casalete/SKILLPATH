import { Component, HostListener } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  //   userEmail: string;
  //   userPassword: string;

  //   constructor(private authService: AuthService, private router: Router) {}

  //   login = (): void => {
  //     this.authService
  //       .validate(this.userEmail, this.userPassword)
  //       .then((response) => {
  //         this.authService.setUserInfo({ user: response.user });
  //         this.router.navigate(['pdf-view']);
  //       });
  //   };
  // }

  contactForm: FormGroup;
  disabledSubmitButton: boolean = true;
  optionsSelect: Array<any>;

  @HostListener('input') oninput() {
    if (this.contactForm.valid) {
      this.disabledSubmitButton = false;
    }
  }

  constructor(fb: FormBuilder) {
    this.contactForm = fb.group({
      contactFormName: ['', Validators.required],
      contactFormEmail: [
        '',
        Validators.compose([Validators.required, Validators.email]),
      ],
      contactFormSubjects: ['', Validators.required],
      contactFormMessage: ['', Validators.required],
      contactFormCopy: ['', Validators.requiredTrue],
    });
  }

  ngOnInit() {
    this.optionsSelect = [
      { value: 'Feedback', label: 'Feedback' },
      { value: 'Report a bug', label: 'Report a bug' },
      { value: 'Feature request', label: 'Feature request' },
      { value: 'Other stuff', label: 'Other stuff' },
    ];
  }

  get name() {
    return this.contactForm.get('contactFormName');
  }
  get email() {
    return this.contactForm.get('contactFormEmail');
  }
  get subjects() {
    return this.contactForm.get('contactFormSubjects');
  }
  get message() {
    return this.contactForm.get('contactFormMessage');
  }
  get copy() {
    return this.contactForm.get('contactFormCopy');
  }

  onSubmit() {
    // this.connectionService.sendMessage(this.contactForm.value).subscribe(() => {
    //   alert('Your message has been sent.');
    //   this.contactForm.reset();
    //   this.disabledSubmitButton = true;
    // }, (error: any) => {
    //   console.log('Error', error);
    // });
    console.log('clickeroni');
  }
}
