import { UPLOADED_DATA_REPOSITORY } from "../constants";
import { UploadedData } from "./uploaded-data.model";

export const UploadedDataProvide = [
    {
        provide: UPLOADED_DATA_REPOSITORY,
        useValue: UploadedData
    }
]