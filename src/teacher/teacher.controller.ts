import { Controller, Get, HttpStatus, Param, ParseIntPipe, Post, Query, Res } from '@nestjs/common';
import { TeacherService } from './teacher.service';
import { Response } from 'express';
import { Op } from 'sequelize';

@Controller('teacher')
export class TeacherController {
    constructor(
        private teacherService: TeacherService
    ) {}
    @Get()
    public async getTeacher(@Res() res: Response, @Query('name') name: string) {
        let findOptions = [];
        if(name) findOptions.push({
            name: {
                [Op.like] : `%${name}%`
            }
        })
        let teacher = await this.teacherService.findAll({
            where: {
                [Op.and] : [
                    ...findOptions
                ]
            }
        });
        return res.status(HttpStatus.OK).json(teacher);
    }

    @Get(':id')
    public async getTeacherById(@Param('id', ParseIntPipe) id: number, @Res() res: Response) {
        let teacher = await this.teacherService.findById(id);
        return res.status(HttpStatus.OK).json(teacher);
    }
}
