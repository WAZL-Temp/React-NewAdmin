import { BaseService } from "../../sharedBase/baseService";

export class FileUploadService {
    private baseService: BaseService<File>;

    constructor(modelName: string) {
        this.baseService = new BaseService<File>(modelName);
    }

    async fileUpload(file: File): Promise<any> {
        return this.baseService.fileUpload(file);
    }

    async fileDownload(fileInfo: any): Promise<Blob> {
        return this.baseService.fileDownload(fileInfo);
    }

    async getImportData(fileInfo: any): Promise<any> {
        return this.baseService.getImportData(fileInfo);
    }

    async syncImportData(fileInfo: any): Promise<any> {
        return this.baseService.syncImportData(fileInfo);
    }
}
