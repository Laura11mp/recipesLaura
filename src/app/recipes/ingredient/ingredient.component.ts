import { SlicePipe } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Ingredient } from '../ingredient';

@Component({
  selector: 'app-ingredient',
  imports: [SlicePipe],
  templateUrl: './ingredient.component.html',
  styleUrl: './ingredient.component.css'
})
export class IngredientComponent {

  @Input('ingredient') ingredient?: Ingredient;
  public ingredientImage: string = '';

}
