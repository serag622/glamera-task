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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule , FormsModule , SharedModule   ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'] ,
  providers : []
})
export class HomeComponent implements OnInit {

  Form !: UntypedFormGroup;
  viewPassword : boolean = false;
	private modalService = inject(NgbModal);

  constructor(private fb: UntypedFormBuilder,private router : Router ){

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
      number: ['', [Validators.required]]
    }),
    password : ['']
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
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
          this.isDisabled = false;
        }
      });
    } else {
      
      

    }
  }


  @ViewChild('ref') Holidays !: TemplateRef<any>;

  openNewDialog() {
    const modalRef = this.modalService.open(this.Holidays);
  }


}
