const router = require('express').Router();
const { getSettings, updateSettings, toggle2FA } = require('../controllers/settingsController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);
router.get('/',    getSettings);
router.put('/',    updateSettings);
router.put('/2fa', toggle2FA);

module.exports = router;
