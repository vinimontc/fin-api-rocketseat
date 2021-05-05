import { inject, injectable } from "tsyringe";

import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../enums/OperationType";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { ITransfersRepository } from "../../repositories/ITransfersRepository";
import { CreateStatementError } from "./CreateStatementError";
interface IRequest {
  user_id: string;
  receiver_id?: string;
  type: OperationType;
  amount: number;
  description: string;
}
@injectable()
export class CreateStatementUseCase {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('StatementsRepository')
    private statementsRepository: IStatementsRepository,

    @inject('TransfersRepository')
    private transfersRepository: ITransfersRepository
  ) {}

  async execute({ user_id, receiver_id, type, amount, description }: IRequest) {
    const user = await this.usersRepository.findById(user_id);

    if(!user) {
      throw new CreateStatementError.UserNotFound();
    }

    if(!user.id) {
      throw new CreateStatementError.UserNotFound();
    }

    if(receiver_id && type === "transfer") {
      const receiver = await this.usersRepository.findById(receiver_id);

      if(!receiver) {
        throw new CreateStatementError.UserNotFound();
      }

      const { balance } = await this.statementsRepository.getUserBalance({ user_id });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }

      const transfer = await this.transfersRepository.create({
        sender_id: user.id,
        receiver_id
      });

      const statementSenderOperation = await this.statementsRepository.create({
        user_id,
        type,
        amount,
        description,
        transfer_id: transfer.id
      });

      await this.statementsRepository.create({
        user_id: receiver_id,
        type,
        amount,
        description,
        transfer_id: transfer.id
      });

      return statementSenderOperation;
    }

    if(type === 'withdraw') {
      const { balance } = await this.statementsRepository.getUserBalance({ user_id });

      if (balance < amount) {
        throw new CreateStatementError.InsufficientFunds()
      }
    }

    const statementOperation = await this.statementsRepository.create({
      user_id,
      type,
      amount,
      description
    });

    return statementOperation;
  }
}
