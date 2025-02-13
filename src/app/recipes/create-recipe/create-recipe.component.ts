import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Ingredient } from '../ingredient';
import { toArray } from 'rxjs';

@Component({
  selector: 'app-create-recipe',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './create-recipe.component.html',
  styleUrl: './create-recipe.component.css'
})
export class CreateRecipeComponent implements OnInit {
  @Input('id') recipeID?: string;
  mealForm: FormGroup;
  rutaActiva: string = '';
  ingredientsList: Ingredient[] = [];

  constructor(
    private supaService: SupabaseService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {

    this.mealForm = this.formBuilder.group({
      strMeal: ['', [Validators.required]],
      strInstructions: ['', [Validators.required]],
      idIngredients: this.formBuilder.array([]),
    });
  }

  loadIngredients() {
    this.supaService.getAllIngredients().subscribe({
      next: (idIngredients) => {
        this.ingredientsList = idIngredients;
        console.log(this.ingredientsList);

      },
      error: (err) => console.log('Error al cargar ingredientes:', err),
    });
  }

  ngOnInit(): void {
    this.rutaActiva = this.router.url;
    this.loadIngredients();

    if (this.recipeID) {

      this.supaService.getMeals(this.recipeID).subscribe({
        next: (meals) => {
          this.mealForm.reset(meals[0]);
          const ingredientIds = meals[0].idIngredients;

          if (ingredientIds && ingredientIds.length) {

            ingredientIds.forEach((id) => {
              if (id) {
                this.supaService.getIngredients([id]).subscribe({
                  next: (ingredient) => {
                    this.ingredientsList.push(ingredient);
                    (<FormArray>this.mealForm.get('idIngredients')).push(
                      this.generateIngredientControl(ingredient.idIngredient as string)
                    );
                  },
                  error: (err) => console.log('Error al cargar ingrediente:', err),
                });
              }
            });
          }
        },
        error: (err) => console.log('Error al obtener la receta:', err),
      });
    }
  }


  get strMealValid() {
    return (
      this.mealForm.get('strMeal')?.valid &&
      this.mealForm.get('strMeal')?.touched
    );
  }

  getIngredientControl(): FormControl {
    const control = this.formBuilder.control('');
    control.setValidators(Validators.required);
    return control;
  }

  generateIngredientControl(id: string): FormControl {
    const control = this.formBuilder.control(id);

    control.setValidators(Validators.required);
    return control;
  }

  get IngredientsArray(): FormArray {
    return <FormArray>this.mealForm.get('idIngredients');
  }

  // Añadir un nuevo campo de ingrediente ·······················
  addIngredient() {
    (<FormArray>this.mealForm.get('idIngredients')).push(
      this.getIngredientControl()
    );
  }

  // Eliminar ingrediente ·······································
  delIngredient(i: number) {
    (<FormArray>this.mealForm.get('idIngredients')).removeAt(i);
  }

  submitForm() {
    if (this.mealForm.invalid) {
      return;
    }

    const mealData = this.mealForm.value;

    if (this.recipeID) {
      this.supaService.updateRecipes(this.recipeID, mealData).subscribe({
        next: () => {
          console.log('Receta actualizada');
          this.router.navigate(['/main']);
        },
        error: (err) => console.error('Error al actualizar la receta:', err),
      });
    } else {
      this.supaService.getLastRecipeId().subscribe({
        next: (lastId) => {
          const newId = (lastId + 1).toString();
          mealData.idMeal = newId;

          this.supaService.createRecipes(mealData).subscribe({
            next: () => {
              console.log('Receta creada con ID:', newId);
              this.router.navigate(['/main']);
            },
            error: (err) => console.error('Error al crear la receta:', err),
          });
        },
        error: (err) => console.error('Error al obtener la última ID:', err),
      });
    }
  }

}
