import { Component, OnInit } from '@angular/core';
import { SupabaseService } from '../../services/supabase.service';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{

  email: string = '';
  password: string = '';
  error: string|undefined;
  logged: boolean = false;
  registerForm: FormGroup;

  constructor(private supaService:SupabaseService, private formBuilder: FormBuilder){
    this.registerForm = this.formBuilder.group({
      email: ['',[Validators.required,   ]],
      passwords: this.formBuilder.group({
        password: ['',[Validators.required,   ]],
        password2: ['',[Validators.required,  ]]
      }, {
        validators: this.passwordCrossValidator
      })
    })
  }

  get password2NotValid(){
    if(this.registerForm.get('password2')?.invalid && this.registerForm.get('password2')?.touched)
      return 'is-invalid';
    else if (this.registerForm.get('password2')?.touched){
        return 'is-valid'
    }
    else return ''  
  }

  get password1NotValid(){
    if(this.registerForm.get('password')?.invalid && this.registerForm.get('password')?.touched)
      return 'is-invalid';
    else if (this.registerForm.get('password')?.touched && this.registerForm.get('password')?.valid){
        return 'is-valid'
    }
    return ''
  }

  get emailClass(){
    if(this.registerForm.get('email')?.untouched)
      return '';
    else if (this.registerForm.get('email')?.touched && this.registerForm.get('email')?.valid){
        return 'is-valid'
    }else{
      return 'is-invalid'
    }
  }

  get crossPasswordsNotValid(){
    if(this.registerForm.get('passwords')?.invalid) return true
    return false
  }

  get emailNotValid(){ 
    console.log(this.registerForm.get('email')?.value);
    
    return this.registerForm.get('email')?.invalid && this.registerForm.get('email')?.touched
  }

  passwordCrossValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
    const ps = control.get('password');
    const ps2 = control.get('password2');
    console.log(ps?.value,ps2?.value);
    
    return ps && ps2 && ps.value === ps2.value ? null : { passwordCrossValidator: true };
  };

  sendRegister(){
    if (this.registerForm.invalid) {
      console.log('Formulario inválido');
      console.log(this.registerForm.get('email')?.value);
      return;
    }
  
    const {email ,passwords:{password}} = this.registerForm.value;
    this.supaService.register(email,password).subscribe(
      {next: registerData => console.log(registerData),
        complete: ()=> console.log("complete"),
        error: error => {this.error = error.message; console.log(error);
        } 
      }
    )
  }

  ngOnInit(): void {
    this.logged =  this.supaService.loggedSubject.getValue();
    this.supaService.loggedSubject.subscribe(logged => this.logged = logged);
    this.supaService.isLogged();
  }
}
