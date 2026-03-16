import mongoose, { Schema, Document } from 'mongoose';

export interface IPodcast extends Document {
  title: string;
  episodes: number;
  duration: string;
  language: string;
  cover: string;
  description: string;
  status: 'active' | 'inactive';
  order: number;
  episodesList: {
    _id?: string;
    title: string;
    date: Date;
    duration: string;
    audioUrl?: string;
    status: 'active' | 'inactive';
    order: number;
  }[];
  createdAt?: Date;
  updatedAt?: Date;
}
