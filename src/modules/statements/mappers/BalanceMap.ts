import { Statement } from "../entities/Statement";

export class BalanceMap {
  static toDTO({statement, balance}: { statement: Statement[], balance: number}) {
    const parsedStatement = statement.map(({
      id,
      amount,
      description,
      transfer,
      user_id,
      type,
      created_at,
      updated_at
    }) => {
      if (transfer && transfer.sender_id === user_id) {
        return ({
          id,
          receiver_id: transfer.receiver_id,
          amount: Number(amount),
          description,
          type,
          created_at,
          updated_at
        })
      } else if (transfer && transfer.receiver_id === user_id) {
        return ({
          id,
          sender_id: transfer.sender_id,
          amount: Number(amount),
          description,
          type,
          created_at,
          updated_at
        })
      } else {
        return ({
          id,
          amount: Number(amount),
          description,
          type,
          created_at,
          updated_at
        })
      }
    });

    return {
      statement: parsedStatement,
      balance: Number(balance)
    }
  }
}
