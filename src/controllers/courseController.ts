import { getAllCourses, getCourseById, getCourseTree } from "../services/courseService";
import { Request, Response, NextFunction } from 'express';

import { OK } from "../types/http";

export const allCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const courses = await getAllCourses();
        return res.status(OK).json(courses);
    } catch (error) {
        next(error);
    }
};


export const getCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Id is required" });
        }
        const course = await getCourseById(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        return res.json(course);
    } catch (error) {
        next(error);
    }
};

export const getFullCourse = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Id is required" });
        }
        const course = await getCourseTree(id);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        return res.json(course);
    } catch (error) {
        next(error);
    }
}; 


export const createCourse = async (req: Request, res: Response, next: NextFunction) => {};
export const updateCourse = async (req: Request, res: Response, next: NextFunction) => {};
export const deleteCourse = async (req: Request, res: Response, next: NextFunction) => {};


