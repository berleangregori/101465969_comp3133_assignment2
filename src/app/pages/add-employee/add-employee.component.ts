import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Apollo, gql } from 'apollo-angular';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';

const ADD_EMPLOYEE = gql`
  mutation AddEmployee(
    $firstName: String!
    $lastName: String!
    $email: String!
    $department: String!
    $position: String!
    $profilePicture: Upload
  ) {
    addEmployee(
      firstName: $firstName
      lastName: $lastName
      email: $email
      department: $department
      position: $position
      profilePicture: $profilePicture
    ) {
      _id
    }
  }
`;

@Component({
  selector: 'app-add-employee',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
  ],
  templateUrl: './add-employee.component.html',
})
export class AddEmployeeComponent implements OnInit {
  form!: FormGroup;
  selectedFile: File | null = null;

  constructor(private fb: FormBuilder, private apollo: Apollo, private router: Router) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      position: ['', Validators.required],
    });
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submit() {
    if (this.form.invalid || !this.selectedFile) return;

    this.apollo.mutate({
      mutation: ADD_EMPLOYEE,
      variables: {
        ...this.form.value,
        profilePicture: this.selectedFile,
      },
      context: {
        useMultipart: true,
      },
    }).subscribe({
      next: () => {
        alert('Employee added!');
        this.router.navigate(['/employees']);
      },
      error: (err) => alert('Error: ' + err.message),
    });
  }
}
