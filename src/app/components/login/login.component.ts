import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [FormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private supaService: SupabaseService, private router: Router){}

  email: string = "";
  password: string = "";
  error: string | undefined;

  sendLogin(){
    this.supaService.login(this.email,this.password).subscribe(
      {next: logindata => console.log(logindata),
        complete: ()=> this.router.navigate(['/home']), // login correcte --> redirecciona a home
        error: error =>  {this.error = error; this.router.navigate(['/login'])}
       }
    )
  }

}
