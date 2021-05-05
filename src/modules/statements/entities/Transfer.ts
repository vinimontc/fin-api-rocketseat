import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn
} from 'typeorm';

import { v4 as uuid } from 'uuid';

import { User } from '../../users/entities/User';

@Entity('transfers')
export class Transfer {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column('uuid')
  sender_id: string;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'sender_id' })
  sender: User;

  @Column()
  receiver_id: string;

  @ManyToOne(() => User, user => user.id)
  @JoinColumn({ name: 'receiver_id' })
  receiver: User;

  @CreateDateColumn()
  created_at: Date;

  @CreateDateColumn()
  updated_at: Date;

  constructor() {
    if (!this.id) {
      this.id = uuid();
    }
  }
}
