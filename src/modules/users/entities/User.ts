import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';
import { v4 as uuid } from 'uuid';

import { Statement } from '../../statements/entities/Statement';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  password: string;

  @OneToMany(() => Statement, statement => statement.user)
  statement: Statement[];

  @Column({ default: 0 })
  balance: number

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  constructor() {
    if(!this.id) {
      this.id = uuid();
    }

    if(!this.balance) {
      this.balance = 0
    }
  }
}
