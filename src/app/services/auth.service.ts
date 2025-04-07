import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private apollo: Apollo) {}

  private LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
      login(email: $email, password: $password) {
        token
      }
    }
  `;

  private SIGNUP_MUTATION = gql`
    mutation Signup($name: String!, $email: String!, $password: String!) {
      signup(name: $name, email: $email, password: $password) {
        id
      }
    }
  `;

  login(email: string, password: string): Observable<string> {
    return this.apollo
      .mutate<{ login: { token: string } }>({
        mutation: this.LOGIN_MUTATION,
        variables: { email, password },
      })
      .pipe(map(result => result.data?.login.token || ''));
  }

  signup(name: string, email: string, password: string): Observable<boolean> {
    return this.apollo
      .mutate<{ signup: { id: string } }>({
        mutation: this.SIGNUP_MUTATION,
        variables: { name, email, password },
      })
      .pipe(map(result => !!result.data?.signup.id));
  }

  logout() {
    localStorage.removeItem('token');
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }
}
