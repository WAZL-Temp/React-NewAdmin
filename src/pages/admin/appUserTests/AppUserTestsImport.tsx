import { useState,useMemo } from 'react';
import { AppUserTestsService } from '../../../core/service/appUserTests.service';
import { BsArrowLeft, Button, Column, DataTable, DataTableFilterMeta, Dialog, FilterMatchMode, Image, InputText, RiEyeFill, RiFileDownloadFill, RiFileFill, SplitButton, Tooltip } from '../../../sharedBase/globalImports';
import { useTranslation } from '../../../sharedBase/globalUtils';
import { useFileUploadService } from "../../../core/service/fileUpload.service";
import FileUploadMain from '../../../components/FileUploadMain';
import TableSkeleton from '../../../components/TableSkeleton';
import successimg from '../../../assets/images/success.gif';
import { useImportPage } from '../../../hooks/useImportPage';
import { AppUserTest } from '../../../core/model/appUserTest';
import { RowData } from '../../../types/listpage';
import { CustomFile } from '../../../core/model/customfile';

const AppUserTestsImport = () => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<{ importFile: string }>({ importFile: '' });
  const [showTable, setShowTable] = useState<boolean>(false);
  const [importedData, setImportedData] = useState<AppUserTest[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<any>(null);
   const fileUploadService = useFileUploadService("AppUserTest");
  const [validFile, setValidFile] = useState(false);
  const [importValidateComplete, setImportValidateComplete] = useState(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [importSyncComplete, setImportSyncComplete] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);
  // const baseModelName = "appUserTests";
const typeName= "appUserTest";
  const appUserTestsService = AppUserTestsService();
  const [filters, setFilters] = useState<DataTableFilterMeta>({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });

  const { onPage, first, rows, handleDownloadTemplate, downloading, importAllow, formatDate }
    = useImportPage({
      props: {
        baseModelName: typeName,
        service: appUserTestsService
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
			 {field: 'id', header: t("appUserTests.columns.fields.id"), isDefault: true, show: true }, 
			 {field: 'name', header: t("appUserTests.columns.fields.name"), isDefault: true, show: true }, 
			 {field: 'firstName', header: t("appUserTests.columns.fields.firstName"), isDefault: true, show: true }, 
			 {field: 'lastName', header: t("appUserTests.columns.fields.lastName"), isDefault: true, show: true }, 
			 {field: 'mobile', header: t("appUserTests.columns.fields.mobile"), isDefault: true, show: true }, 
			 {field: 'mobileVerified', header: t("appUserTests.columns.fields.mobileVerified"), isDefault: true, show: true }, 
			 {field: 'emailId', header: t("appUserTests.columns.fields.emailId"), isDefault: true, show: true }, 
			 {field: 'emailVerified', header: t("appUserTests.columns.fields.emailVerified"), isDefault: true, show: true }, 
			 {field: 'shopName', header: t("appUserTests.columns.fields.shopName"), isDefault: true, show: true }, 
			 {field: 'password', header: t("appUserTests.columns.fields.password"), isDefault: true, show: true }, 
			 {field: 'pincode', header: t("appUserTests.columns.fields.pincode"), isDefault: true, show: true }, 
			 {field: 'state', header: t("appUserTests.columns.fields.state"), isDefault: true, show: true }, 
			 {field: 'district', header: t("appUserTests.columns.fields.district"), isDefault: true, show: true }, 
			 {field: 'address', header: t("appUserTests.columns.fields.address"), isDefault: true, show: true }, 
			 {field: 'addressLine', header: t("appUserTests.columns.fields.addressLine"), isDefault: true, show: true }, 
			 {field: 'verifyShop', header: t("appUserTests.columns.fields.verifyShop"), isDefault: true, show: true }, 
			 {field: 'verifyShopLabel', header: t("appUserTests.columns.fields.verifyShopLabel"), isDefault: true, show: true }, 
			 {field: 'gst', header: t("appUserTests.columns.fields.gst"), isDefault: true, show: true }, 
			 {field: 'gstCertificate', header: t("appUserTests.columns.fields.gstCertificate"), isDefault: true, show: true }, 
			 {field: 'photoShopFront', header: t("appUserTests.columns.fields.photoShopFront"), isDefault: true, show: true }, 
			 {field: 'visitingCard', header: t("appUserTests.columns.fields.visitingCard"), isDefault: true, show: true }, 
			 {field: 'cheque', header: t("appUserTests.columns.fields.cheque"), isDefault: true, show: true }, 
			 {field: 'gstOtp', header: t("appUserTests.columns.fields.gstOtp"), isDefault: true, show: true }, 
			 {field: 'isActive', header: t("appUserTests.columns.fields.isActive"), isDefault: true, show: true }, 
			 {field: 'isAdmin', header: t("appUserTests.columns.fields.isAdmin"), isDefault: true, show: true }, 
			 {field: 'hasImpersonateAccess', header: t("appUserTests.columns.fields.hasImpersonateAccess"), isDefault: true, show: true }, 
			 {field: 'photoAttachment', header: t("appUserTests.columns.fields.photoAttachment"), isDefault: true, show: true }, 
			 {field: 'role', header: t("appUserTests.columns.fields.role"), isDefault: true, show: true }, 
			 {field: 'roleLabel', header: t("appUserTests.columns.fields.roleLabel"), isDefault: true, show: true }, 
			 {field: 'publish', header: t("appUserTests.columns.fields.publish"), isDefault: true, show: true }, 
			 {field: 'publishLabel', header: t("appUserTests.columns.fields.publishLabel"), isDefault: true, show: true }, 
			 {field: 'importDataId', header: t("appUserTests.columns.fields.importDataId"), isDefault: true, show: true }, 
			 {field: 'lastLogin', header: t("appUserTests.columns.fields.lastLogin"), isDefault: true, show: true }, 
			 {field: 'defaultLanguage', header: t("appUserTests.columns.fields.defaultLanguage"), isDefault: true, show: true }, 
			 {field: 'isPremiumUser', header: t("appUserTests.columns.fields.isPremiumUser"), isDefault: true, show: true }, 
			 {field: 'totalPlot', header: t("appUserTests.columns.fields.totalPlot"), isDefault: true, show: true }, 
			 {field: 'reportedTo', header: t("appUserTests.columns.fields.reportedTo"), isDefault: true, show: true }, 
			 {field: 'reportedToName', header: t("appUserTests.columns.fields.reportedToName"), isDefault: true, show: true }, 
			 {field: 'reportedBy', header: t("appUserTests.columns.fields.reportedBy"), isDefault: true, show: true }, 
			 {field: 'reportedByName', header: t("appUserTests.columns.fields.reportedByName"), isDefault: true, show: true }, 
			 {field: 'gender', header: t("appUserTests.columns.fields.gender"), isDefault: true, show: true }, 
			 {field: 'genderLabel', header: t("appUserTests.columns.fields.genderLabel"), isDefault: true, show: true }, 
			 {field: 'createDate', header: t("appUserTests.columns.fields.createDate"), isDefault: true, show: true }, 
			 {field: 'updateDate', header: t("appUserTests.columns.fields.updateDate"), isDefault: true, show: true }, 
			 {field: 'deleteDate', header: t("appUserTests.columns.fields.deleteDate"), isDefault: true, show: true }, 
			 {field: 'createById', header: t("appUserTests.columns.fields.createById"), isDefault: true, show: true }, 
			 {field: 'updateById', header: t("appUserTests.columns.fields.updateById"), isDefault: true, show: true }, 
			 {field: 'deleteById', header: t("appUserTests.columns.fields.deleteById"), isDefault: true, show: true }, 
			 {field: 'isDelete', header: t("appUserTests.columns.fields.isDelete"), isDefault: true, show: true }, 
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
        <h1 className=" capitalize text-[14px] font-semibold ">{t("globals.backto")} {t("appUserTests.form_detail.fields.modelname")}</h1>
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
                    modelName="AppUserTest"
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
                      field="importAction" header={t("appUserTests.form_detail.fields.importAction")} sortable
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
                      field="importRemark" header={t("appUserTests.form_detail.fields.importRemark")} sortable
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
                      
<Column field="name" header={t("appUserTests.columns.fields.name")} sortable filter
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
 
<Column field="firstName" header={t("appUserTests.columns.fields.firstName")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("firstName", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-firstName-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.firstName}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-firstName-${rowIndex}`} content={rowData.firstName} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="lastName" header={t("appUserTests.columns.fields.lastName")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("lastName", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-lastName-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.lastName}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-lastName-${rowIndex}`} content={rowData.lastName} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="mobile" header={t("appUserTests.columns.fields.mobile")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("mobile", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-mobile-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.mobile}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-mobile-${rowIndex}`} content={rowData.mobile} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="mobileVerified" header={t("appUserTests.columns.fields.mobileVerified")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("mobileVerified", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-mobileVerified-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.mobileVerified ? "true" : "false"}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-mobileVerified-${rowIndex}`} content={rowData.mobileVerified ? "true" : "false"} showDelay={200} position="top" />
</>
)}
 />
 
<Column field="emailId" header={t("appUserTests.columns.fields.emailId")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("emailId", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-emailId-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.emailId}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-emailId-${rowIndex}`} content={rowData.emailId} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="emailVerified" header={t("appUserTests.columns.fields.emailVerified")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("emailVerified", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-emailVerified-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.emailVerified ? "true" : "false"}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-emailVerified-${rowIndex}`} content={rowData.emailVerified ? "true" : "false"} showDelay={200} position="top" />
</>
)}
 />
 
<Column field="shopName" header={t("appUserTests.columns.fields.shopName")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("shopName", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-shopName-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.shopName}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-shopName-${rowIndex}`} content={rowData.shopName} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="password" header={t("appUserTests.columns.fields.password")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("password", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-password-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.password}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-password-${rowIndex}`} content={rowData.password} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="pincode" header={t("appUserTests.columns.fields.pincode")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("pincode", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-pincode-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.pincode}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-pincode-${rowIndex}`} content={rowData.pincode} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="state" header={t("appUserTests.columns.fields.state")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("state", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-state-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.state}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-state-${rowIndex}`} content={rowData.state} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="district" header={t("appUserTests.columns.fields.district")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("district", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-district-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.district}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-district-${rowIndex}`} content={rowData.district} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="address" header={t("appUserTests.columns.fields.address")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("address", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-address-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.address}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-address-${rowIndex}`} content={rowData.address} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="addressLine" header={t("appUserTests.columns.fields.addressLine")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("addressLine", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-addressLine-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.addressLine}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-addressLine-${rowIndex}`} content={rowData.addressLine} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="verifyShopLabel" header={t("appUserTests.columns.fields.verifyShopLabel")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("verifyShopLabel", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-verifyShopLabel-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.verifyShopLabel}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-verifyShopLabel-${rowIndex}`} content={rowData.verifyShopLabel} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="gst" header={t("appUserTests.columns.fields.gst")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("gst", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-gst-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.gst}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-gst-${rowIndex}`} content={rowData.gst} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="gstCertificate" header={t("appUserTests.columns.fields.gstCertificate")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("gstCertificate", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<div className="text-left truncate font-medium">
 {renderFileCell(rowData, 'gstCertificate', rowIndex)}
 </div>
)} /> 
 
<Column field="photoShopFront" header={t("appUserTests.columns.fields.photoShopFront")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("photoShopFront", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<div className="text-left truncate font-medium">
 {renderFileCell(rowData, 'photoShopFront', rowIndex)}
 </div>
)} /> 
 
<Column field="visitingCard" header={t("appUserTests.columns.fields.visitingCard")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("visitingCard", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<div className="text-left truncate font-medium">
 {renderFileCell(rowData, 'visitingCard', rowIndex)}
 </div>
)} /> 
 
<Column field="cheque" header={t("appUserTests.columns.fields.cheque")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("cheque", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<div className="text-left truncate font-medium">
 {renderFileCell(rowData, 'cheque', rowIndex)}
 </div>
)} /> 
 
<Column field="gstOtp" header={t("appUserTests.columns.fields.gstOtp")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("gstOtp", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-gstOtp-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.gstOtp}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-gstOtp-${rowIndex}`} content={rowData.gstOtp} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="isActive" header={t("appUserTests.columns.fields.isActive")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("isActive", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-isActive-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.isActive ? "true" : "false"}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-isActive-${rowIndex}`} content={rowData.isActive ? "true" : "false"} showDelay={200} position="top" />
</>
)}
 />
 
<Column field="isAdmin" header={t("appUserTests.columns.fields.isAdmin")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("isAdmin", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-isAdmin-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.isAdmin ? "true" : "false"}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-isAdmin-${rowIndex}`} content={rowData.isAdmin ? "true" : "false"} showDelay={200} position="top" />
</>
)}
 />
 
<Column field="hasImpersonateAccess" header={t("appUserTests.columns.fields.hasImpersonateAccess")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("hasImpersonateAccess", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-hasImpersonateAccess-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.hasImpersonateAccess ? "true" : "false"}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-hasImpersonateAccess-${rowIndex}`} content={rowData.hasImpersonateAccess ? "true" : "false"} showDelay={200} position="top" />
</>
)}
 />
 
<Column field="photoAttachment" header={t("appUserTests.columns.fields.photoAttachment")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("photoAttachment", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<div className="text-left truncate font-medium">
 {renderFileCell(rowData, 'photoAttachment', rowIndex)}
 </div>
)} /> 
 
<Column field="roleLabel" header={t("appUserTests.columns.fields.roleLabel")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("roleLabel", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-roleLabel-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.roleLabel}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-roleLabel-${rowIndex}`} content={rowData.roleLabel} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="publishLabel" header={t("appUserTests.columns.fields.publishLabel")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("publishLabel", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-publishLabel-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.publishLabel}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-publishLabel-${rowIndex}`} content={rowData.publishLabel} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="lastLogin" header={t("appUserTests.columns.fields.lastLogin")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("lastLogin", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<div id={`tooltip-lastLogin-${rowIndex}`} className="text-left truncate font-medium">
 {formatDate(rowData.lastLogin)}
 </div>
)} /> 
 
<Column field="defaultLanguage" header={t("appUserTests.columns.fields.defaultLanguage")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("defaultLanguage", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-defaultLanguage-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.defaultLanguage}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-defaultLanguage-${rowIndex}`} content={rowData.defaultLanguage} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="isPremiumUser" header={t("appUserTests.columns.fields.isPremiumUser")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("isPremiumUser", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-isPremiumUser-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.isPremiumUser ? "true" : "false"}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-isPremiumUser-${rowIndex}`} content={rowData.isPremiumUser ? "true" : "false"} showDelay={200} position="top" />
</>
)}
 />
 
<Column field="totalPlot" header={t("appUserTests.columns.fields.totalPlot")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("totalPlot", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-totalPlot-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.totalPlot}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-totalPlot-${rowIndex}`} content={rowData.totalPlot} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="reportedToName" header={t("appUserTests.columns.fields.reportedToName")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("reportedToName", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-reportedToName-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.reportedToName}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-reportedToName-${rowIndex}`} content={rowData.reportedToName} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="reportedByName" header={t("appUserTests.columns.fields.reportedByName")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("reportedByName", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-reportedByName-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.reportedByName}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-reportedByName-${rowIndex}`} content={rowData.reportedByName} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="genderLabel" header={t("appUserTests.columns.fields.genderLabel")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
 
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("genderLabel", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<>
<div id={`tooltip-genderLabel-${rowIndex}`} className="text-left truncate font-medium">
 {rowData.genderLabel}
 </div>
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-genderLabel-${rowIndex}`} content={rowData.genderLabel} showDelay={200} position="top" />
</>
)}
 /> 
 
<Column field="createDate" header={t("appUserTests.columns.fields.createDate")} sortable filter
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
 
<Column field="createById" header={t("appUserTests.columns.fields.createById")} sortable filter
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

export default AppUserTestsImport;

