import { Controller, Get, HttpStatus, Post, Param, Res, Query, Logger, ParseIntPipe } from '@nestjs/common';
import { Response } from 'express';
import { Op } from 'sequelize';
import { CourseService } from './course.service';

@Controller('course')
export class CourseController {
    private readonly courseControllerLogger : Logger;
    constructor(
        private courseService: CourseService
    ) {
        this.courseControllerLogger = new Logger(CourseController.name , {
            timestamp: true
        });
    }
    
    @Get()
    public async getCourse(@Res() res: Response , @Query('name') name:string, @Query('teachers') teachers: string) {
        this.courseControllerLogger.log(`name: ${name} , teachers: ${teachers}`);
        let findOptions = [];
        if(name) findOptions.push({name: {
            [Op.like]: `%${name}%`
        }});
        if(teachers) findOptions.push({
            teachers: {
                [Op.like] : `%${teachers}%`
            }
        });
        const course = await this.courseService.findAll({
            where : {
                [Op.and] : [
                    ...findOptions
                ]
            } ,
            order : [
                ['name', 'asc']
            ]
        });
        return res.status(HttpStatus.OK).json(course);
    }

    @Get(":id")
    public async getCourseById(@Param('id', ParseIntPipe) id:number ,  @Res() res) {
        const course = await this.courseService.findById(id);
        return res.status(HttpStatus.OK).json(course);
    }
}
