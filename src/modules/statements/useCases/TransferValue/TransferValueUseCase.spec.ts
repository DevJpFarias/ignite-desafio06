import { InMemoryUsersRepository } from "../../../users/repositories/in-memory/InMemoryUsersRepository";
import { InMemoryStatementsRepository } from "../../repositories/in-memory/InMemoryStatementsRepository";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { TransferValueError } from "./TransferValueError";
import { TransferValueUseCase } from "./TransferValueUseCase";

let inMemoryStatementsRepository: InMemoryStatementsRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let createStatementUseCase: CreateStatementUseCase
let transferValueUseCase: TransferValueUseCase

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

describe('Transfer Value Test', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()
    inMemoryStatementsRepository = new InMemoryStatementsRepository()
    createStatementUseCase = new CreateStatementUseCase(
      inMemoryUsersRepository,inMemoryStatementsRepository
    )
    transferValueUseCase = new TransferValueUseCase(
      inMemoryUsersRepository, inMemoryStatementsRepository
    )
  })

  it('Should not be possible to do an transfer with inexistent provider', async () => {
    const receiver = await inMemoryUsersRepository.create({
      name: 'Receiver',
      email: 'receiver@mail.com',
      password: 'password'
    })

    await expect(transferValueUseCase.execute({
      provider_id: '12345',
      receiver_id: receiver.id!,
      amount: 100,
      description: 'Transfer description'
    })).rejects.toEqual(new TransferValueError.UserNotFound())
  })

  it('Should not be possible to transfer to inexistent receiver', async () => {
    const provider = await inMemoryUsersRepository.create({
      name: 'Provider',
      email: 'provider@mail.com',
      password: 'password'
    })

    await expect(transferValueUseCase.execute({
      provider_id: provider.id!,
      receiver_id: '12345',
      amount: 100,
      description: 'Transfer description'
    })).rejects.toEqual(new TransferValueError.UserNotFound())
  })

  it('Should not be possible to transfer amounts greater than what is available in an account balance', async () => {
    const provider = await inMemoryUsersRepository.create({
      name: 'Provider',
      email: 'provider@mail.com',
      password: 'password'
    })

    const receiver = await inMemoryUsersRepository.create({
      name: 'Receiver',
      email: 'receiver@mail.com',
      password: 'password'
    })

    await expect(transferValueUseCase.execute({
      provider_id: provider.id!,
      receiver_id: receiver.id!,
      amount: 100,
      description: 'Transfer description'
    })).rejects.toEqual(new TransferValueError.InsufficientFunds())
  })

  it('Should not be able to do an transfer with negative value', async () => {
    const provider = await inMemoryUsersRepository.create({
      name: 'Provider',
      email: 'provider@mail.com',
      password: 'password'
    })

    const receiver = await inMemoryUsersRepository.create({
      name: 'Receiver',
      email: 'receiver@mail.com',
      password: 'password'
    })

    await expect(transferValueUseCase.execute({
      provider_id: provider.id!,
      receiver_id: receiver.id!,
      amount: -50,
      description: 'Transfer description'
    })).rejects.toEqual(new TransferValueError.InvalidValue())
  })

  it('Should not be able to do an transfer with zero value', async () => {
    const provider = await inMemoryUsersRepository.create({
      name: 'Provider',
      email: 'provider@mail.com',
      password: 'password'
    })

    const receiver = await inMemoryUsersRepository.create({
      name: 'Receiver',
      email: 'receiver@mail.com',
      password: 'password'
    })

    await expect(transferValueUseCase.execute({
      provider_id: provider.id!,
      receiver_id: receiver.id!,
      amount: 0,
      description: 'Transfer description'
    })).rejects.toEqual(new TransferValueError.InvalidValue())
  })

  it('Should be able to do a transfer and the value is withdrawn of provider balance', async () => {
    const provider = await inMemoryUsersRepository.create({
      name: 'Provider',
      email: 'provider@mail.com',
      password: 'password'
    })

    await createStatementUseCase.execute({
      user_id: provider.id!,
      type: OperationType.DEPOSIT,
      amount: 50,
      description: 'Sei lá'
    })

    const receiver = await inMemoryUsersRepository.create({
      name: 'Receiver',
      email: 'receiver@mail.com',
      password: 'password'
    })

    const transfer = await transferValueUseCase.execute({
      provider_id: provider.id!,
      receiver_id: receiver.id!,
      amount: 50,
      description: 'Transfer description'
    })

    expect(provider.balance).toEqual(0)
    expect(transfer.type).toEqual('transfer')
  })

  it('Should be able to do a transfer and the value is deposited of receiver balance', async () => {
    const provider = await inMemoryUsersRepository.create({
      name: 'Provider',
      email: 'provider@mail.com',
      password: 'password'
    })

    await createStatementUseCase.execute({
      user_id: provider.id!,
      type: OperationType.DEPOSIT,
      amount: 50,
      description: 'Sei lá'
    })

    const receiver = await inMemoryUsersRepository.create({
      name: 'Receiver',
      email: 'receiver@mail.com',
      password: 'password'
    })

    const transfer = await transferValueUseCase.execute({
      provider_id: provider.id!,
      receiver_id: receiver.id!,
      amount: 50,
      description: 'Transfer description'
    })

    expect(receiver.balance).toEqual(50)
    expect(transfer.type).toEqual('transfer')
  })

  it('Should be able to do a transfer', async () => {
    const provider = await inMemoryUsersRepository.create({
      name: 'Provider',
      email: 'provider@mail.com',
      password: 'password'
    })

    await createStatementUseCase.execute({
      user_id: provider.id!,
      type: OperationType.DEPOSIT,
      amount: 50,
      description: 'Sei lá'
    })

    const receiver = await inMemoryUsersRepository.create({
      name: 'Receiver',
      email: 'receiver@mail.com',
      password: 'password'
    })

    const transfer = await transferValueUseCase.execute({
      provider_id: provider.id!,
      receiver_id: receiver.id!,
      amount: 50,
      description: 'Transfer description'
    })

    expect(provider.balance).toEqual(0)
    expect(receiver.balance).toEqual(50)
    expect(transfer.type).toEqual('transfer')
  })
})
