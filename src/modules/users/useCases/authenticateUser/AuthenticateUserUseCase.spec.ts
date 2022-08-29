import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../createUser/CreateUserUseCase"
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase"
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError"

let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let authenticateUserUseCase: AuthenticateUserUseCase

describe('Authenticate User Test', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository)
  })

  it('Should not be able to authenticate if email is incorrect', async () => {
    expect(async () => {
      await createUserUseCase.execute({
        name: 'User',
        email: 'user@email.com',
        password: 'password'
      })

      await authenticateUserUseCase.execute({
        email: 'incorrect@email.com',
        password: 'password'
      })
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError)
  })

  it('Should not be able to authenticate if password is incorrect', async () => {
    await createUserUseCase.execute({
      name: 'User',
      email: 'user@email.com',
      password: 'password'
    })

    await expect(authenticateUserUseCase.execute({
        email: 'user@email.com',
        password: 'incorrect'
      })
    ).rejects.toEqual(new IncorrectEmailOrPasswordError())
  })
})
