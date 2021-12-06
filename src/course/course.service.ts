import { Inject, Injectable } from '@nestjs/common';
import { Course, CourseCreateDto } from './course.model';
import { ICourseService } from './interfaces/ICourse.service';
import { COURSE_REPOSITORY } from 'src/constants';
import { ICourse } from './interfaces/ICourse';
import { FindOptions } from 'sequelize';

@Injectable()
export class CourseService implements ICourseService {

    constructor(
        @Inject(COURSE_REPOSITORY) 
        private courseRepository: typeof Course
    ) {}

    public async findAll(options : FindOptions<ICourse>):Promise<Array<Course>> {
        return await this.courseRepository.findAll(options);
    }
    public async findById(id: number): Promise<Course | null> {
        return await this.courseRepository.findByPk(id);
    }
    public async findOne(options: FindOptions<ICourse>): Promise<Course| null> {
        return await this.courseRepository.findOne(options);
    }
    public async create(course: CourseCreateDto): Promise<Course> {
        return await this.courseRepository.create(course);
    }
}