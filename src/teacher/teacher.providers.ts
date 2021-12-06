import { TEACHER_REPOSITORY } from "src/constants";
import { Teacher } from "./teacher.model";

export const TeacherProvides = [
    {
        provide: TEACHER_REPOSITORY,
        useValue: Teacher
    }
];
