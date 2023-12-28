import { Component, OnInit, TemplateRef, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  UntypedFormControl,
  Validators,
  UntypedFormGroup,
  UntypedFormBuilder,
  FormControl,
} from "@angular/forms";
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';
import { NgbModal, NgbModalConfig } from '@ng-bootstrap/ng-bootstrap';
import { NgOtpInputModule } from 'ng-otp-input';
import { Subject, Subscription, takeUntil, timer } from 'rxjs';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, SharedModule, NgOtpInputModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [NgbModalConfig]
})
export class HomeComponent implements OnInit {

  Form !: UntypedFormGroup;
  viewPassword: boolean = false;
  private modalService = inject(NgbModal);
  @ViewChild('ref') OTPModel !: TemplateRef<any>;
  verifyCode: FormControl = new FormControl();

  isSubmit: boolean = false

  counter: number = 60;
  countDown!: Subscription | null;
  tick = 1000;
  isOTPEnabled: boolean = true
  otpCounter !: number
  $subject = new Subject;


  constructor(private fb: UntypedFormBuilder, private router: Router, config: NgbModalConfig,) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.Form = this.createForm();
  }

  createForm(): UntypedFormGroup {
    return this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [null, Validators.required],
      password: ['', Validators.required],
      isAgree: [false, Validators.required]
    });
  }

  showPassword() {
    this.viewPassword = !this.viewPassword;
  }



  isDisabled: boolean = false;

  submit() {

    this.isSubmit = true;

    if (!this.isDisabled) this.isDisabled = true
    else return;

    if (this.Form.invalid) {

      Object.values(this.Form.controls).forEach(control => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          this.isDisabled = false;
        }
      });
    } else {
      this.isSubmit = false;
      this.openNewDialog()
      this.isDisabled = false;
    }
  }

  openNewDialog() {
    const modalRef = this.modalService.open(this.OTPModel);
    this.counter = 60
    this.countDown = timer(0, this.tick).pipe(takeUntil(this.$subject.asObservable()))
      .subscribe(() => {
        if (this.counter <= 0) {
          this.isOTPEnabled = false
          this.countDown = null
          this.$subject.next(1);
        } else {
          this.isOTPEnabled = true
        }
        localStorage.setItem('otpCounter', JSON.stringify(this.counter))
        return --this.counter
      })
  }

  isVerifyDiabled: boolean = false
  verify() {
    if (!this.isVerifyDiabled) this.isVerifyDiabled = true
    else return;

    if (!this.verifyCode.value || this.verifyCode.value?.toString().length != 4) {

      this.isVerifyDiabled = false
      return;
    } else {
      this.isOTPEnabled = false
      this.countDown = null
      this.$subject.next(1);
      this.modalService.dismissAll()
      this.router.navigate(['/register'])
    }

  }

  close() {
    this.isOTPEnabled = false
    this.countDown = null
    this.$subject.next(1);
    this.modalService.dismissAll()
  }

}
