import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database.module';
import { CourseProviders } from '../course.providers';
import { CourseController } from '../course.controller';
import { CourseService } from '../course.service';


@Module({
    imports : [DatabaseModule],
    controllers: [CourseController],
    providers: [
        CourseService,
        ...CourseProviders
    ]
})
export class CourseModule {}
