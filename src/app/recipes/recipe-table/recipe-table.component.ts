import { Component } from '@angular/core';
import { RecipeTableRowComponent } from '../recipe-table-row/recipe-table-row.component';
import { IRecipe } from '../i-recipe';
import { recipes } from '../recipes-list/recipes_exemples';

@Component({
  selector: 'app-recipe-table',
  imports: [RecipeTableRowComponent],
  templateUrl: './recipe-table.component.html',
  styleUrl: './recipe-table.component.css'
})
export class RecipeTableComponent {
  public recipes: IRecipe[] = recipes;
}
