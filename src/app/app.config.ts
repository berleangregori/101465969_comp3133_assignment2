import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';

import { ApplicationConfig, inject } from '@angular/core';
import { provideApollo } from 'apollo-angular';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';

const GRAPHQL_URI = 'http://localhost:4000/graphql';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([])),
    provideRouter(routes),
    provideAnimations(),

    provideApollo(() => {
      const httpLink = inject(HttpLink);

      const auth = setContext(() => {
        const token = localStorage.getItem('token');
        return {
          headers: {
            Authorization: token ? `Bearer ${token}` : '',
          },
        };
      });

      return {
        cache: new InMemoryCache(),
        link: ApolloLink.from([
          auth,
          httpLink.create({
            uri: GRAPHQL_URI,
          }),
        ]),
      };
    }),
  ],
};
