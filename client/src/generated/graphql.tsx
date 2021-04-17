import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions =  {}
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The javascript `Date` as string. Type represents date and time as the ISO Date string. */
  DateTime: any;
};

export type Bid = {
  __typename?: 'Bid';
  id: Scalars['Float'];
  amount: Scalars['Float'];
  comment: Scalars['String'];
  creatorId: Scalars['Int'];
  lotId: Scalars['Int'];
  creator: User;
  lot: Lot;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type BidResponse = {
  __typename?: 'BidResponse';
  bid?: Maybe<Bid>;
  error?: Maybe<ErrorType>;
};


export type ErrorType = {
  __typename?: 'ErrorType';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type Lot = {
  __typename?: 'Lot';
  id: Scalars['Int'];
  title: Scalars['String'];
  description: Scalars['String'];
  creatorId: Scalars['Float'];
  bids: Array<Bid>;
  creator: User;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
  descriptionSnippet: Scalars['String'];
};

export type LotInput = {
  title: Scalars['String'];
  description: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  createBid: BidResponse;
  createLot: Lot;
  changePassword: UserResponse;
  forgotPassword: Scalars['Boolean'];
  register: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  changePhoto: Scalars['Boolean'];
};


export type MutationCreateBidArgs = {
  lotId: Scalars['Int'];
  comment: Scalars['String'];
  amount: Scalars['Float'];
};


export type MutationCreateLotArgs = {
  input: LotInput;
};


export type MutationChangePasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationForgotPasswordArgs = {
  email: Scalars['String'];
};


export type MutationRegisterArgs = {
  password: Scalars['String'];
  email: Scalars['String'];
  username: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationChangePhotoArgs = {
  photoUrl: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  bid?: Maybe<Bid>;
  bids: Array<Bid>;
  lot?: Maybe<Lot>;
  mylots: Array<Lot>;
  lots: Array<Lot>;
  me?: Maybe<User>;
};


export type QueryBidArgs = {
  lotId: Scalars['Int'];
};


export type QueryBidsArgs = {
  lotId: Scalars['Int'];
};


export type QueryLotArgs = {
  id: Scalars['Int'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Float'];
  username: Scalars['String'];
  email: Scalars['String'];
  photoUrl?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  updatedAt: Scalars['DateTime'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  user?: Maybe<User>;
  errors?: Maybe<Array<ErrorType>>;
};

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'email' | 'username'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'message'>
    )>> }
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type LotsQueryVariables = Exact<{ [key: string]: never; }>;


export type LotsQuery = (
  { __typename?: 'Query' }
  & { lots: Array<(
    { __typename?: 'Lot' }
    & Pick<Lot, 'id' | 'title' | 'descriptionSnippet'>
    & { creator: (
      { __typename?: 'User' }
      & Pick<User, 'username'>
    ) }
  )> }
);

export type RegisterMutationVariables = Exact<{
  username: Scalars['String'];
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { register: (
    { __typename?: 'UserResponse' }
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'email' | 'username'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'ErrorType' }
      & Pick<ErrorType, 'field' | 'message'>
    )>> }
  ) }
);

export type ChangePhotoMutationVariables = Exact<{
  photoUrl: Scalars['String'];
}>;


export type ChangePhotoMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'changePhoto'>
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & Pick<User, 'email' | 'username' | 'photoUrl'>
  )> }
);


export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(usernameOrEmail: $usernameOrEmail, password: $password) {
    user {
      email
      username
    }
    errors {
      field
      message
    }
  }
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      usernameOrEmail: // value for 'usernameOrEmail'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const LotsDocument = gql`
    query Lots {
  lots {
    id
    title
    descriptionSnippet
    creator {
      username
    }
  }
}
    `;

/**
 * __useLotsQuery__
 *
 * To run a query within a React component, call `useLotsQuery` and pass it any options that fit your needs.
 * When your component renders, `useLotsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useLotsQuery({
 *   variables: {
 *   },
 * });
 */
export function useLotsQuery(baseOptions?: Apollo.QueryHookOptions<LotsQuery, LotsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<LotsQuery, LotsQueryVariables>(LotsDocument, options);
      }
export function useLotsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<LotsQuery, LotsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<LotsQuery, LotsQueryVariables>(LotsDocument, options);
        }
export type LotsQueryHookResult = ReturnType<typeof useLotsQuery>;
export type LotsLazyQueryHookResult = ReturnType<typeof useLotsLazyQuery>;
export type LotsQueryResult = Apollo.QueryResult<LotsQuery, LotsQueryVariables>;
export const RegisterDocument = gql`
    mutation Register($username: String!, $email: String!, $password: String!) {
  register(username: $username, email: $email, password: $password) {
    user {
      email
      username
    }
    errors {
      field
      message
    }
  }
}
    `;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      username: // value for 'username'
 *      email: // value for 'email'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, options);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const ChangePhotoDocument = gql`
    mutation ChangePhoto($photoUrl: String!) {
  changePhoto(photoUrl: $photoUrl)
}
    `;
export type ChangePhotoMutationFn = Apollo.MutationFunction<ChangePhotoMutation, ChangePhotoMutationVariables>;

/**
 * __useChangePhotoMutation__
 *
 * To run a mutation, you first call `useChangePhotoMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePhotoMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePhotoMutation, { data, loading, error }] = useChangePhotoMutation({
 *   variables: {
 *      photoUrl: // value for 'photoUrl'
 *   },
 * });
 */
export function useChangePhotoMutation(baseOptions?: Apollo.MutationHookOptions<ChangePhotoMutation, ChangePhotoMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<ChangePhotoMutation, ChangePhotoMutationVariables>(ChangePhotoDocument, options);
      }
export type ChangePhotoMutationHookResult = ReturnType<typeof useChangePhotoMutation>;
export type ChangePhotoMutationResult = Apollo.MutationResult<ChangePhotoMutation>;
export type ChangePhotoMutationOptions = Apollo.BaseMutationOptions<ChangePhotoMutation, ChangePhotoMutationVariables>;
export const MeDocument = gql`
    query Me {
  me {
    email
    username
    photoUrl
  }
}
    `;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, options);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, options);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;