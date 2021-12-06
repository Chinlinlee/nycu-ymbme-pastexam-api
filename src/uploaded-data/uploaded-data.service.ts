import { Inject, Injectable } from '@nestjs/common';
import { FindOptions } from 'sequelize/types';
import { UPLOADED_DATA_REPOSITORY } from 'src/constants';
import { IUploadedData } from './interfaces/IUploadedData';
import { IUploadedDataService } from './interfaces/IUploadedData.service';
import { UploadedData, UploadedDataCreateDto, UploadedDataGetDto } from './uploaded-data.model';

@Injectable()
export class UploadedDataService implements IUploadedDataService{
    constructor (
        @Inject(UPLOADED_DATA_REPOSITORY)
        private uploadedDataRepository: typeof UploadedData
    ) {}
    
    public async findAll(options: FindOptions<IUploadedData>) {
        let foundDataList = await this.uploadedDataRepository.findAll(options);
        let uploadedDataList = foundDataList.map((data)=> new UploadedDataGetDto(data.toJSON()).toInstance());
        return uploadedDataList;
    }

    public async findById(id: number) {
        let foundData = await this.uploadedDataRepository.findByPk(id);
        let uploadedData = new UploadedDataGetDto(foundData).toInstance();
        return uploadedData;
    }

    public async findOne(options: FindOptions<UploadedData>) {
        return await this.uploadedDataRepository.findOne(options);
    }

    public async create(uploadedData: UploadedDataCreateDto) {
        return await this.uploadedDataRepository.create(uploadedData);
    }
}
