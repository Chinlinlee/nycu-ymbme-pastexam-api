import { Course, CourseCreateDto } from "../course.model"; 

export interface ICourseService {
    findAll(options: Object) : Promise<Array<Course>>;
    findById(id: number): Promise<Course | null>;
    findOne(options: Object): Promise<Course | null>;
    create(course: CourseCreateDto): Promise<Course>;
}