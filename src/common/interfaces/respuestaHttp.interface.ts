import { HttpStatus } from '@nestjs/common';

export interface respuestaHttpI<T> {
  status: HttpStatus;
  data?: T;
}
