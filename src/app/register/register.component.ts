import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule , ReactiveFormsModule, FormsModule, SharedModule,],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  Form !: UntypedFormGroup;
  isSubmit: boolean = false;

  businessTypes : BusinessType[] = [
    {id : '1' , name : 'Salon' , icon : 'scissors' , selected : false},
    {id : '2' , name : 'Gym' , icon : 'user' ,selected : false},
    {id : '3' , name : 'Spa' , icon : 'sun' , selected : false},
    {id : '4' , name : 'Clinic' , icon :'thermometer' , selected : false},
  ]

  constructor(private fb: UntypedFormBuilder, private router: Router) {
  }

  ngOnInit(): void {
    this.Form = this.createForm();
  }

  createForm(): UntypedFormGroup {
    return this.fb.group({
     businessName : ['' , Validators.required],
     businessType : [[] , Validators.required],
     goverment : ['' , Validators.required] ,
     district : ['' , Validators.required],
     howKnow :[],
     isUsingSystem : []
    });
  }

  
  change($event : any,b : BusinessType){
    let checked : boolean = $event.target.checked
    if(checked){
      let types : any[] = this.Form.controls['businessType'].value;
      types.push(b)
      this.Form.controls['businessType'].setValue(types)
    }else{
      let types : any[] = this.Form.controls['businessType'].value;
       
      let index = types.findIndex((t) => t.id == b.id)
      types.splice(index, 1)
      this.Form.controls['businessType'].setValue(types)
    }
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
      this.router.navigate(['/success'])
      this.isDisabled = false;
    }
  }

}


export interface BusinessType{
   id : string
   name : string;
   icon :string
   selected ?: boolean
}
