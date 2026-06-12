import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import datasource from './datasource';

@Module({
  imports: [TypeOrmModule.forRoot(datasource.options)],
})
/**
 * Database module that exposes the shared TypeORM connection.
 */
export class DatabaseModule {}
