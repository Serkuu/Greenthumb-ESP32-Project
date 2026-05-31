import { WebSocketGateway, SubscribeMessage, MessageBody } from '@nestjs/websockets';
import { HeadUnitService } from './head-unit.service';
import { TelemetryPingDto } from './dto/telemetry-ping.dto';
import { UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { WsApiKeyGuard } from '../auth/guard/api-key/ws-api-key.guard';

@WebSocketGateway({ path: '/head-unit' })
export class HeadUnitGateway {
  constructor(private readonly headUnitService: HeadUnitService) { }

  @UseGuards(WsApiKeyGuard)
  @UsePipes(new ValidationPipe({ transform: true }))
  @SubscribeMessage('telemetry')
  async handleTelemetry(@MessageBody() data: TelemetryPingDto) {
    await this.headUnitService.saveTelemetry(data);
    return { event: 'telemetry_ack', status: 'success' };
  }
}
