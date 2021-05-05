import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { OperationType } from '../../enums/OperationType';

import { CreateStatementUseCase } from './CreateStatementUseCase';

export class CreateStatementController {
  async execute(request: Request, response: Response) {
    const { id: user_id } = request.user;
    const { user_id: receiver_id } = request.params;
    const { amount, description } = request.body;

    const splittedPath = request.originalUrl.split('/')
    const type = splittedPath[4] as OperationType;

    const createStatement = container.resolve(CreateStatementUseCase);

    const statement = await createStatement.execute({
      user_id,
      receiver_id,
      type,
      amount,
      description
    });

    return response.status(201).json(statement);
  }
}
