import IRole from "./IRole";

export default interface IUser {
    id: string;
    userName: string,
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    role: IRole,
}
