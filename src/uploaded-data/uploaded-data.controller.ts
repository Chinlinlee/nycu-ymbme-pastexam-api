import { Body, Controller, Delete, Get, HttpException, HttpStatus, Logger, Param, ParseIntPipe, Post, Query, Req, Res, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { IsNumberString, IsOptional,IsNumber } from 'class-validator';
import { Type } from 'class-transformer';
import { UploadedDataService } from './uploaded-data.service';
import { Request, Response } from 'express';
import { Op } from 'sequelize';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadedDataCreateDto, UploadedDataFormDataValue, UploadedDataGetDto } from './uploaded-data.model';
import { Express } from 'express';
import * as path from 'path';
import { uuid } from 'uuidv4';
import * as fs from 'fs';
import * as mkdirp from 'mkdirp';
import { config } from '../config';
import { Course } from '../course/course.model';
import { AuthGuard } from '../Shared/Guards/auth.guard';
import { TokenService } from '../token/token.service';
import { map } from 'rxjs/operators';
import { NYCUTokenDto, NYCUUser } from '../token/token.model';

class GetUploadedDataQuery {

    uploader:string;

    @IsOptional()
    @IsNumber()
    @Type(()=> Number)
    courseId: number;
}
@Controller('uploaded-data')
export class UploadedDataController {
    
    private myLogger: Logger = new Logger(UploadedDataController.name);
    private acceptFileExtensions = [".jpg", ".png", ".pdf", ".zip"];
    constructor(
        private uploadedService: UploadedDataService,
        private tokenService: TokenService
    ) {}

    @Get()
    @UsePipes(new ValidationPipe({ skipMissingProperties : true, skipNullProperties:true }))
    @UseGuards(AuthGuard)
    public async getUploadedData(@Res() res: Response , @Query() queryParams:GetUploadedDataQuery) {
        let findOptions = [];
        if (queryParams.uploader) findOptions.push({ uploader: queryParams.uploader });
        if (queryParams.courseId) findOptions.push({ courseId: queryParams.courseId });
        let uploadedData = await this.uploadedService.findAll({
            where : {
                [Op.and] :[
                    ...findOptions
                ]
            },
            include : [
                {
                    model: Course
                }
            ]
        });
        let getUploadedDataDtoList = uploadedData.map(v=> new UploadedDataGetDto(v.toJSON()).toInstance());
        return res.status(HttpStatus.OK).json(getUploadedDataDtoList);
    }

    @Get('/uploader/:stuNum')
    @UseGuards(AuthGuard)
    public async getUploader(@Req() req: Request, @Res() res: Response, @Param('stuNum') stuNum: string) {
        let user: NYCUUser = req.session["nycuProfile"];
        if (!config.ENV.isProduction) {
            user = {
                username : "1234",
                email: "1234"
            };
        }
        if(user.username != stuNum) {
            throw new HttpException("What are you fucking doing" , HttpStatus.FORBIDDEN);
        }
        let userUploadedData = await this.uploadedService.findAll({
            where : {
                uploader: user.username
            },
            include : [
                {
                    model: Course
                }
            ]
        });
        let getUploadedDataDtoList = userUploadedData.map(v=> new UploadedDataGetDto(v.toJSON()).toInstance());
        return res.status(HttpStatus.OK).json(getUploadedDataDtoList);
    }

    @Get('/download/:id')
    @UseGuards(AuthGuard)
    public async downloadUploadedDataById(@Res() res: Response ,@Param('id' , ParseIntPipe) id: number) {
        let uploadedData =  await this.uploadedService.findById(id);
        if (!uploadedData) return res.status(400).json({
            statusCode: HttpStatus.BAD_REQUEST,
            message: [
                "Not found data"
            ],
            error: "Bad request"
        });
        let filename = uploadedData.filename;
        res.download(path.join(config.ENV.fileStorePath, filename));
    }

    @Post()
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor('file'))
    public async postUploadedData (@Res() res: Response ,@UploadedFile() file: Express.Multer.File , @Body() body: UploadedDataFormDataValue) {
        if (!file) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: [
                    "file filed not be empty"
                ],
                error: "Bad request"
            });
        }
        let fileExtName = path.parse(file.originalname).ext;
        if (!this.acceptFileExtensions.includes(fileExtName)) {
            return res.status(HttpStatus.BAD_REQUEST).json({
                statusCode: HttpStatus.BAD_REQUEST,
                message: [
                    "Not accept extension name of file, accept extensions: .jpg, .png, .pdf, .md"
                ],
                error: "Bad request"
            });
        }
        let filename = file.originalname;
        let relativeStoreDestinationDirectory = path.join("/nycuPastExamFiles" , body.uploader);
        
        let fileStoreDestinationDirectory = path.join(config.ENV.fileStorePath , relativeStoreDestinationDirectory);
        mkdirp.sync(fileStoreDestinationDirectory);
        let fileStoreDestination = path.join(fileStoreDestinationDirectory, filename);
        let writer = fs.createWriteStream(fileStoreDestination);
        writer.write(file.buffer);
        writer.end();
        writer.on("finish" , async ()=> {
            try {
                let uploadedData = new UploadedDataCreateDto(body);
                uploadedData.filename = path.join(relativeStoreDestinationDirectory, filename);
                uploadedData.filename = path.normalize(uploadedData.filename);
                let createdData = await this.uploadedService.create(uploadedData);
                let getUploadedDataDto = new UploadedDataGetDto(createdData.toJSON()).toInstance();
                res.status(HttpStatus.CREATED).json(getUploadedDataDto);
            } catch(err) {
                res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
                    statusCode: HttpStatus.INTERNAL_SERVER_ERROR ,
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
                statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
                message: [
                    `The file cannot save: ${err.stack}`
                ] ,
                error: "internal server error"
            });
        });
    }

    @Delete("/uploader/:stuNum/:uploadedDataId")
    @UseGuards(AuthGuard)
    public async deletePastexam(@Req() req: Request, @Res() res: Response, @Param('stuNum') stuNum: string, @Param('uploadedDataId', ParseIntPipe) uploadedDataId: number) {
        let user: NYCUUser = req.session["nycuProfile"];
        if (!config.ENV.isProduction) {
            user = {
                username : "1234",
                email: "1234"
            };
        }
        if(user.username != stuNum) {
            throw new HttpException("What are you fucking doing" , HttpStatus.FORBIDDEN);
        }
        let userUploadedData = await this.uploadedService.delete(uploadedDataId);
        if (userUploadedData) return res.status(HttpStatus.OK).send();
        return res.status(HttpStatus.NOT_FOUND).send();
    }

}
