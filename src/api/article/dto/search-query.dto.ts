import { PageOptionsDto } from 'src/shared/modules/page/dto/page-options.dto';

export class SearchQueryDto extends PageOptionsDto {
  readonly title?: string;
  readonly tags?: string;
  readonly author?: string;
}
