import { useState,useMemo } from 'react';
import { CategoriesService } from '../../../core/service/categories.service';
import { BsArrowLeft, Button, Column, DataTable, DataTableFilterMeta, Dialog, FilterMatchMode, Image, InputText, RiEyeFill, RiFileDownloadFill, RiFileFill, SplitButton, Tooltip } from '../../../sharedBase/globalImports';
import { useTranslation } from '../../../sharedBase/globalUtils';
import { useFileUploadService } from "../../../core/service/fileUpload.service";
import FileUploadMain from '../../../components/FileUploadMain';
import TableSkeleton from '../../../components/TableSkeleton';
import successimg from '../../../assets/images/success.gif';
import { useImportPage } from '../../../hooks/useImportPage';
import { Category } from '../../../core/model/category';
import { RowData } from '../../../types/listpage';
import { CustomFile } from '../../../core/model/customfile';

const CategoriesImport = () => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<{ importFile: string }>({ importFile: '' });
  const [showTable, setShowTable] = useState<boolean>(false);
  const [importedData, setImportedData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<any>(null);
   const fileUploadService = useFileUploadService("Category");
  const [validFile, setValidFile] = useState(false);
  const [importValidateComplete, setImportValidateComplete] = useState(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [importSyncComplete, setImportSyncComplete] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);
  // const baseModelName = "categories";
const typeName= "category";
  const categoriesService = CategoriesService();
  const [filters, setFilters] = useState<DataTableFilterMeta>({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });

  const { onPage, first, rows, handleDownloadTemplate, downloading, importAllow, formatDate }
    = useImportPage({
      props: {
        baseModelName: typeName,
        service: categoriesService
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
			 {field: 'id', header: t("categories.columns.fields.id"), isDefault: true, show: true }, 
			 {field: 'name', header: t("categories.columns.fields.name"), isDefault: true, show: true }, 
			 {field: 'slug', header: t("categories.columns.fields.slug"), isDefault: true, show: true }, 
			 {field: 'icon', header: t("categories.columns.fields.icon"), isDefault: true, show: true }, 
			 {field: 'importDataId', header: t("categories.columns.fields.importDataId"), isDefault: true, show: true }, 
			 {field: 'createDate', header: t("categories.columns.fields.createDate"), isDefault: true, show: true }, 
			 {field: 'updateDate', header: t("categories.columns.fields.updateDate"), isDefault: true, show: true }, 
			 {field: 'deleteDate', header: t("categories.columns.fields.deleteDate"), isDefault: true, show: true }, 
			 {field: 'createById', header: t("categories.columns.fields.createById"), isDefault: true, show: true }, 
			 {field: 'updateById', header: t("categories.columns.fields.updateById"), isDefault: true, show: true }, 
			 {field: 'deleteById', header: t("categories.columns.fields.deleteById"), isDefault: true, show: true }, 
			 {field: 'isDelete', header: t("categories.columns.fields.isDelete"), isDefault: true, show: true }, 
 		].filter(col => col.field),
        [t]);
  
  const renderFileCell = (rowData: RowData, field: string, rowIndex: number) => {
    let fileName = "";
    const uniqueId = `tooltip-${field}-${rowIndex}`;
    try {
      if (typeof rowData[field] === "string") {
        if (rowData[field].startsWith("{") || rowData[field].startsWith("[")) {
          const imageData = JSON.parse(rowData[field]);
          fileName = Array.isArray(imageData) ? imageData[0]?.fileName : imageData.fileName;
        } else {
          fileName = rowData[field];
        }
      }
    } catch (e) {
      console.error("Error parsing image data:", e);
    }
    return (
      <div id={uniqueId} className='text-[13px] overflow-hidden overflow-ellipsis whitespace-nowrap'>
        {(fileName)}
        <Tooltip className=' text-xs font-semibold hide-tooltip-mobile' target={`#${uniqueId}`} content={fileName} showDelay={200} position="top" />
      </div>
    );
  };

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
        <h1 className=" capitalize text-[14px] font-semibold ">{t("globals.backto")} {t("categories.form_detail.fields.modelname")}</h1>
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
                    modelName="Category"
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
                      field="importAction" header={t("categories.form_detail.fields.importAction")} sortable
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
                      field="importRemark" header={t("categories.form_detail.fields.importRemark")} sortable
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
                      
<Column field="name" header={t("categories.columns.fields.name")} sortable filter
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
 
<Column field="slug" header={t("categories.columns.fields.slug")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("slug", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-slug-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.slug}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-slug-${rowIndex}`} content={rowData.slug} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="icon" header={t("categories.columns.fields.icon")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("icon", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<div className="text-left truncate font-medium">
 {renderFileCell(rowData, 'icon', rowIndex)}
 </div>
)} /> 
 
<Column field="createDate" header={t("categories.columns.fields.createDate")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("createDate", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-createDate-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.createDate}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-createDate-${rowIndex}`} content={rowData.createDate} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="createById" header={t("categories.columns.fields.createById")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("createById", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-createById-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.createById}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-createById-${rowIndex}`} content={rowData.createById} showDelay={200} position="top" />
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

export default CategoriesImport;

