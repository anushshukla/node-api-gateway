import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity({name: "middlewares"})
export default class Middleware extends BaseEntity {
  @PrimaryGeneratedColumn()
  public middlewareId!: number;

  @Column({
    length: 255,
  })
  public middlewareName!: string;

  @Column({
    length: 255,
  })
  public defaultOptions!: string;

  @Column("tinyint")
  public isGlobalMiddleware!: number;

  @Column()
  public isActive!: boolean;

  @Column()
  public isDeleted!: boolean;

  @Column()
  public createdAt!: string;

  @Column()
  public updatedAt!: string;
}
