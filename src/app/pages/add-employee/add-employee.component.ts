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
  
    const operations = {
      query: `
        mutation AddEmployee(
          $firstName: String!,
          $lastName: String!,
          $email: String!,
          $department: String!,
          $position: String!,
          $profilePicture: Upload
        ) {
          addEmployee(
            firstName: $firstName,
            lastName: $lastName,
            email: $email,
            department: $department,
            position: $position,
            profilePicture: $profilePicture
          ) {
            _id
          }
        }
      `,
      variables: {
        firstName: this.form.value.firstName,
        lastName: this.form.value.lastName,
        email: this.form.value.email,
        department: this.form.value.department,
        position: this.form.value.position,
        profilePicture: null, 
      },
    };
  
    const map = {
      '0': ['variables.profilePicture'],
    };
  
    const formData = new FormData();
    formData.append('operations', JSON.stringify(operations));
    formData.append('map', JSON.stringify(map));
    formData.append('0', this.selectedFile as Blob);
  
    const token = localStorage.getItem('token');
  
    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        console.log('Upload result:', data);
        alert('Employee added!');
        this.router.navigate(['/employees']).then(() => {
          window.location.reload();
        });
      })
      .catch((err) => {
        console.error('Upload error:', err);
        alert('Error uploading employee.');
      });
  }
  
}
