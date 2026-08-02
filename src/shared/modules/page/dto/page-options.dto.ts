import { Type } from 'class-transformer';
import { IsEnum, IsInt, Max, Min } from 'class-validator';

import { ApiProperty } from '@nestjs/swagger';

import { Order } from 'src/shared/types/common.type';

export class PageOptionsDto {
  @ApiProperty({ enum: Order, default: Order.ASC })
  @IsEnum(Order)
  @Type(() => String)
  readonly order: Order = Order.ASC;

  @ApiProperty({ minimum: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  readonly page: number = 1;

  @ApiProperty({ minimum: 1, maximum: 100, default: 10 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  readonly limit: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
