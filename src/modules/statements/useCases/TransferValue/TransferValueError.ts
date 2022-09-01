import { AppError } from "../../../../shared/errors/AppError";

export namespace TransferValueError {
  export class UserNotFound extends AppError {
    constructor() {
      super('User not found', 404);
    }
  }

  export class InsufficientFunds extends AppError {
    constructor() {
      super('Insufficient funds', 400);
    }
  }

  export class InvalidValue extends AppError {
    constructor() {
      super('Invalid value', 400)
    }
  }
}
