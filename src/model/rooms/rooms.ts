import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, ManyToMany } from 'typeorm';
import { Users } from '../users/users';
@Entity()
export class Rooms {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  roomname: string;

  @ManyToMany(() => Users, users => users.groups)
  members: Users[];

  @Column()
  description: string;

  @ManyToOne(() => Users, users => users.createdgroups,)
  @JoinColumn({ name: 'creatorId' })
  creator: Users

  @Column({ default: true })
  isActive: boolean;
}
