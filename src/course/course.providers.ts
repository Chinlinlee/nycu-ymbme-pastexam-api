import { COURSE_REPOSITORY } from "../constants";
import { Course } from "./course.model";

export const CourseProviders = [
    {
        provide: COURSE_REPOSITORY,
        useValue: Course
    }
];