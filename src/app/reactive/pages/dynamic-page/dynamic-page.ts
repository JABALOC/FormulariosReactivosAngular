import { form } from '@angular/forms/signals';
import { JsonPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { FormUtils } from '../../../utils/from-utils';


@Component({
  selector: 'app-dynamic-page',
  imports: [JsonPipe, ReactiveFormsModule],
  templateUrl: './dynamic-page.html',
})
export class DynamicPage {

  private fb = inject(FormBuilder);
  formUtils = FormUtils

  myForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
    favoriteGames: this.fb.array(
      [
        ['Pokemon', Validators.required],
        ['DragonBall', Validators.required],
      ],
      Validators.minLength(2)
    ),

  })

  newFavorite = new FormControl('', Validators.required);
  // newFavorites = this.fb.control([])

  get favoriteGames() {
    return this.myForm.get('favoriteGames') as FormArray
  }

  // isValidFieldToArray(formArray: FormArray, index: number) {
  //   return (
  //     formArray.controls[index].errors &&
  //     formArray.controls[index].touched
  //   )
  // }

  onSave() {
    if(this.myForm.invalid) {
      this.myForm.markAllAsTouched()
      return;
    }

  }

  addFavorites() {
    if (this.newFavorite.invalid) return;

    const newGame = this.newFavorite.value;

    this.favoriteGames.push(this.fb.control(newGame, Validators.required));

    this.newFavorite.reset();
  }

  deleteFavorite(index: number) {
    this.favoriteGames.removeAt(index);
  }

  onTouch() {
    console.log(this.myForm)
    this.myForm.markAllAsTouched();
  }
}
