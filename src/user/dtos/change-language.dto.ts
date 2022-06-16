import { IsString } from "class-validator";
import { LanguageType } from "../enums";

export class ChangeLangDto {

  @IsString()
  lang: LanguageType
}