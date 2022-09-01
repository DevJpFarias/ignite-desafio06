import { inject, injectable } from "tsyringe";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { Statement } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ITransferValueDTO } from "./ITransferValueDTO";
import { TransferValueError } from "./TransferValueError";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

@injectable()
export class TransferValueUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository
  ) {}

  async execute({provider_id, receiver_id, amount, description}: ITransferValueDTO): Promise<Statement> {
    const provider = await this.usersRepository.findById(provider_id);

    if(!provider) {
      throw new TransferValueError.UserNotFound();
    }

    const receiver = await this.usersRepository.findById(receiver_id)

    if(!receiver) {
      throw new TransferValueError.UserNotFound();
    }

    if(provider.balance < amount) {
      throw new TransferValueError.InsufficientFunds()
    }

    if(amount <= 0) {
      throw new TransferValueError.InvalidValue()
    }

    const user_id = receiver.id!

    const transfer = await this.statementsRepository.create({
      user_id,
      sender_id: provider.id,
      description,
      type: OperationType.TRANSFER,
      amount
    })

    await this.usersRepository.transfer(provider, receiver, amount)

    return transfer
  }
}
