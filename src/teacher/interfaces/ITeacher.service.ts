import { Teacher, TeacherCreateDto } from "../teacher.model";

export interface ITeacherService {
    findAll(options: Object) : Promise<Array<Teacher>>;
    findById(id: number): Promise<Teacher | null>;
    findOne(options: Object): Promise<Teacher | null>;
    create(course: TeacherCreateDto): Promise<Teacher>;
}