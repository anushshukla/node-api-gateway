import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

import Route from "./route";

@Entity({name: "routeConfig"})
export default class RouteConfig {
  @PrimaryGeneratedColumn()
  public routeConfigId!: number;

  @Column()
  public routeId!: number;

  @Column({
    length: 255,
  })
  public routeConfigName!: string;

  @Column({
    length: 255,
  })
  public routeConfigValue!: string;

  @ManyToOne(() => Route, (route) => route.configs)
  public route!: Route;
}
