import { Column,DataType,TableOptions,Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { Course } from 'src/course/course.model';
import { Teacher } from 'src/teacher/teacher.model';
import { IsNotEmpty, IsNumberString } from 'class-validator';
import { IUploadedData } from './interfaces/IUploadedData';
import { instanceToPlain, instanceToInstance , Expose, Type, Exclude } from 'class-transformer';

interface IUploadedDataCreation extends Optional<IUploadedData,'uploadedDataId'>{};

const tableOptions: TableOptions = {
    timestamps: true,
    modelName: "uploadedData",
};

@Table(tableOptions)
export class UploadedData extends Model<IUploadedData, IUploadedDataCreation> {
    @Column({
        type: DataType.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        unique: true,
        field: "uploadedDataId"
    })
    public uploadedDataId: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: "uploader"
    })
    public uploader: string;

    @ForeignKey(()=> Teacher)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: "teacherId"
    })
    public teacherId: number;

    @BelongsTo(()=> Teacher)
    public teacher: Teacher;

    @ForeignKey(()=> Course)
    @Column({
        type: DataType.INTEGER,
        allowNull: false,
        field: "courseId",
    })
    public courseId: number;

    @BelongsTo(()=> Course)
    public course: Course;
    
    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: "filename"
    })
    public filename: string;
}

export class UploadedDataCreateDto {
    uploader:string;
    teacherId: number;
    courseId: number;
    filename: string;
    constructor(obj: Object={}) {
        Object.assign(this, obj)
    }
    toJson() {
        return {
            uploader: this.uploader,
            teacherId: this.teacherId,
            courseId: this.courseId,
            filename: this.filename
        }
    }
}

export class UploadedDataGetDto {

    @Expose()
    uploadedDataId: number;

    @Expose()
    uploader:string;

    @Exclude()
    teacherId: string;

    @Expose()
    teacher: Teacher;

    @Exclude()
    courseId: number;

    @Expose()
    course: Course;

    @Exclude()
    filename: string;

    constructor(obj: Object= {}) {
        Object.assign(this, obj);
    }

    toInstance() {
        return instanceToInstance(this);
    }
}

export class UploadedDataFormDataValue {
    @IsNotEmpty()
    uploader:string;

    @IsNotEmpty()
    @IsNumberString()
    teacherId: number;

    @IsNotEmpty()
    @IsNumberString()
    courseId: number;
}
