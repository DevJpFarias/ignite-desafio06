import { User } from "../../entities/User";

import { ICreateUserDTO } from "../../useCases/createUser/ICreateUserDTO";
import { IUsersRepository } from "../IUsersRepository";

export class InMemoryUsersRepository implements IUsersRepository {
  private users: User[] = [];

  async findByEmail(email: string): Promise<User | undefined> {
    return this.users.find(user => user.email === email);
  }

  async findById(user_id: string): Promise<User | undefined> {
    return this.users.find(user => user.id === user_id);
  }

  async create(data: ICreateUserDTO): Promise<User> {
    const user = new User();
    Object.assign(user, data);
    this.users.push(user);
    return user;
  }

  async deposit(user: User, amount: number): Promise<User> {
    const findIndexUser = this.users.findIndex(update_user => update_user.id === user.id)

    this.users[findIndexUser].balance += amount

    return user
  }

  async withdraw(user: User, amount: number): Promise<User> {
    const findIndexUser = this.users.findIndex(update_user => update_user.id === user.id)

    this.users[findIndexUser].balance -= amount

    return user
  }

  async transfer(provider: User, receiver: User, amount: number): Promise<User[]> {
    const findIndexProvider = this.users.findIndex(update_provider => update_provider.id === provider.id)

    this.users[findIndexProvider].balance -= amount

    const findIndexReceiver = this.users.findIndex(update_receiver => update_receiver.id === receiver.id)

    this.users[findIndexReceiver].balance += amount

    return [ provider, receiver ]
  }
}
