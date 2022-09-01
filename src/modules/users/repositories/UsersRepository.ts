import { getRepository, Repository } from "typeorm";
import { floatToIntegerCents } from "../../../shared/utils/stringUtil";

import { User } from "../entities/User";
import { ICreateUserDTO } from "../useCases/createUser/ICreateUserDTO";
import { IUsersRepository } from "./IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return this.repository.findOne({
      email,
    });
  }

  async findById(user_id: string): Promise<User | undefined> {
    return this.repository.findOne(user_id);
  }

  async create({ name, email, password }: ICreateUserDTO): Promise<User> {
    const user = this.repository.create({ name, email, password });

    return this.repository.save(user);
  }

  async deposit(user: User, amount: number): Promise<User> {
    const value_cents = await floatToIntegerCents(amount)

    user.balance += value_cents

    await this.repository.save(user)

    return user
  }

  async withdraw(user: User, amount: number): Promise<User> {
    const value_cents = await floatToIntegerCents(amount)

    user.balance -= value_cents

    await this.repository.save(user)

    return user
  }

  async transfer(provider: User, receiver: User, amount: number): Promise<User[]> {
    const value_cents = await floatToIntegerCents(amount)

    provider.balance -= value_cents

    receiver.balance += value_cents

    await this.repository.save(provider)
    await this.repository.save(receiver)

    return [ provider, receiver ]
  }
}
