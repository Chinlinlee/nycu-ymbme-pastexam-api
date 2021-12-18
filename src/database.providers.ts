
import { Sequelize } from "sequelize-typescript";
import { SEQUELIZE } from "./constants";
import { Course, CourseCreateDto } from "./course/course.model";
import { config } from './config';
import * as CourseData from '../data/courses.json';
import * as TeacherData from '../data/teachers.json';
import { Logger } from "@nestjs/common";
import { Op } from "sequelize";
import { Teacher, TeacherCreateDto } from "./teacher/teacher.model";
import { UploadedData } from "./uploaded-data/uploaded-data.model";


export const databaseProviders = [
    {
        provide: SEQUELIZE,
        useFactory : async ()=> {
            try {
                const sequelize = new Sequelize(config.SQL);
                sequelize.addModels([Course, Teacher, UploadedData]);
                if (config.initSQL) {
                    await sequelize.sync({ force : true});
                } else {
                    await sequelize.sync();
                }
                if (config.initSQLData) {
                    await createCourseData(sequelize);
                    await createTeacherData(sequelize);
                }
                return sequelize;
            } catch(e) {
                Logger.error(e);
                process.exit(1);
            }
            
        }
    }
]


async function createTeacherData (sequelize: Sequelize) {
    for(let teacher of TeacherData) {
        let teacherObj  = {name: teacher}
        let teacherCreateDto = new TeacherCreateDto(teacherObj);
        Logger.log(`create teacher data ${JSON.stringify(teacherCreateDto)}`);
        await sequelize.models["teacher"].findOrCreate({
            where: {
                name: teacher
            },
            defaults: teacherCreateDto
        });
    }
}

async function createCourseData (sequelize: Sequelize) {
    for (let key in CourseData) {
        let item = CourseData[key];
        let course = new CourseCreateDto(item);
        Logger.log(`create data ${key} ${JSON.stringify(course)}`);
        await sequelize.models["course"].findOrCreate({
            where : {
                [Op.and] : [
                    { name: item.name } , 
                    { gradeType: item.gradeType }
                ]
            },
            defaults : course
        });
    }
}