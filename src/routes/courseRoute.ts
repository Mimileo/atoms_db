// src/routes/courseRoute.ts

import { Router } from 'express';

import { allCourses, getCourse, getFullCourse } from '../controllers/courseController';



const router = Router();

router.get('/', allCourses);

router.get('/:id', getCourse);

router.get('/full/:id', getFullCourse);


export default router;

