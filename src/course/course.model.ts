import { Table, Column , Model, DataType, TableOptions } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { ICourse } from './interfaces/ICourse';


interface ICourseCreation extends Optional<ICourse, 'courseId'> {};

const tableOptions: TableOptions = {
    timestamps: false,
    modelName: "Course"
};
@Table(tableOptions)
export class Course extends Model<ICourse, ICourseCreation> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey:true,
        unique: true,
        field: "courseId"
    })
    public courseId: number;
    
    //"課程名稱"
    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: "name"
    })
    public name: string;

    //"年級類型" ,1=大一, 2=大二, 3=大三, 4=大四, 5=碩一, 6=碩二,
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: "gradeType"
    })
    public gradeType: number;

    //課程上課老師字串
    @Column({
        type: DataType.STRING,
        allowNull:false,
        field: "teachers"
    })
    public teachers: string;
}

export class CourseCreateDto implements ICourse{
    courseId: number;
    name: string;
    gradeType: number;
    teachers: string;
    constructor(value: Object) {
        this.gradeType = value["gradeType"];
        this.name = value["name"];
        this.teachers = value["teachers"];
    }
}