import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  login() {
    if (this.form.invalid) return;

    const { email, password } = this.form.value;

    this.authService.login(email, password).subscribe({
      next: (token) => {
        if (token) {
          localStorage.setItem('token', token);
          this.router.navigate(['/employees']);
        } else {
          alert('Login failed. No token returned.');
        }
      },
      error: (err) => alert('Login failed: ' + err.message),
    });
  }
}
