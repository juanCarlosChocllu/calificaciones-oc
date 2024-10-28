import { Module } from '@nestjs/common';
import { ProvidersService } from './providers.service';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports:[HttpModule],
  providers: [ProvidersService],
  exports:[ProvidersService]
})
export class ProvidersModule {}
