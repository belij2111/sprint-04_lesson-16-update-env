import { applyDecorators } from '@nestjs/common';
import { Trim } from '../transform/trim';
import { IsString } from 'class-validator';

export const TrimIsString = () => applyDecorators(Trim(), IsString());
