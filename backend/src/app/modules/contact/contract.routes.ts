import express from 'express';
import {
  createContract,
  getAllContracts,
  getContractById,
  updateContractById,
  deleteContractById,
  updateContractStatus,
} from './contract.controller';
import { adminAuthMiddleware } from '../../middlewares/adminMiddleware';

const router = express.Router();

router.post('/', adminAuthMiddleware, createContract);

router.get('/', getAllContracts);

router.get('/:id', getContractById);

router.put('/:id', adminAuthMiddleware, updateContractById);

router.delete('/:id', adminAuthMiddleware, deleteContractById);

router.patch('/:id/status', adminAuthMiddleware, updateContractStatus);

export const contractRouter = router;
