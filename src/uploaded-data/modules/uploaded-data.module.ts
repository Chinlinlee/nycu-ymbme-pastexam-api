import { Module } from '@nestjs/common';
import { DatabaseModule } from 'src/database.module';
import { HttpModule } from '@nestjs/axios';

import { TokenService } from 'src/token/token.service';
import { UploadedDataController } from '../uploaded-data.controller';

import { UploadedDataProvide } from '../uploaded-data.provides';
import { UploadedDataService } from '../uploaded-data.service';
import { TokenModule } from 'src/token/modules/token.module';


@Module({
    imports : [
        DatabaseModule,
        HttpModule,
        TokenModule
    ],
    controllers: [UploadedDataController],
    providers: [
        ...UploadedDataProvide,
        UploadedDataService,
        TokenService
    ]
})
export class UploadedDataModule {}
