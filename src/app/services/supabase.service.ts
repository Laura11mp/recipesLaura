import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../environments/environment.development';
import { BehaviorSubject, from, map, mergeMap, Observable, tap } from 'rxjs';
import { IRecipe } from '../recipes/i-recipe';
import { Ingredient } from '../recipes/ingredient';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {

  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(environment.supabaseUrl, environment.supabaseKey);
  }

  async getData(
    table: string,
    search?: Object,
    ids?: string[],
    idField?: string
  ): Promise<any[]> {
    let query = this.supabase.from(table).select('*');
    if (search) {
      query = query?.match(search);
    }
    if (ids) {
      console.log(idField);

      query = query?.in(idField ? idField : 'id', ids);
    }
    const { data, error } = await query;
    if (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
    return data;
  }

  getDataObservable<T>(
    table: string,
    search?: Object,
    ids?: string[],
    idField?: string
  ): Observable<T[]> {
    return from(this.getData(table, search, ids, idField));
  }

  getMeals(search?: string): Observable<IRecipe[]> {
    return this.getDataObservable(
      'meals',
      search ? { idMeal: search } : undefined
    );
  }

  getIngredients(ids: (string | null)[]): Observable<Ingredient> {
    return this.getDataObservable<Ingredient>(
      'ingredients',
      undefined,
      ids.filter((id) => id !== null) as string[],
      'idIngredient'
    ).pipe(
      mergeMap((ingredients: Ingredient[]) => from(ingredients)),
      mergeMap(async (ingredient: Ingredient) => {
        const { data, error } = await this.supabase.storage
          .from('recipes')
          .download(`${ingredient.strStorageimg}?rand=${Math.random()}`);
        if (data) {
          ingredient.blobimg = URL.createObjectURL(data);
        }
        return ingredient;
      })
    );
  }

  login(email: string, password: string) {
    const loginResult = from(this.supabase.auth.signInWithPassword({
      email,
      password
    })).pipe(
      map(({ data, error }) => {
        if (error) {
          throw error;
        }
        return data;
      }),
      tap(() => this.isLogged())
    );

    return loginResult;

  }

  loggedSubject = new BehaviorSubject(false);

  async isLogged(){
      const { data: { user } } = await this.supabase.auth.getUser()
      if(user){
        this.loggedSubject.next(true);
      }
      else
      this.loggedSubject.next(false);
  }

  register(email: string, password: string) {
    const registerResult = from(this.supabase.auth.signUp({
      email,
      password
    })).pipe(
      map(({ data, error }) => {
        if (error) {
          console.error('Error during sign up:', error); // Log the error for debugging
          throw error;
        }
        return data;
      }),
      tap(() => this.isLogged())
    );

    return registerResult;
  }

}
