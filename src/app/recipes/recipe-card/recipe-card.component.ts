import { Component, Input } from '@angular/core';
import { IRecipe } from '../i-recipe';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-recipe-card',
  imports: [RouterLink],
  templateUrl: './recipe-card.component.html',
  styleUrl: './recipe-card.component.css'
})
export class RecipeCardComponent {

  @Input({ required: true,  }) recipe!: IRecipe; // ! --> garantiza que será inicializada en algún momento(?)
  // permite recibir datos del componente padre (en este caso recipe-list)
  // require true --> establece que el valor de entrada es obligatorio, si no se proporciona, angular lanzará un error en tiempo de ejecución

}
