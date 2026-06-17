import {
  IsString,
  IsOptional,
  IsBoolean,
  MinLength,
  MaxLength,
  IsUUID,
  IsArray,
  ArrayNotEmpty,
  IsNotEmpty,
  IsInt,
  Min,
  Max
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoomDto {
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  roomname: string;

  @IsString()
  @MinLength(5)
  @MaxLength(200)
  description: string;

  @IsUUID()
  creatorId: string;
}

export class UpdateRoomDto {
  @IsOptional()
  @IsString()
  @MinLength(3)
  @MaxLength(50)
  roomname?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  @MaxLength(200)
  description?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class AddMembersDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  members: string[];
}

export class AddMemberDto {
  @IsUUID()
  @IsNotEmpty()
  members: string;
}

export class RemoveMembersDto {
  @IsArray()
  @ArrayNotEmpty()
  @IsUUID('4', { each: true })
  members: string[];
}

export class GetRoomsQueryDto {
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number = 10;
}

export class RoomResponseDto {
  @IsUUID()
  id: string;

  @IsString()
  roomname: string;

  @IsString()
  description: string;

  @IsBoolean()
  isActive: boolean;

  creator?: {
    id: string;
    username: string;
    email: string;
  };

  members?: Array<{
    id: string;
    username: string;
    email: string;
  }>;

  memberCount?: number;

  constructor(partial: Partial<RoomResponseDto>) {
    Object.assign(this, partial);
  }
}
