import { Request, Response } from "express";
import { container } from "tsyringe";
import { TransferValueUseCase } from "./TransferValueUseCase";

enum OperationType {
  DEPOSIT = 'deposit',
  WITHDRAW = 'withdraw',
  TRANSFER = 'transfer'
}

export class TransferValueController {
    async execute(request: Request, response: Response) {
      const { id: user_id } = request.user
      const { receiver_id } = request.params
      const { amount, description } = request.body

      const splittedPath = request.originalUrl.split('/')
      const type = splittedPath[splittedPath.length - 1] as OperationType;

      const transferValueUseCase = container.resolve(TransferValueUseCase)

      const transfer = await transferValueUseCase.execute({
        provider_id: user_id,
        receiver_id,
        amount,
        description
      })

      return response.status(201).json(transfer)
    }
}
