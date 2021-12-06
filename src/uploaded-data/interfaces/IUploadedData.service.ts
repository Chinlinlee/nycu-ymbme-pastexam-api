import { UploadedData, UploadedDataCreateDto, UploadedDataGetDto } from "../uploaded-data.model";

export interface IUploadedDataService {
    findAll(options: Object) : Promise<Array<UploadedDataGetDto>>
    findById(id: number): Promise<UploadedDataGetDto| null>;
    findOne(options: Object): Promise<UploadedData|null>;
    create(uploadedData: UploadedDataCreateDto): Promise<UploadedData>;
}