import { AbstractControl, FormArray, FormGroup, ValidationErrors } from "@angular/forms";



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

        default:
          return 'Error de validación no controlado';
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

}
