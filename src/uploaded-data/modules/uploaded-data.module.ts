import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database.module';
import { UploadedDataController } from '../uploaded-data.controller';

import { UploadedDataProvide } from '../uploaded-data.provides';
import { UploadedDataService } from '../uploaded-data.service';


@Module({
    imports : [DatabaseModule],
    controllers: [UploadedDataController],
    providers: [
        ...UploadedDataProvide,
        UploadedDataService
    ]
})
export class UploadedDataModule {}
