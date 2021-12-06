import { Module } from '@nestjs/common';
import { CourseModule } from './course/modules/course.module';
import { TeacherModule } from './teacher/modules/teacher.module';
import { UploadedDataModule } from './uploaded-data/modules/uploaded-data.module';
import { TokenModule } from './token/modules/token.module';

@Module({
  imports: [CourseModule, TeacherModule, UploadedDataModule, TokenModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
