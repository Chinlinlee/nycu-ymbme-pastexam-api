import { Column,DataType,TableOptions,Model, Table, ForeignKey, BelongsTo } from 'sequelize-typescript';
import { Optional } from 'sequelize/types';
import { Course } from 'src/course/course.model';
import { IsString, IsNotEmpty, IsNumberString } from 'class-validator';
import { IUploadedData } from './interfaces/IUploadedData';
import { instanceToInstance , Expose,  Exclude, Transform } from 'class-transformer';

interface IUploadedDataCreation extends Optional<IUploadedData,'uploadedDataId'>{};

const tableOptions: TableOptions = {
    timestamps: true,
    modelName: "uploaded_data",
    tableName: "uploaded_data"
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
        type: DataType.INTEGER,
        allowNull: false,
        field: "semNo"
    })
    public semNo: number;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: "uploader"
    })
    public uploader: string;

    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: "teachersName"
    })
    public teachersName: string;

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
        field: "category"
    })
    public category: string;
    
    @Column({
        type: DataType.STRING,
        allowNull: false,
        field: "filename"
    })
    public filename: string;

    @Column({
        type: DataType.STRING,
        allowNull: true,
        field: "description"
    })
    public description: string;
}

export class UploadedDataCreateDto {
    uploader:string;
    semNo: number;
    teachersName: string;
    courseId: number;
    category: string;
    filename: string;
    constructor(obj: Object={}) {
        Object.assign(this, obj)
    }
}

export class UploadedDataGetDto {

    @Expose()
    uploadedDataId: number;

    @Expose()
    semNo: number;

    @Expose()
    uploader: string;

    @Expose()
    teachersName: string;

    @Exclude()
    courseId: number;

    @Expose()
    course: Course;

    @Expose()
    category: string;

    @Expose()
    @Transform(({ value })=> {
        console.debug(value.split(/\/\\/).pop());
        return value.split(/[\/\\]/gim).pop();
    })
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
    @IsNumberString()
    semNo: number;

    @IsNotEmpty()
    @IsString()
    uploader:string;

    @IsNotEmpty()
    @IsString()
    teachersName: string;

    @IsNotEmpty()
    @IsNumberString()
    courseId: number;

    @IsNotEmpty()
    @IsString()
    category: string;
}
