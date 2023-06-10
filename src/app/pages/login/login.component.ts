import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from 'src/app/services/api/api.service';
import { User } from 'src/app/services/api/models/ApiModels';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });
  hide = true;
  showError = false;
  user: User;

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  login() {
    this.showError = false;
    this.apiService.login(this.loginForm.value.email, this.loginForm.value.password).subscribe((res) => {
      if (!res) {
        this.showError = true;
      } else {
        localStorage.setItem('user', JSON.stringify(res));
        this.router.navigate(['/home']);
      }
    })
  }

  logout() {
    localStorage.removeItem('user');
    this.user = null;
  }

}
