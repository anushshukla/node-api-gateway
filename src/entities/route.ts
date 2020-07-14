import {
  BaseEntity,
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
  JoinColumn,
} from "typeorm";

import Middleware from "./middleware";
import RouteConfig from "./route-config";

@Entity({name: "routes"})
// eslint-disable-next-line require-jsdoc
export default class Route extends BaseEntity {
  @PrimaryGeneratedColumn()
  public routeId!: number;

  @Column({
    length: 255,
  })
  public routePath!: string;

  @Column("tinyint")
  public allowGlobalMiddlewares!: number;

  @Column()
  public isActive!: boolean;

  @Column()
  public isDeleted!: boolean;

  @Column()
  public createdAt!: string;

  @Column()
  public updatedAt!: string;

  @OneToMany(() => RouteConfig, (routeConfig) => routeConfig.route)
  @JoinColumn({ name: "routeId" })
  public configs!: RouteConfig[];

  @ManyToMany(() => Middleware)
  @JoinTable({
    name: 'routeMiddlewares',
    joinColumn: {
      name: 'routeId',
      referencedColumnName: 'routeId',
    },
    inverseJoinColumn: {
      name: 'middlewareId',
      referencedColumnName: 'middlewareId',
    }
  })
  public middlewares!: Middleware[];
}
