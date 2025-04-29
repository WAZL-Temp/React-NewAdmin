import { useEffect, useState } from "react";
import { useBaseService } from "../sharedBase/baseService";
import { format, parseISO } from "../sharedBase/globalUtils";
import { DataTablePageEvent } from "../sharedBase/globalImports";

type UseImportPageProps = {
    props: {
        baseModelName?: string;
        service: ReturnType<typeof useBaseService>;
    };
};

export function useImportPage({ props }: UseImportPageProps) {
    const [first, setFirst] = useState(0);
    const [rows, setRows] = useState(10);
    const [downloading, setDownloading] = useState<boolean>(false);
    const [importAllow, setImportAllow] = useState(false);

    useEffect(() => {
        const fetchImportStatus = async () => {
            try {
                const data = await props.service.checkImportData();
                if (data && data.length > 0) {
                    setImportAllow(false);
                } else {
                    setImportAllow(true);
                }
            } catch (error) {
                console.error('Error checking import status:', error);
            }
        };

        fetchImportStatus();
    }, [props.service, props.service.checkImportData]);

    const onPage = (event: DataTablePageEvent) => {
        setFirst(event.first);
        setRows(event.rows);
    };

    const downloadEmptyTemplate = async () => {
        const payload = { rowsCount: 50, needSampleData: "" };
        return await props.service.importExcel(payload);
    };

    const downloadSampleTemplate = async () => {
        const payload = { rowsCount: 50, needSampleData: "sample" };
        return await props.service.importExcel(payload);
    };

    const handleDownloadTemplate = async (isSample: boolean) => {
        setDownloading(true);
        try {
            const response = isSample
                ? await downloadSampleTemplate()
                : await downloadEmptyTemplate();

            const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${props.baseModelName}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
        } finally {
            setDownloading(false);
        }
    };

    const formatDate = (dateString: string | Date | undefined) => {
        if (!dateString) return "";
        const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
        return format(date, "MM-dd-yyyy");
    };
    
    return {
        first, rows, onPage, handleDownloadTemplate, downloading, importAllow,formatDate
    }
}