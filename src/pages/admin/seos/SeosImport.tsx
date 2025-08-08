import { useState,useMemo } from 'react';
import { SeosService } from '../../../core/service/seos.service';
import { BsArrowLeft, Button, Column, DataTable, DataTableFilterMeta, Dialog, FilterMatchMode, Image, InputText, RiEyeFill, RiFileDownloadFill, RiFileFill, SplitButton, Tooltip } from '../../../sharedBase/globalImports';
import { useTranslation } from '../../../sharedBase/globalUtils';
import { useFileUploadService } from "../../../core/service/fileUpload.service";
import FileUploadMain from '../../../components/FileUploadMain';
import TableSkeleton from '../../../components/TableSkeleton';
import successimg from '../../../assets/images/success.gif';
import { useImportPage } from '../../../hooks/useImportPage';
import { Seo } from '../../../core/model/seo';
import { CustomFile } from '../../../core/model/customfile';

const SeosImport = () => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<{ importFile: string }>({ importFile: '' });
  const [showTable, setShowTable] = useState<boolean>(false);
  const [importedData, setImportedData] = useState<Seo[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<any>(null);
   const fileUploadService = useFileUploadService("Seo");
  const [validFile, setValidFile] = useState(false);
  const [importValidateComplete, setImportValidateComplete] = useState(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [importSyncComplete, setImportSyncComplete] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);
  // const baseModelName = "seos";
const typeName= "seo";
  const seosService = SeosService();
  const [filters, setFilters] = useState<DataTableFilterMeta>({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });

  const { onPage, first, rows, handleDownloadTemplate, downloading, importAllow }
    = useImportPage({
      props: {
        baseModelName: typeName,
        service: seosService
      }
    });

  const items = [
    {
      label: t("globals.emptyTemplate"),
      icon: <RiFileFill style={{ color: '#059669' }} />,
      command: () => handleDownloadTemplate(false)
    },
    {
      label: t("globals.sampleTemplate"),
      icon: <RiFileFill style={{ color: '#3B82F6' }} />,
      command: () => handleDownloadTemplate(true)
    }
  ];

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!uploadedFile) {
      setErrors({ importFile: 'Import File is required!' });
    } else {
      setErrors({ importFile: '' });
      setLoading(true);
      setShowTable(true);

      try {
        const importedData = await fileUploadService.getImportData(uploadedFile[0]);

        setImportedData(importedData);
        setTotalRecords(importedData.length);

        let inValidFile = false;
        importedData.forEach((item: any) => {
          if (item.remark != null || (item.importRemark && item.importRemark.length > 2)) {
            inValidFile = true;
          }
        });
        setValidFile(!inValidFile);
        setImportValidateComplete(true);


      } catch (error) {
        console.error('Error during file upload or data import:', error);
        setImportedData([]);
        setTotalRecords(0);
      } finally {
        setLoading(false);
      }
    }
  };

  const syncImportData = async () => {
    try {

      if (!uploadedFile) {
        console.error("No file uploaded")
        return
      }
      setImportSyncComplete(true);
      setLoading(true);
      setLoadingSync(true);
      const response = await fileUploadService.syncImportData(uploadedFile);
      if (response && response.length > 0) {
        setLoadingSync(false);
        setTimeout(() => {
          setImportSyncComplete(false);
        }, 2000);
      }
    } catch (error) {
      console.error("Error syncing data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleFileUpload = (files: CustomFile) => {
    setUploadedFile(files);
  };
const columnsConfigDefault = useMemo(() =>[
			 {field: 'id', header: t("seos.columns.fields.id"), isDefault: true, show: true }, 
			 {field: 'name', header: t("seos.columns.fields.name"), isDefault: true, show: true }, 
			 {field: 'title', header: t("seos.columns.fields.title"), isDefault: true, show: true }, 
			 {field: 'description', header: t("seos.columns.fields.description"), isDefault: true, show: true }, 
			 {field: 'keyWords', header: t("seos.columns.fields.keyWords"), isDefault: true, show: true }, 
			 {field: 'imageUrl', header: t("seos.columns.fields.imageUrl"), isDefault: true, show: true }, 
			 {field: 'url', header: t("seos.columns.fields.url"), isDefault: true, show: true }, 
			 {field: 'mainUrl', header: t("seos.columns.fields.mainUrl"), isDefault: true, show: true }, 
			 {field: 'updateDate', header: t("seos.columns.fields.updateDate"), isDefault: true, show: true }, 
			 {field: 'deleteDate', header: t("seos.columns.fields.deleteDate"), isDefault: true, show: true }, 
			 {field: 'updateById', header: t("seos.columns.fields.updateById"), isDefault: true, show: true }, 
			 {field: 'deleteById', header: t("seos.columns.fields.deleteById"), isDefault: true, show: true }, 
			 {field: 'isDelete', header: t("seos.columns.fields.isDelete"), isDefault: true, show: true }, 
 		].filter(col => col.field),
        [t]);

 const handleFilterChangeLocal = (field: string, value: string | number | boolean | null | Array<string | number | boolean>) => {
    setFilters(prevFilters => ({
      ...prevFilters,
      [field]: Array.isArray(value)
        ? { value, matchMode: FilterMatchMode.IN }
        : { value, matchMode: FilterMatchMode.CONTAINS },
    }));
  };
  return (
    <div className="relative flex flex-col h-screen overflow-y-auto overflow-x-hidden mb-20">
      <div className="flex items-center topbar p-1 bg-[var(--color-white] text-[var(--color-dark)] w-full fixed top-30 z-20">
        <Button
          className="backBtn cursor-pointer flex items-center"
          onClick={() => window.history.back()}
        >
          <BsArrowLeft className=" h-7 w-7 cursor-pointer mx-3" />
        </Button>
        <h1 className=" capitalize text-[14px] font-semibold ">{t("globals.backto")} {t("seos.form_detail.fields.modelname")}</h1>
      </div>

      <div className="flex flex-col h-full pt-10 px-4">
        <div className="import-grid">
          <div className="bg-[var(--color-white] border border-[var(--color-border)] shadow-md rounded-md p-1 lg:p-2">
            <form onSubmit={handleSubmit} noValidate>
              <div className="flex flex-col md:flex-row lg:items-start items-center justify-center lg:justify-between gap-2 md:gap-4">
                <div className="flex justify-center items-center gap-2 w-full md:w-auto">
                  <label htmlFor="importFile" className="text-[14px] font-bold  text-[var(--color-dark)]">
                    {t("globals.importFile")}
                  </label>
                  <span className="text-[var(--color-danger)]">*</span>
                </div>

                <div className="flex items-center text-[var(--color-primary)] w-[200px]">
                  <FileUploadMain
                    modelName="Seo"
                    propName="importFile"
                    onFileUpload={(files: any) => handleFileUpload(files)}
                    multiple={false}
                    accept=".xlsx"
                    initialData={uploadedFile ? String(uploadedFile) : null}
                    maxFileNumber={1}
                  />
                </div>

                <Button
                  type="submit"
                  className={`flex items-center text-sm gap-2 px-4 py-2 rounded-lg ${uploadedFile ? 'bg-[var(--color-primary)] text-[var(--color-white)]' : 'bg-[#6B7280] opacity-50 cursor-not-allowed'}`}
                  disabled={!uploadedFile || validFile}
                >
                  <RiEyeFill />
                  {t("globals.preview")}
                </Button>
              </div>

              {errors.importFile && (
                <p className="text-[var(--color-danger)] text-xs mt-1">
                  {errors.importFile}
                </p>
              )}
            </form>
          </div>

          <div className="p-1 md:p-2 shadow-md rounded-md flex flex-wrap items-center justify-center lg:justify-between gap-4 w-full">
            <SplitButton
              label={t("globals.downloadTemplates")}
              model={items}
              icon={<RiFileDownloadFill className="mr-2 text-[var(--color-primary)]" size={16} />}
              className="w-[200px] border border-[var(--color-border)] p-1 lg:p-2 text-sm font-normal"
              disabled={downloading}
            />
          </div>
        </div>

        {(importAllow || importValidateComplete) && showTable && (
          <div className="bg-[var(--color-white] border-[var(--color-border)] rounded-md my-4">
            <div className=" container-fluid pb-28">
              {loading ? (
                <TableSkeleton cols={columnsConfigDefault} />
              ) : (
                <>
                  <DataTable
                    value={importedData}
                    dataKey="id"
                    resizableColumns
                    scrollable
                    // scrollHeight="53vh"
                    filterDisplay="row"
                    filters={filters}
                    onFilter={(e) => setFilters(e.filters)}
                    scrollHeight="calc(100vh - 300px)"
                    showGridlines
                    paginator
                    first={first}
                    rows={rows}
                    totalRecords={totalRecords}
                    onPage={onPage}
                    paginatorTemplate={t('globals.layout')}
                    currentPageReportTemplate={t('globals.report')}
                    emptyMessage={t('globals.emptyMessage')}
                    rowsPerPageOptions={[10, 25, 50]}
                    className="p-datatable-gridlines  datatable-responsive bg-[var(--color-white)]"
                  >
                    <Column
                      field="importAction" header={t("seos.form_detail.fields.importAction")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <>
                          <div id={`tooltip-importAction-${rowIndex}`} className="text-left truncate font-medium">
                            {rowData.importAction}
                          </div>
                          <Tooltip className=" text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-importAction-${rowIndex}`} content={rowData.importAction} showDelay={200} position="top" />
                        </>
                      )}
                    />
                    <Column
                      field="importRemark" header={t("seos.form_detail.fields.importRemark")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <>
                          <div id={`tooltip-importRemark-${rowIndex}`} className="text-left truncate font-medium">
                            {rowData.importRemark}
                          </div>
                          <Tooltip className=" text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-importRemark-${rowIndex}`} content={rowData.importRemark} showDelay={200} position="top" />
                        </>
                      )}
                    />
                      
<Column field="name" header={t("seos.columns.fields.name")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("name", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-name-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.name}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-name-${rowIndex}`} content={rowData.name} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="title" header={t("seos.columns.fields.title")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("title", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-title-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.title}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-title-${rowIndex}`} content={rowData.title} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="description" header={t("seos.columns.fields.description")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("description", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-description-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.description}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-description-${rowIndex}`} content={rowData.description} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="keyWords" header={t("seos.columns.fields.keyWords")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("keyWords", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-keyWords-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.keyWords}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-keyWords-${rowIndex}`} content={rowData.keyWords} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="imageUrl" header={t("seos.columns.fields.imageUrl")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("imageUrl", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-imageUrl-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.imageUrl}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-imageUrl-${rowIndex}`} content={rowData.imageUrl} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="url" header={t("seos.columns.fields.url")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("url", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-url-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.url}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-url-${rowIndex}`} content={rowData.url} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="mainUrl" header={t("seos.columns.fields.mainUrl")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("mainUrl", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-mainUrl-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.mainUrl}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-mainUrl-${rowIndex}`} content={rowData.mainUrl} showDelay={200} position="top" />
</>
)}
 /> 

                  </DataTable>
                </>
              )}
            </div>
          </div>
        )}
      </div>

      {importAllow && importValidateComplete && (
        <div className=" button-container">
          <Button
            label={t("globals.syncData")}
            className={`border-[var(--color-border)] bg-[var(--color-primary)] text-[var(--color-white)] text-sm p-2 px-4 rounded-lg shadow-md ${validFile ? 'bg-[var(--color-primary)] text-[var(--color-dark)]' : 'bg-[#6B7280] opacity-50 cursor-not-allowed'}`}
            onClick={() => syncImportData()}
            disabled={!validFile}
          />
        </div>
      )}

      <Dialog
        visible={importSyncComplete}
        onHide={() => setImportSyncComplete(false)}
        className="w-[90vw] md:w-auto max-w-md mx-auto"
        breakpoints={{ "960px": "80vw", "640px": "90vw" }} >
        <div className="p-0 max-w-sm mx-auto">
          <div className="flex justify-between items-center border-b">
            <button
              onClick={() => setImportSyncComplete(false)}
              className="text-[#6b7280] hover:text-[#6b7280]"
            >
              <i className="ri-close-fill text-xl"></i>
            </button>
          </div>
          <div className="flex flex-col items-center p-3">
            <Image
              src={successimg}
              alt="Record imported Successfully"
              className="h-[100px] w-[100px] lg:h-[150px] lg:w-[150px] object-cover rounded-full"
            />
            <div className="text-center">
              <h2 className="text-lg text-black font-semibold mb-2">{t("globals.importDialogMsg")}</h2>
              {loadingSync && (
                <h2 className="text-sm text-black font-normal mb-2">{t("globals.importDialogProcessMsg")}</h2>
              )}
            </div>
          </div>
        </div>
      </Dialog>
    </div >
  );
};

export default SeosImport;

