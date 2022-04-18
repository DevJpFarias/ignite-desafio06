import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { CreateUserError } from "./CreateUserError"

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase

describe('Create User Test', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
  })

  it('Should be able to create a new user', async () => {
    const user = await createUserUseCase.execute({
      name: 'User',
      email: 'user@email.com',
      password: 'password'
    })

    expect(user).toHaveProperty("id")
  })

  it('Should not be able to create an existent user', async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: 'name',
        email: 'user@email.com',
        password: 'password'
      })

      await createUserUseCase.execute({
        name: 'name',
        email: 'user@email.com',
        password: 'password'
      })
    }).rejects.toBeInstanceOf(CreateUserError)
  })
})
