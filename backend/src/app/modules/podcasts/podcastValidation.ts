import { z } from 'zod';

export const episodeSchema = z.object({
  _id: z.string().optional(),
  title: z
    .string()
    .trim()
    .min(1, 'Episode title is required')
    .max(200, 'Episode title cannot exceed 200 characters'),
  date: z.date().or(z.string()),
  duration: z.string().trim().min(1, 'Episode duration is required'),
  audioUrl: z.string().trim().optional(),
  status: z.enum(['active', 'inactive']).default('active'),
  order: z.number().int('Order must be an integer').default(0),
});

export const createEpisodeSchema = episodeSchema.omit({ _id: true });

export const updateEpisodeSchema = episodeSchema.partial().omit({ _id: true });

export const createPodcastSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Podcast title is required')
    .max(200, 'Title cannot exceed 200 characters'),
  duration: z.string().trim().min(1, 'Duration is required'),
  language: z
    .string()
    .trim()
    .min(1, 'Language is required')
    .max(50, 'Language cannot exceed 50 characters'),
  cover: z.string().min(1, 'Cover image is required'),
  description: z
    .string()
    .trim()
    .min(1, 'Description is required')
    .max(2000, 'Description cannot exceed 2000 characters'),
  status: z.enum(['active', 'inactive']).default('active'),
  order: z.number().int('Order must be an integer').default(0),
});

export const updatePodcastSchema = createPodcastSchema.partial();

export type CreatePodcast = z.infer<typeof createPodcastSchema>;
export type UpdatePodcast = z.infer<typeof updatePodcastSchema>;
export type CreateEpisode = z.infer<typeof createEpisodeSchema>;
export type UpdateEpisode = z.infer<typeof updateEpisodeSchema>;
