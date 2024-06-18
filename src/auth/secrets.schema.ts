import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({ versionKey: false, timestamps: true })
export class Secrets extends Document {
  @Prop({ required: true })
  jwtSecret: string;
}

export const SecretsSchema = SchemaFactory.createForClass(Secrets);
