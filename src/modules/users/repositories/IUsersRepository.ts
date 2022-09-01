import { User } from '../entities/User';
import { ICreateUserDTO } from '../useCases/createUser/ICreateUserDTO';

export interface IUsersRepository {
  create: (data: ICreateUserDTO) => Promise<User>;
  deposit: (user: User, amount: number) => Promise<User>;
  withdraw: (user: User, amount: number) => Promise<User>;
  transfer: (provider: User, receive: User, amount: number) => Promise<User[]>
  findByEmail: (email: string) => Promise<User | undefined>;
  findById: (user_id: string) => Promise<User | undefined>;
}
