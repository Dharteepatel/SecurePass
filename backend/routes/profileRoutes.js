const router = require('express').Router();
const { getProfile, updateProfile, changePassword, deleteAccount } = require('../controllers/profileController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/',         getProfile);
router.put('/',         updateProfile);
router.put('/password', changePassword);
router.delete('/',      deleteAccount);

module.exports = router;
