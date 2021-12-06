import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database.module';
import { TeacherController } from '../teacher.controller';
import { TeacherProvides } from '../teacher.providers';
import { TeacherService } from '../teacher.service';

@Module({
    imports : [DatabaseModule] ,
    controllers : [TeacherController],
    providers: [
        ...TeacherProvides,
        TeacherService
    ]
})
export class TeacherModule {}
