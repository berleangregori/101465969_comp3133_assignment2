import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  signup() {
    if (this.form.invalid) return;

    const { name, email, password } = this.form.value;

    this.authService.signup(name, email, password).subscribe({
      next: (success) => {
        if (success) {
          alert('Signup successful!');
          this.router.navigate(['/login']);
        } else {
          alert('Signup failed.');
        }
      },
      error: (err) => alert('Signup failed: ' + err.message),
    });
  }
}
