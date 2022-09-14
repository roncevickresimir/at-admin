import { t } from "i18next";

import { baseService } from "../app/baseService";
import { HttpMethods } from "../lookups/httpMethods";
import IUser from "../interfaces/IUser";

const URL = "/users";

export interface IGetUsersPayload {
  search: string;
  page: number;
  rpp: number;
}

export interface ICreateUser {
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword?: string;
  roleAbrv: string;
}

interface IUpdateUser {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleAbrv: string;
}

export const userService = baseService.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<IUser[], IGetUsersPayload>({
      query: (data) => ({
        url: `${URL}/?page=${data.page}&rpp=${data.rpp}${
          data.search && "search=" + data.search
        }`,
        method: HttpMethods.GET,
      }),
      transformResponse: (response: any[]) => {
        const users: IUser[] = response.map((user) => {
          return {
            id: user.id,
            userName: user.userName,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            password: user.password,
            role: user.roleId,
          };
        });
        return users;
      },
    }),
    getUser: builder.query<IUser, string>({
      query: (userId) => ({
        url: `${URL}/${userId}`,
        method: HttpMethods.GET,
      }),
    }),
    getUserById: builder.query<IUser, string>({
      query: (userId) => ({
        url: `${URL}/${userId}`,
      }),
    }),
    createUser: builder.mutation<void, ICreateUser>({
      query: (data) => ({
        url: `${URL}/register`,
        method: HttpMethods.POST,
        body: data,
      }),
      //invalidatesTags: [''],
    }),
    updateUser: builder.mutation<void, IUpdateUser>({
      query: (data) => ({
        url: `${URL}/${data.id}`,
        method: HttpMethods.PUT,
        body: data,
      }),
      //invalidatesTags: [''],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (userId) => ({
        url: `${URL}/${userId}`,
        method: HttpMethods.DELETE,
      }),
      //invalidatesTags: [''],
    }),
  }),
});

export const {
  useLazyGetUsersQuery,
  useLazyGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
} = userService;
