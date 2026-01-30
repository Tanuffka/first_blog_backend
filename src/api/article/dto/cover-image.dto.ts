import { Type } from 'class-transformer';
import { IsNotEmpty, IsNumber, IsUrl, MaxLength } from 'class-validator';

export class CropOptionsDto {
  @IsNotEmpty({ message: 'Field x is required' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'Field x should be a number' },
  )
  readonly x: number;

  @IsNotEmpty({ message: 'Field y is required' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'Field y should be a number' },
  )
  readonly y: number;

  @IsNotEmpty({ message: 'Field width is required' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'Field width should be a number' },
  )
  readonly width: number;

  @IsNotEmpty({ message: 'Field height is required' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'Field height should be a number' },
  )
  readonly height: number;

  @IsNotEmpty({ message: 'Field zoom is required' })
  @IsNumber(
    { allowInfinity: false, allowNaN: false },
    { message: 'Field zoom should be a number' },
  )
  readonly zoom: number;
}

export class CoverOriginalImageDto {
  @IsNotEmpty({ message: 'Field fileKey is required' })
  @IsUrl(undefined, { message: 'Field fileKey should be a valid URL' })
  @MaxLength(100, { message: 'Field fileKey should not exceed 100 characters' })
  readonly fileKey: string;

  @IsNotEmpty({ message: 'Field fileDownloadUrl is required' })
  @IsUrl(undefined, { message: 'Field fileDownloadUrl should be a valid URL' })
  @MaxLength(300, {
    message: 'Field fileDownloadUrl should not exceed 300 characters',
  })
  readonly fileDownloadUrl: string;
}

export class CoverCroppedImageDto extends CoverOriginalImageDto {
  @Type(() => CropOptionsDto)
  @IsNotEmpty({ message: 'Field cropOptions is required' })
  readonly cropOptions: CropOptionsDto;
}
