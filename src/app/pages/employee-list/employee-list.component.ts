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

const DELETE_EMPLOYEE = gql`
  mutation DeleteEmployee($id: ID!) {
    deleteEmployee(id: $id) {
      _id
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
    const confirmDelete = confirm('Are you sure you want to delete this employee?');
    if (!confirmDelete) return;
  
    this.apollo
      .mutate({
        mutation: DELETE_EMPLOYEE,
        variables: { id },
        update: (cache, { data }) => {
          const deletedId = (data as any)?.deleteEmployee?._id;
          const existing: any = cache.readQuery({ query: GET_EMPLOYEES });
        
          const updated = existing.employees.filter((e: any) => e._id !== deletedId);
        
          cache.writeQuery({
            query: GET_EMPLOYEES,
            data: { employees: updated },
          });
        },
      })
      .subscribe({
        next: () => {
          alert('Employee deleted!');
        },
        error: (err) => alert('Delete failed: ' + err.message),
      });
  }
  
}
