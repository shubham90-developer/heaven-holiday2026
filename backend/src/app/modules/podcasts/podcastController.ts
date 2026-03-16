import { NextFunction, Request, Response } from 'express';
import { Podcast } from './podcastModel';
import {
  createPodcastSchema,
  updatePodcastSchema,
  createEpisodeSchema,
  updateEpisodeSchema,
} from './podcastValidation';

import { cloudinary } from '../../config/cloudinary';
import { appError } from '../../errors/appError';

export const getPodcasts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const podcasts = await Podcast.find().sort({ order: 1, createdAt: -1 });

    res.json({
      success: true,
      statusCode: 200,
      message: 'Podcasts retrieved successfully',
      data: podcasts,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const createPodcast = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { title, duration, language, description, status, order } = req.body;

    // Check for duplicate title
    const existing = await Podcast.findOne({ title });
    if (existing) {
      next(new appError('Podcast with this title already exists', 400));
      return;
    }

    // Image is required
    if (!req.file) {
      next(new appError('Cover image is required', 400));
      return;
    }

    const cover = req.file.path;

    const validated = createPodcastSchema.parse({
      title,
      duration,
      language,
      cover,
      description,
      status:
        status === 'active' || status === true || status === 'true'
          ? 'active'
          : 'inactive',
      order: Number(order) || 0,
    });

    const podcast = new Podcast(validated);
    await podcast.save();

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Podcast created successfully',
      data: podcast,
    });
    return;
  } catch (error) {
    // Cleanup uploaded image if validation fails
    if (req.file?.path) {
      const publicId = req.file.path.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`restaurant-podcasts/${publicId}`);
      }
    }
    next(error);
  }
};

export const updatePodcast = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { title, duration, language, description, status, order } = req.body;

    const podcast = await Podcast.findById(id);
    if (!podcast) {
      next(new appError('Podcast not found', 404));
      return;
    }

    // Check for duplicate title
    if (title && title !== podcast.title) {
      const existing = await Podcast.findOne({ title });
      if (existing) {
        next(new appError('Podcast with this title already exists', 400));
        return;
      }
    }

    // Build update data
    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (duration !== undefined) updateData.duration = duration;
    if (language !== undefined) updateData.language = language;
    if (description !== undefined) updateData.description = description;
    if (order !== undefined) updateData.order = Number(order);
    if (status !== undefined) {
      updateData.status =
        status === 'active' || status === true || status === 'true'
          ? 'active'
          : 'inactive';
    }

    // Handle image update
    if (req.file) {
      const oldImagePublicId = podcast.cover.split('/').pop()?.split('.')[0];
      if (oldImagePublicId) {
        await cloudinary.uploader.destroy(
          `restaurant-podcasts/${oldImagePublicId}`,
        );
      }
      updateData.cover = req.file.path;
    }

    // Validate update data
    const validated = updatePodcastSchema.parse(updateData);

    // Apply updates
    Object.assign(podcast, validated);
    await podcast.save();

    res.json({
      success: true,
      statusCode: 200,
      message: 'Podcast updated successfully',
      data: podcast,
    });
    return;
  } catch (error) {
    // Cleanup uploaded image if validation fails
    if (req.file?.path) {
      const publicId = req.file.path.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`restaurant-podcasts/${publicId}`);
      }
    }
    next(error);
  }
};

export const deletePodcast = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const podcast = await Podcast.findById(id);
    if (!podcast) {
      next(new appError('Podcast not found', 404));
      return;
    }

    await podcast.deleteOne();

    res.json({
      success: true,
      statusCode: 200,
      message: 'Podcast deleted successfully',
      data: podcast,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const getEpisodes = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;

    const podcast = await Podcast.findById(id);
    if (!podcast) {
      next(new appError('Podcast not found', 404));
      return;
    }

    // Sort episodes by order
    const episodes = [...podcast.episodesList].sort(
      (a, b) => a.order - b.order,
    );

    res.json({
      success: true,
      statusCode: 200,
      message: 'Episodes retrieved successfully',
      data: {
        podcastId: podcast._id,
        podcastTitle: podcast.title,
        episodes,
      },
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const addEpisode = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id } = req.params;
    const { title, date, duration, status, order } = req.body;

    const podcast = await Podcast.findById(id);
    if (!podcast) {
      next(new appError('Podcast not found', 404));
      return;
    }

    let audioUrl = req.body.audioUrl;

    if (req.file) {
      audioUrl = req.file.path;
    }

    const validated = createEpisodeSchema.parse({
      title,
      date: date ? new Date(date) : new Date(),
      duration,
      audioUrl,
      status:
        status === 'active' || status === true || status === 'true'
          ? 'active'
          : 'inactive',
      order: Number(order) || 0,
    });

    podcast.episodesList.push(validated as any);
    podcast.episodes = podcast.episodesList.length;
    await podcast.save();

    const addedEpisode = podcast.episodesList[podcast.episodesList.length - 1];

    res.status(201).json({
      success: true,
      statusCode: 201,
      message: 'Episode added successfully',
      data: addedEpisode,
    });
    return;
  } catch (error) {
    if (req.file?.path) {
      const publicId = req.file.path.split('/').pop()?.split('.')[0];
      if (publicId) {
        await cloudinary.uploader.destroy(`restaurent-podcasts/${publicId}`, {
          resource_type: 'video', // Audio files are stored as 'video' type in Cloudinary
        });
      }
    }
    next(error);
  }
};

export const updateEpisode = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, episodeId } = req.params;
    const { title, date, duration, audioUrl, status, order } = req.body;

    const podcast = await Podcast.findById(id);
    if (!podcast) {
      next(new appError('Podcast not found', 404));
      return;
    }

    const episode = podcast.episodesList.find(
      (ep) => ep._id?.toString() === episodeId,
    );

    if (!episode) {
      next(new appError('Episode not found', 404));
      return;
    }

    // Build update data
    const updateData: any = {};

    if (title !== undefined) updateData.title = title;
    if (date !== undefined) updateData.date = new Date(date);
    if (duration !== undefined) updateData.duration = duration;
    if (audioUrl !== undefined) updateData.audioUrl = audioUrl;
    if (order !== undefined) updateData.order = Number(order);
    if (status !== undefined) {
      updateData.status =
        status === 'active' || status === true || status === 'true'
          ? 'active'
          : 'inactive';
    }

    // Validate update data
    const validated = updateEpisodeSchema.parse(updateData);

    // Apply updates
    Object.assign(episode, validated);
    await podcast.save();

    res.json({
      success: true,
      statusCode: 200,
      message: 'Episode updated successfully',
      data: episode,
    });
    return;
  } catch (error) {
    next(error);
  }
};

export const deleteEpisode = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const { id, episodeId } = req.params;

    const podcast = await Podcast.findById(id);
    if (!podcast) {
      next(new appError('Podcast not found', 404));
      return;
    }

    const episodeIndex = podcast.episodesList.findIndex(
      (ep) => ep._id?.toString() === episodeId,
    );

    if (episodeIndex === -1) {
      next(new appError('Episode not found', 404));
      return;
    }

    const deletedEpisode = podcast.episodesList[episodeIndex];
    podcast.episodesList.splice(episodeIndex, 1);
    await podcast.save();

    res.json({
      success: true,
      statusCode: 200,
      message: 'Episode deleted successfully',
      data: deletedEpisode,
    });
    return;
  } catch (error) {
    next(error);
  }
};
