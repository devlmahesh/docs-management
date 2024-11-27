import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Document } from '../../document/entities/document.entity';
import { Role } from '../../auth/role.enum';
import { Exclude } from 'class-transformer';
@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 100 })
  username: string;

  @Column({ type: 'varchar', length: 255, unique: true })
  email: string;

  @Exclude() // This will exclude the password field from the response
  @Column({ type: 'varchar', length: 255 })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.VIEWER })
  role: Role;

  @OneToMany(() => Document, (document) => document.user)
  documents: Document[]; // One user can have many documents

  // You can also add additional fields, like status, etc.
}
