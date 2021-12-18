import { Inject, Injectable } from '@nestjs/common';
import { FindOptions } from 'sequelize/types';
import { UPLOADED_DATA_REPOSITORY } from '../constants';
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
        return await this.uploadedDataRepository.findAll(options);
    }

    public async findById(id: number) {
        return await this.uploadedDataRepository.findByPk(id);
    }

    public async findOne(options: FindOptions<UploadedData>) {
        return await this.uploadedDataRepository.findOne(options);
    }

    public async create(uploadedData: UploadedDataCreateDto) {
        return await this.uploadedDataRepository.create(uploadedData);;
    }

    public async delete(id: number) {
        return await this.uploadedDataRepository.destroy({
            where: {
                uploadedDataId: id
            }
        });
    }
}
