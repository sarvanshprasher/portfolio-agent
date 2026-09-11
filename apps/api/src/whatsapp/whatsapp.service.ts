import { Injectable, Logger } from '@nestjs/common';
import { stockAgent } from '@portfolio-agent/ai';
import MessagingResponse from 'twilio/lib/twiml/MessagingResponse';

@Injectable()
export class WhatsappService {
  private readonly logger = new Logger(WhatsappService.name);

  async handleIncomingMessage(message: string): Promise<string> {
    const startTime = Date.now();
    this.logger.log(`Processing inbound message: ${message}`);

    // Skip AI agent for system setup commands
    const trimmed = message.trim().toLowerCase();
    if (trimmed.startsWith('join') || trimmed === 'stop') {
      const twiml = new MessagingResponse();
      return twiml.toString();
    }

    // Pass incoming message to Mastra (handles both stock quotes & portfolio queries)
    const response = await stockAgent.generate(message, {
      providerOptions: {
        groq: {
          reasoningEffort: 'low',
          reasoningFormat: 'hidden',
        },
      },
    });

    const replyText = response?.text?.trim() || 'No response generated.';
    this.logger.log(`Agent finished in ${Date.now() - startTime}ms`);

    // Clean up special formatting characters
    const sanitizedText = replyText
      .replace(/\u00A0/g, ' ')
      .replace(/‑/g, '-');

    const twiml = new MessagingResponse();
    twiml.message(sanitizedText);
    return twiml.toString();
  }
}