import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EmployeeService {
  constructor(private apollo: Apollo) {}

  private GET_EMPLOYEES = gql`
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

  private DELETE_EMPLOYEE = gql`
    mutation DeleteEmployee($id: ID!) {
      deleteEmployee(id: $id) {
        _id
      }
    }
  `;

  getEmployees(): Observable<any[]> {
    return this.apollo
      .watchQuery<{ employees: any[] }>({
        query: this.GET_EMPLOYEES,
      })
      .valueChanges.pipe(map(result => result.data.employees));
  }

  deleteEmployee(id: string): Observable<any> {
    return this.apollo.mutate({
      mutation: this.DELETE_EMPLOYEE,
      variables: { id },
      update: (cache, { data }) => {
        const deletedId = (data as any)?.deleteEmployee?._id;
        const existing: any = cache.readQuery({ query: this.GET_EMPLOYEES });

        const updated = existing.employees.filter((e: any) => e._id !== deletedId);

        cache.writeQuery({
          query: this.GET_EMPLOYEES,
          data: { employees: updated },
        });
      },
    });
  }
}
