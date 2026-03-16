import { Router } from 'express';
import {
  getCities,
  createCity,
  updateCity,
  deleteCity,
} from './contactCities.controller';
import multer from 'multer';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';
const router = Router();
const upload = multer({ dest: 'uploads/' });

router.get('/', getCities);

router.post('/', adminAuthMiddleware, upload.single('icon'), createCity);
router.put('/:id', adminAuthMiddleware, upload.single('icon'), updateCity);
router.delete('/:id', adminAuthMiddleware, deleteCity);

export const contactCitiesRouter = router;
