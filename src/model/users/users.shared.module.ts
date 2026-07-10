import { Module } from "@nestjs/common"
import { TypeOrmModule } from "@nestjs/typeorm"
import { Users } from "./users"
@Module({
  imports: [TypeOrmModule.forFeature([Users])],
  exports: [TypeOrmModule],  // Export so other modules can use Users repo
})
export class SharedModule { }
