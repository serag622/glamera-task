import { Component, OnInit, TemplateRef, ViewChild , inject } from '@angular/core';
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



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule , FormsModule , SharedModule   ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'] ,
  providers : [NgbModalConfig]
})
export class HomeComponent implements OnInit {

  Form !: UntypedFormGroup;
  viewPassword : boolean = false;
	private modalService = inject(NgbModal);
  @ViewChild('ref') OTPModel !: TemplateRef<any>;

  constructor(private fb: UntypedFormBuilder,private router : Router , 	config: NgbModalConfig, ){
    config.backdrop = 'static';
		config.keyboard = false;
  }

  ngOnInit(): void {
    this.Form =  this.createForm();
  }

  createForm(): UntypedFormGroup {
    return this.fb.group({
     firstName : ['' , Validators.required] ,
     lastName : ['' , Validators.required] ,
     email : ['' , [Validators.required , Validators.email]] ,
     phoneNumber: this.fb.group({
      countryCode: [''],
      number: ['']
    }),
    password : ['' , Validators.required] ,
    isAgree : [false , Validators.required]
    });
  }

  showPassword(){
    this.viewPassword = !this.viewPassword;
  }



  isDisabled : boolean = false;

  submit(){
    
    if (!this.isDisabled) this.isDisabled = true
    else return;

    if (this.Form.invalid) {

      Object.values(this.Form.controls).forEach(control => {
        if (control.invalid) {
          console.log(control.value)
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          this.isDisabled = false;
        }
      });
    } else {
      this.openNewDialog()  
      this.isDisabled = false;
    }
  }
  
  openNewDialog() {
    const modalRef = this.modalService.open(this.OTPModel);
  }

}
