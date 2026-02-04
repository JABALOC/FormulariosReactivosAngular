import { AbstractControl, FormGroup } from '@angular/forms';
import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { required } from '@angular/forms/signals';
import { FormUtils } from '../../../utils/from-utils';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-register-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './register-page.html',
})
export class RegisterPage {


  fb = inject(FormBuilder);
  formUtils = FormUtils;

  myForm: FormGroup = this.fb.group (
    {
    name: ['', [Validators.required, Validators.pattern(this.formUtils.namePattern) ]],
    email: ['', [Validators.required, Validators.pattern(FormUtils.emailPattern)]],
    username: [
      '',
       [
        Validators.required,
        Validators.minLength(6),
        Validators.pattern(FormUtils.notOnlySpacesPattern)
      ]
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
    password2: ['', [Validators.required]],
    },
    {
      validators: [ this.formUtils.fieldOneEqualsFieldTwo('password', 'password2')],
    }
  );

  // fieldOneEqualsFieldTwo(field1: string, field2: string) {
  //   return (myForm: AbstractControl) => {
  //     const fieldValue1 = myForm.get(field1)?.value;
  //     const fieldValue2 = myForm.get(field2)?.value;

  //     return fieldValue1 === fieldValue2 ? null : {passwordNotEqual: true};
  //   }

  // }

  onSubmit() {
    console.log(this.myForm.value);
    this.myForm.markAllAsTouched();
  }

}
