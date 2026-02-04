import { AbstractControl, FormArray, FormGroup, ValidationErrors } from "@angular/forms";
import { timeInterval } from "rxjs";

async function sleep() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, 2500);
  });
}


export class FormUtils {

  static namePattern = '([a-zA-Z]+) ([a-zA-Z]+)';
  static emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$';
  static notOnlySpacesPattern = '^[a-zA-Z0-9]+$';
  static passwordPattern = '^(?=.*[a-zA-Z])(?=.*\d).{6,}$';


  static getTextErrors(errors: ValidationErrors): string | null {

    for (const key of Object.keys(errors)) {
      switch (key) {
        case 'required':
          return 'Este campo es requerido';

        case 'minlength':
          return `Mínimo de ${errors['minlength'].requiredLength} caracteres.`;

        case 'min':
          return `Valor mínimo de ${errors['min'].min}`;

        case 'email':
          return `El valor ingresado no es un correo electrónico`;

        case 'pattern':
          if (errors['pattern'].requiredPattern === FormUtils.emailPattern) {
            return 'El correo electrónico no es válido';
          }
          return 'Error de patrón contra expresión regular';

        case 'emailTaken':
          return 'El correo electrónico ya está registrado';

        case 'nickName':
          return 'El username ya está registrado';

        default:
          return `Error de validación no controlado ${key}`;
      }
    }
    return null;
  }

  static isValidField( form: FormGroup ,fieldName: string): boolean | null {
    return (
      !! form.controls[fieldName].errors &&
      form.controls[fieldName].touched
    );
  }

  static getFieldError( form: FormGroup, fieldName: string ): string | null {
    if (!form.controls[fieldName]) return null;

    const errors = form.controls[fieldName].errors ?? {};

    return FormUtils.getTextErrors(errors);

  }

  static isValidFieldToArray(formArray: FormArray, index: number) {
    return (
      formArray.controls[index].errors &&
      formArray.controls[index].touched
    )
  }

  static getFieldsErrorDynamic( formArray: FormArray, index: number): string | null {
    if(formArray.controls.length === 0) return null;

    const errors = formArray.controls[index].errors ?? {};

    return FormUtils.getTextErrors(errors);
  }

  static fieldOneEqualsFieldTwo(field1: string, field2: string) {
    return (myForm: AbstractControl) => {
      const fieldValue1 = myForm.get(field1)?.value;
      const fieldValue2 = myForm.get(field2)?.value;

      return fieldValue1 === fieldValue2 ? null : {passwordNotEqual: true};
    }

  }

  static async checkServerResponse(control: AbstractControl): Promise<ValidationErrors | null> {
    console.log('validando contra servidor')

    await sleep();

    const formValue = control.value

    if (formValue === 'hola@mundo.com') {
      return {
        emailTaken: true
      }
    }
    return null;
  }

  static async nickNameInUse(control: AbstractControl): Promise<ValidationErrors | null> {

    const nickName = control.value

    if (nickName === 'jabaloc') {
      console.log(nickName);
      return {

        nickName : true
      }
    }

    return null;
  }

}
