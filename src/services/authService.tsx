import { baseService } from '../app/baseService';
import { HttpMethods } from '../lookups/httpMethods';
import IRole from '../interfaces/IRole';
import IUser from '../interfaces/IUser';

export interface ILogin {
    email: string;
    password: string;
}

interface ILoginResponse {
    token: string;
    User: IUser;
}

const URL = '/users';

export const authService = baseService.injectEndpoints({
    endpoints: (builder) => ({
        login: builder.mutation<ILoginResponse, ILogin>({
            query: (body: ILogin) => ({
                url: `${URL}/login`,
                method: HttpMethods.POST,
                body,
            }),
        }),
    }),
});

export const {
    useLoginMutation,
} = authService;
