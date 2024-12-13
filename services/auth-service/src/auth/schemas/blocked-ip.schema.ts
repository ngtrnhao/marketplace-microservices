import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ timestamps: true })
export class BlockedIP extends Document {
  @Prop({ require: true })
  ip: string;

  @Prop({ required: true })
  reason: string;

  @Prop({ required: true })
  blockedUntil: Date;
}

export const BlockedIPSchema = SchemaFactory.createForClass(BlockedIP);
