import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository"
import { CreateUserUseCase } from "../../../users/useCases/createUser/CreateUserUseCase"
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository"
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase"
import { GetStatementOperationError } from "./GetStatementOperationError"
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase"

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
}

let inMemoryUsersRepository: InMemoryUsersRepository
let inMemoryStatementsRepository: InMemoryStatementsRepository
let createUserUseCase: CreateUserUseCase
let createStatementUseCase: CreateStatementUseCase
let getStatementOperationUseCase: GetStatementOperationUseCase

describe('Get Statement Operation Test', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository)
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    )
    getStatementOperationUseCase = new GetStatementOperationUseCase(
      inMemoryUsersRepository,
      inMemoryStatementsRepository
    )
  })

  it('Should be able to get a statement operation', async () => {
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

    const statement_id = deposit.id!

    const getStatementOperation = await getStatementOperationUseCase.execute({
      user_id: user_id,
      statement_id: statement_id
    })

    expect(getStatementOperation).toHaveProperty('id')
    expect(getStatementOperation).toHaveProperty('user_id')
    expect(getStatementOperation.type).toBe('deposit')
  })

  it('Should not be able to get a statement operation of a nonexistent user', async () => {
    expect(async () => {
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

      const statement_id = deposit.id!

      const getStatementOperation = await getStatementOperationUseCase.execute({
        user_id: '12345',
        statement_id: statement_id
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound)
  })

  it('Should not be able to get a nonexistent statement operation', async () => {
    expect(async () => {
      const user = await createUserUseCase.execute({
        name: 'User',
        email: 'user@gmail.com',
        password: 'password'
      })

      const user_id = user.id!

      const getStatementOperation = await getStatementOperationUseCase.execute({
        user_id: user_id,
        statement_id: '12345'
      })
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound)
  })
})
