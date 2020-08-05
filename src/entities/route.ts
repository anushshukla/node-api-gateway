import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";

import Middleware from "./middleware";
import RouteConfig from "./route-config";

interface transposedConfigType {
  [key: string]: string[] | string;
}

@Entity({name: "routes"})
// eslint-disable-next-line require-jsdoc
export default class Route extends BaseEntity {
  @PrimaryGeneratedColumn()
  public routeId!: number;

  @Column({
    length: 255,
  })
  public routePath!: string;

  @Column({
    length: 10,
  })
  public method!: string;

  @Column("tinyint")
  public allowGlobalMiddlewares!: number;

  @Column("tinyint")
  public allowErrorHandling!: number;

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
    name: "routeMiddlewares",
    joinColumn: {
      name: "routeId",
      referencedColumnName: "routeId",
    },
    inverseJoinColumn: {
      name: "middlewareId",
      referencedColumnName: "middlewareId",
    }
  })
  public middlewares!: Middleware[];

  public _transposedConfigs!: transposedConfigType;

  public getTransposedConfigs(): transposedConfigType {
    const transposedConfig: transposedConfigType = {};
    this.configs.forEach((config) => {
      const { routeConfigName, routeConfigValue } = config;
      const routeConfig = transposedConfig[routeConfigName];
      let configValue: string | string[] = routeConfigValue;
      if (Array.isArray(routeConfig)) {
        configValue = routeConfig;
        configValue.push(routeConfigValue);
      } else if (routeConfig) {
        configValue = [<string> routeConfig, routeConfigValue];
      }
      transposedConfig[routeConfigName] = configValue;
    });
    return transposedConfig;
  }

  set transposedConfigs(transposedConfigs: transposedConfigType) {
    this._transposedConfigs = transposedConfigs;
  }

  get transposedConfigs() {
    return this._transposedConfigs;
  }
}
