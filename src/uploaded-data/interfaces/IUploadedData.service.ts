import { UploadedData, UploadedDataCreateDto } from "../uploaded-data.model";

export interface IUploadedDataService {
    findAll(options: Object) : Promise<Array<UploadedData>>
    findById(id: number): Promise<UploadedData| null>;
    findOne(options: Object): Promise<UploadedData|null>;
    create(uploadedData: UploadedDataCreateDto): Promise<UploadedData>;
    delete(id: number): Promise<number>;
}