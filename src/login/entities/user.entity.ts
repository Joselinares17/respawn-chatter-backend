// src/login/entities/user.entity.ts

import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users') // Nombre de la tabla en PostgreSQL
export class User {
  @PrimaryGeneratedColumn()
  id: number; // Campo id, que será autoincrementado

  @Column()
  name: string; // Campo name para el nombre del usuario

  @Column()
  email: string; // Campo email para el correo electrónico del usuario
}
