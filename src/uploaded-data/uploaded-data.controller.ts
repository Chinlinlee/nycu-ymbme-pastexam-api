import { Body, Controller, Get, HttpException, HttpStatus, Logger, Post, Query, Res, UploadedFile, UseInterceptors } from '@nestjs/common';
import { UploadedDataService } from './uploaded-data.service';
import { Response } from 'express';
import { Op } from 'sequelize';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedDataCreateDto, UploadedDataFormDataValue } from './uploaded-data.model';
import { Express } from 'express';
import * as path from 'path';
import { uuid } from 'uuidv4';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import { config } from '../config';
import { Teacher } from 'src/teacher/teacher.model';
import { Course } from 'src/course/course.model';

@Controller('uploaded-data')
export class UploadedDataController {
    private myLogger: Logger = new Logger(UploadedDataController.name);
    private acceptFileExtensions = [".jpg", ".png", ".pdf", ".md"];
    constructor(
        private uploadedService: UploadedDataService
    ) {}

    @Get()
    public async getUploadedData(@Res() res: Response , @Query('uploader') uploader: string) {
        let findOptions = [];
        if (uploader) findOptions.push({
            uploader: uploader
        });
        let uploadedData = await this.uploadedService.findAll({
            where : {
                [Op.and] :[
                    ...findOptions
                ]
            },
            include : [
                {
                    model: Teacher
                } ,
                {
                    model: Course
                }
            ]
        });
        return res.status(HttpStatus.OK).json(uploadedData);
    }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    public async postUploadedData (@Res() res: Response ,@UploadedFile() file: Express.Multer.File , @Body() body: UploadedDataFormDataValue) {
        if (!file) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: "400",
                message: [
                    "file filed not be empty"
                ],
                error: "Bad request"
            });
        }
        let fileExtName = path.parse(file.originalname).ext;
        if (!this.acceptFileExtensions.includes(fileExtName)) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: "400",
                message: [
                    "Not accept extension name of file, accept extensions: .jpg, .png, .pdf, .md"
                ],
                error: "Bad request"
            });
        }
        let relativeStoreDestinationDirectory = path.join("/nycuPastExamFiles" , body.uploader);
        let fileStoreDestinationDirectory = path.join(config.ENV.fileStorePath , relativeStoreDestinationDirectory);
        mkdirp.sync(fileStoreDestinationDirectory);
        let fileStoreDestination = path.join(fileStoreDestinationDirectory, `${uuid()}${fileExtName}`);
        let writer = fs.createWriteStream(fileStoreDestination);
        writer.write(file.buffer);
        writer.end();
        writer.on("finish" , async ()=> {
            try {
                let uploadedData = new UploadedDataCreateDto(body);
                uploadedData.filename = relativeStoreDestinationDirectory;
                let createdData = await this.uploadedService.create(uploadedData);
                res.status(HttpStatus.CREATED).json(createdData);
            } catch(err) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    statusCode: "500" ,
                    message: [
                        `The file cannot save: ${err.stack}`
                    ] ,
                    error: "internal server error"
                });
            }
        });
        writer.on("error", (err)=> {
            this.myLogger.error(err);
            res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                statusCode: "500" ,
                message: [
                    `The file cannot save: ${err.stack}`
                ] ,
                error: "internal server error"
            });
        });
    }

}
