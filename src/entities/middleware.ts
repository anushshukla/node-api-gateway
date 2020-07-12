import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
// eslint-disable-next-line require-jsdoc
export default class Route {
  @PrimaryGeneratedColumn()
  middlewareId!: number;

  @Column({
    length: 255,
  })
  middlewareName!: string;

  @Column({
    length: 255,
  })
  defaultOptions!: string;

  @Column('tinyint')
  isGlobalMiddleware!: number;

  @Column()
  isActive!: boolean;

  @Column()
  isDeleted!: boolean;

  @Column()
  createdAt!: string;

  @Column()
  updatedAt!: string;
}
