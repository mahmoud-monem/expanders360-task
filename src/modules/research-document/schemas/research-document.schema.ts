import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ResearchDocumentDocument = ResearchDocument & Document;

@Schema({ timestamps: true })
export class ResearchDocument {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string;

  @Prop({ type: [String], default: [] })
  tags: string[];

  @Prop({ required: true })
  projectId: number;

  @Prop({ required: false })
  fileUrl?: string;

  @Prop({ required: false })
  fileName?: string;

  @Prop({ required: false })
  fileSize?: number;

  @Prop({ required: false })
  mimeType?: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;
}

export const ResearchDocumentSchema = SchemaFactory.createForClass(ResearchDocument);
