import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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
    private apollo: Apollo,
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

    const SIGNUP_MUTATION = gql`
      mutation Signup($name: String!, $email: String!, $password: String!) {
        signup(name: $name, email: $email, password: $password) {
          id
        }
      }
    `;

    this.apollo
      .mutate({
        mutation: SIGNUP_MUTATION,
        variables: this.form.value,
      })
      .subscribe({
        next: () => {
          alert('Signup successful!');
          this.router.navigate(['/login']);
        },
        error: (err) => alert('Signup failed: ' + err.message),
      });
  }
}
