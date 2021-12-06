import { Inject, Injectable } from "@nestjs/common";
import { TEACHER_REPOSITORY } from "../constants";
import { ITeacherService } from "./interfaces/ITeacher.service";
import { Teacher, TeacherCreateDto } from "./teacher.model";
import { FindOptions } from "sequelize/types";
import { ITeacher } from "./interfaces/ITeacher";

@Injectable()
export class TeacherService implements ITeacherService{

    constructor(
        @Inject(TEACHER_REPOSITORY)
        private teacherRepository: typeof Teacher
    ) {}

    public async findAll(options: FindOptions<ITeacher>) {
        return await this.teacherRepository.findAll(options);
    }

    public async findById(id: number) {
        return await this.teacherRepository.findByPk(id);
    }

    public async findOne(options: FindOptions<ITeacher>) {
        return await this.teacherRepository.findOne(options);
    }

    public async create(teacher: TeacherCreateDto) {
        return await this.teacherRepository.create(teacher);
    }
}