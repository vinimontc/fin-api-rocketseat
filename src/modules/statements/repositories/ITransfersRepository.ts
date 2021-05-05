import { Transfer } from "../entities/Transfer";

export interface ICreateTransferDTO {
  sender_id: string;
  receiver_id: string;
}

export interface ITransfersRepository {
  create: ({sender_id, receiver_id}: ICreateTransferDTO) => Promise<Transfer>;
}
