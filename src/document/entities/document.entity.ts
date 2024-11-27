import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../..//user/entities/user.entity';

@Entity()
export class Document {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255 })
  filename: string; // Name of the file

  @Column({ type: 'varchar', length: 500 })
  path: string; // Path to the file in storage

  @Column({ type: 'varchar', length: 500, nullable: true })
  description: string; // Optional description for the document

  @ManyToOne(() => User, (user) => user.documents)
  user: User; // Many documents can be associated with one user

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date; // Timestamp of document creation

  @Column({ type: 'timestamp', nullable: true })
  updatedAt: Date; // Timestamp for when the document was last updated
}
