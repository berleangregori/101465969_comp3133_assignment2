declare module 'apollo-upload-client' {
    import { HttpOptions } from '@apollo/client/link/http';
    import { ApolloLink } from '@apollo/client/core';
  
    export function createUploadLink(options: HttpOptions): ApolloLink;
  }
  