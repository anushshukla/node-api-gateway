import {
  Entity,
  Column,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable
} from 'typeorm';

import RouteConfig from './route-config';
import Middleware from './middleware';

@Entity()
// eslint-disable-next-line require-jsdoc
export default class Route {
  @PrimaryGeneratedColumn()
  routeId!: number;

  @Column({
    length: 255
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

  @OneToMany(() => RouteConfig, (routeConfig) => routeConfig.route)
  configs!: RouteConfig[];

  @ManyToMany(() => Middleware)
  @JoinTable()
  middlewares!: Middleware[];
}
