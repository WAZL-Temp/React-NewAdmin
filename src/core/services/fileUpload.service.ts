import { useBaseService } from "../../sharedBase/baseService";
import { FileInfo } from "../../types/listpage";

export const useFileUploadService = (modelName: string) => {
    const baseService = useBaseService<File>(modelName);

    const fileUpload = async (file: File): Promise<File> => {
        return baseService.fileUpload(file);
    };

    const fileDownload = async (fileInfo: FileInfo): Promise<Blob> => {
        return baseService.fileDownload(fileInfo);
    };

    const getImportData = async (fileInfo: FileInfo) => {
        return baseService.getImportData(fileInfo);
    };

    const syncImportData = async (fileInfo: FileInfo) => {
        return baseService.syncImportData(fileInfo);
    };

    return {
        fileUpload,
        fileDownload,
        getImportData,
        syncImportData,
    };
};
