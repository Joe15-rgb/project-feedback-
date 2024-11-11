import express from 'express';
import Blogs from '../controllers/blogControllers';

const router = express.Router()


router.route("/")
  .get(Blogs.index)


router.route("/traitement")
  .post(Blogs.traitement)




export default router