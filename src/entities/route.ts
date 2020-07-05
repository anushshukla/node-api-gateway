import {Entity, Column, PrimaryGeneratedColumn} from 'typeorm';

@Entity()
export default class Route {
  @PrimaryGeneratedColumn()
  routeId!: number;

  @Column({
    length!: 255,
  })
  routePath!: string;

  @Column('tinyint')
  allowGlobalMiddlewares!: number;

  @Column()
  isActive!: boolean;

  @Column()
  isDeleted!: boolean;

  @Column()
  createdAt!: string;

  @Column()
  updatedAt!: string;
}
