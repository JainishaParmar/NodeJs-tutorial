import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
  res.render('index', { title: 'Express' });
});

const user = { name: 'Test' };
const role = { type: 'admin' };

export default router;
export { user, role, router };
