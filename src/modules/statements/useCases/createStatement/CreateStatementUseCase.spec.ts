import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { GetBalanceUseCase } from "../getBalance/GetBalanceUseCase"
import { CreateStatementError } from "./CreateStatementError"
import { CreateStatementUseCase } from "./CreateStatementUseCase"


enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let getBalanceUseCase: GetBalanceUseCase

describe('Create Statement Test', () => {
  beforeEach(() => {
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository, inMemoryStatementsRepository
    )
    getBalanceUseCase = new GetBalanceUseCase(
      inMemoryStatementsRepository,
      inMemoryUsersRepository
    )
  })

  it('Should be able to create a new deposit', async () => {
    const user = await createUserUseCase.execute({
      name: 'User',
      email: 'user@gmail.com',
      password: 'password'
    })

    const user_id = user.id!

    const deposit = await createStatementUseCase.execute({
      user_id: user_id,
      type: OperationType.DEPOSIT,
      amount: 1,
      description: 'Sei lá'
    })

    expect(deposit).toHaveProperty("id")
    expect(deposit).toHaveProperty("user_id")
    expect(deposit.type).toBe('deposit')
  })

  it('Should be able to create a new ', async () => {
    const user = await createUserUseCase.execute({
      name: 'User',
      email: 'user@gmail.com',
      password: 'password'
    })

    const user_id = user.id!

    await createStatementUseCase.execute({
      user_id: user_id,
      type: OperationType.DEPOSIT,
      amount: 1,
      description: 'Depósito'
    })

    const withdraw = await createStatementUseCase.execute({
      user_id: user_id,
      type: OperationType.WITHDRAW,
      amount: 1,
      description: 'Saque'
    })

    expect(withdraw).toHaveProperty("id")
    expect(withdraw).toHaveProperty("user_id")
    expect(withdraw.type).toBe('withdraw')
  })

  it('Should not be able to create a statement if user does not exists', async () => {
    await expect(createStatementUseCase.execute({
        user_id: '12345',
        type: OperationType.DEPOSIT,
        amount: 100,
        description: 'Sei lá'
      })
    ).rejects.toEqual(new CreateStatementError.UserNotFound())
  })

  it('Should be able to create a new withdraw', async () => {
    const user = await createUserUseCase.execute({
      name: 'User',
      email: 'user@gmail.com',
      password: 'password'
    })

    const user_id = user.id!

    await createStatementUseCase.execute({
      user_id: user_id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: 'Sei lá'
    })

    const statementWithdraw = await createStatementUseCase.execute({
      user_id: user_id,
      type: OperationType.WITHDRAW,
      amount: 50,
      description: 'Comprar pão po'
    })


    expect(statementWithdraw).toHaveProperty('id')
    expect(statementWithdraw).toHaveProperty('user_id')
    expect(statementWithdraw.type).toBe('withdraw')
  })

  it('Should not be able to create a withdraw if user balance is empty', async () => {
    const user = await createUserUseCase.execute({
      name: 'User',
      email: 'user@gmail.com',
      password: 'password'
    })

    const user_id = user.id!

    await expect(createStatementUseCase.execute({
        user_id: user_id,
        type: OperationType.WITHDRAW,
        amount: 50,
        description: 'Comprar pão po'
      })
    ).rejects.toEqual(new CreateStatementError.InsufficientFunds())
  })
})
