import { Table, TableOptions, Column, Model, DataType} from "sequelize-typescript";
import { Optional } from "sequelize/types";
import { ITeacher } from "./interfaces/ITeacher";



interface ITeacherCreation extends Optional<ITeacher, 'teacherId'> {};

const tableOptions: TableOptions = {
    timestamps: false,
    modelName: "teacher",
    tableName: "teacher"
};
@Table(tableOptions)
export class Teacher extends Model<ITeacherCreation, ITeacher> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true, 
        unique: true,
        field: "teacherId"
    })
    teacherId: number;
    
    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: "name"
    })
    name: string;
}

export class TeacherCreateDto implements ITeacher{
    teacherId: number;
    name: string;
    constructor(value:Object) {
        this.teacherId = value["teacherId"];
        this.name = value["name"];
    }
}