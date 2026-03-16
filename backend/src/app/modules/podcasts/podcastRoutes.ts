import { Router } from 'express';
import {
  getPodcasts,
  createPodcast,
  updatePodcast,
  deletePodcast,
  getEpisodes,
  addEpisode,
  updateEpisode,
  deleteEpisode,
} from './podcastController';
import { upload } from '../../config/cloudinary';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = Router();

router.get('/', getPodcasts);

router.post('/', adminAuthMiddleware, upload.single('cover'), createPodcast);

router.put('/:id', adminAuthMiddleware, upload.single('cover'), updatePodcast);

router.delete('/:id', adminAuthMiddleware, deletePodcast);

router.get('/:id/episodes', getEpisodes);

router.post(
  '/:id/episodes',
  adminAuthMiddleware,
  upload.single('audio'),
  addEpisode,
);

router.put('/:id/episodes/:episodeId', adminAuthMiddleware, updateEpisode);

router.delete('/:id/episodes/:episodeId', adminAuthMiddleware, deleteEpisode);

export const podcastRouter = router;
