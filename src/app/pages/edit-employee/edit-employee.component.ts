import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo, gql } from 'apollo-angular';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

const GET_EMPLOYEE = gql`
  query GetEmployeeById($id: ID!) {
    employee(id: $id) {
      _id
      firstName
      lastName
      email
      department
      position
    }
  }
`;

const UPDATE_EMPLOYEE = gql`
  mutation UpdateEmployee(
    $id: ID!
    $firstName: String!
    $lastName: String!
    $email: String!
    $department: String!
    $position: String!
    $profilePicture: Upload
  ) {
    updateEmployee(
      id: $id
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
  selector: 'app-edit-employee',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-employee.component.html',
})
export class EditEmployeeComponent implements OnInit {
  form!: FormGroup;
  id!: string;
  selectedFile: File | null = null;

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private apollo: Apollo,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.form = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      position: ['', Validators.required],
    });

    this.apollo
      .watchQuery({
        query: GET_EMPLOYEE,
        variables: { id: this.id },
      })
      .valueChanges.subscribe((result: any) => {
        const emp = result.data.employee;
        this.form.patchValue(emp);
      });
  }

  onFileChange(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submit() {
    if (this.form.invalid) return;

    this.apollo
      .mutate({
        mutation: UPDATE_EMPLOYEE,
        variables: {
          id: this.id,
          ...this.form.value,
          profilePicture: this.selectedFile,
        },
        context: {
          useMultipart: true,
        },
      })
      .subscribe({
        next: () => {
          alert('Employee updated!');
          this.router.navigate(['/employees']);
        },
        error: (err) => alert('Update failed: ' + err.message),
      });
  }
}
