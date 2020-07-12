import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

import Route from './route';

@Entity()
// eslint-disable-next-line require-jsdoc
export default class RouteConfig {
  @PrimaryGeneratedColumn()
  routeConfigId!: number;

  @PrimaryGeneratedColumn()
  routeId!: number;

  @Column({
    length: 255,
  })
  routeConfigName!: string;

  @Column({
    length: 255,
  })
  routeConfigValue!: string;

  @ManyToOne(() => Route, (route) => route.configs)
  route!: Route;
}
