import { Component, OnInit } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

const GET_EMPLOYEES = gql`
  query GetEmployees {
    employees {
      _id
      firstName
      lastName
      email
      department
      position
    }
  }
`;

@Component({
  selector: 'app-employee-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './employee-list.component.html',
})
export class EmployeeListComponent implements OnInit {
  employees: any[] = [];
  loading = true;
  error: any;

  constructor(private apollo: Apollo, private router: Router) {}

  ngOnInit(): void {
    this.apollo
      .watchQuery<any>({
        query: GET_EMPLOYEES,
      })
      .valueChanges.subscribe(({ data, loading, error }) => {
        this.loading = loading;
        this.employees = data?.employees || [];
        this.error = error;
      });
  }

  viewDetails(id: string) {
    this.router.navigate(['/employee', id]);
  }

  editEmployee(id: string) {
    this.router.navigate(['/edit-employee', id]);
  }

  deleteEmployee(id: string) {
    // TODO: Implement actual delete logic with GraphQL mutation
    alert(`Delete requested for employee: ${id}`);
  }
}
