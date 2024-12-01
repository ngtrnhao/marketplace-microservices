import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  BadRequsetException,
} from '@nestjs/common';
import { Response } from 'express';

@Catch()
