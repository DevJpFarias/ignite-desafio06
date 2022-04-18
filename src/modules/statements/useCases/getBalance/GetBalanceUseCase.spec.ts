import { AppError } from "../../../../shared/errors/AppError"
import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceUseCase } from "./GetBalanceUseCase"

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let getBalanceUseCase: GetBalanceUseCase

describe('Get Balance Test', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    )
  })

  it('Should be able to get balance for user', async () => {
    const user = await createUserUseCase.execute({
      name: 'User',
      email: 'user@gmail.com',
      password: 'password'
    })

    const user_id = user.id!

    const getBalance = await getBalanceUseCase.execute({
      user_id
    })

    expect(getBalance).toEqual({"balance": 0, "statement": []})
  })

  it('Should not be able to get a balance of nonexistent user', () => {
    expect(async () => {
      const user_id = '12345'

      await getBalanceUseCase.execute({
        user_id
      })
    }).rejects.toBeInstanceOf(AppError)
  })
})
