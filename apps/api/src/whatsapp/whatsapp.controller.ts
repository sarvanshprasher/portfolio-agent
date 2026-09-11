import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { WhatsappService } from './whatsapp.service';
import { Response } from 'express';

@Controller('whatsapp')
export class WhatsappController {
  constructor(private readonly whatsappService: WhatsappService) {}

  @Post('webhook')
  async handleWebhook(@Body() body: any, @Res() res: Response) {
    const message = body.Body;

    let twimlXml = '<Response></Response>';

    if (message) {
      twimlXml = await this.whatsappService.handleIncomingMessage(message);
    }

    // Set XML header cleanly and deliver raw string payload
    return res
      .status(HttpStatus.OK)
      .header('Content-Type', 'text/xml')
      .send(twimlXml);
  }
}