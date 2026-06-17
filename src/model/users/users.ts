import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { Rooms } from '../rooms/rooms';
import { Exclude } from 'class-transformer';

@Entity()
export class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  email: string;

  @ManyToMany(() => Rooms, rooms => rooms.members, {
    cascade: ['insert', 'remove']
  })
  @JoinTable({ name: "groups" })
  groups: Rooms[];


  @Column()
  username: string;

  @OneToMany(() => Rooms, rooms => rooms.creator)
  createdgroups: Rooms[]

  @Exclude()
  @Column()
  password: string

  @Column({ default: true })
  isActive: boolean;
}


