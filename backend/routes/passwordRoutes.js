const router = require('express').Router();
const { getPasswords, createPassword, updatePassword, deletePassword, toggleFavorite, getStats } = require('../controllers/passwordController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/stats',           getStats);
router.get('/',                getPasswords);
router.post('/',               createPassword);
router.put('/:id',             updatePassword);
router.delete('/:id',          deletePassword);
router.patch('/:id/favorite',  toggleFavorite);

module.exports = router;
