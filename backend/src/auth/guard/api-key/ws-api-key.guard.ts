import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { WsException } from '@nestjs/websockets';

@Injectable()
export class WsApiKeyGuard implements CanActivate {
  constructor(private configService: ConfigService) { }

  canActivate(context: ExecutionContext): boolean {
    // W kontekście WebSockets, payload to dane przesłane przez klienta.
    // Oczekujemy, że ESP32 prześle 'apiKey' wewnątrz obiektu z danymi.
    const data = context.switchToWs().getData();
    const apiKey = data?.apiKey;

    const validApiKey = this.configService.get<string>('ESP_API_KEY');

    if (!apiKey || apiKey !== validApiKey) {
      throw new WsException('Wrong hardware key. WsGuard is blocking the telemetry stream.');
    }

    return true;
  }
}
