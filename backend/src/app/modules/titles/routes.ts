import { Router } from 'express';
import { getPageTitles, updatePageTitles } from './controllers';

const router = Router();

router.get('/', getPageTitles);
router.patch('/', updatePageTitles);

export const TitleRouter = router;
