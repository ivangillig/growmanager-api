import { Router } from 'express';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { getAllSeedBanks, createSeedBank } from '../controllers/seedBankController.js';

const router = Router();

router.get('/', authenticateUser, getAllSeedBanks);
router.post('/', authenticateUser, createSeedBank);

export default router;

