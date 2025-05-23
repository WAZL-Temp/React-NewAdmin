import { useState } from 'react';
import { useAppUserService } from '../../../core/services/appUsers.service';
import { BsArrowLeft, Button, Column, DataTable, Dialog, Image, RiEyeFill, RiFileDownloadFill, RiFileFill, SplitButton, Tooltip } from '../../../sharedBase/globalImports';
import { useTranslation } from '../../../sharedBase/globalUtils';
import { useFileUploadService } from "../../../core/services/fileUpload.service";
import FileUploadMain from '../../../components/FileUploadMain';
import TableSkeleton from '../../../components/TableSkeleton';
import successimg from '../../../assets/images/success.gif';
import { useImportPage } from '../../../hooks/useImportPage';
import { AppUser } from '../../../core/model/appuser';
import { RowData } from '../../../types/listpage';
import { CustomFile } from '../../../core/model/customfile';

const AppUsersImport = () => {
  const { t } = useTranslation();
  const [errors, setErrors] = useState<{ importFile: string }>({ importFile: '' });
  const [showTable, setShowTable] = useState<boolean>(false);
  const [importedData, setImportedData] = useState<AppUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<any>(null);
   const fileUploadService = useFileUploadService("AppUser");
  const [validFile, setValidFile] = useState(false);
  const [importValidateComplete, setImportValidateComplete] = useState(false);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [importSyncComplete, setImportSyncComplete] = useState(false);
  const [loadingSync, setLoadingSync] = useState(false);
  const baseModelName = "AppUsers";
  const userService = useAppUserService();

  const { onPage, first, rows, handleDownloadTemplate, downloading, importAllow, formatDate }
    = useImportPage({
      props: {
        baseModelName: baseModelName,
        service: userService
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
        console.error("No file uploaded");
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
      console.error("Error syncing data:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleFileUpload = (files: CustomFile) => {
    setUploadedFile(files);
  };

  const columns = [
    { field: 'importAction', header: t("appUsers.form_detail.fields.importAction") },
    { field: 'importRemark', header: t("appUsers.form_detail.fields.importRemark") },
    { field: 'createDate', header: t("appUsers.columns.fields.createDate") },
    { field: 'firstName', header: t("appUsers.columns.fields.firstName") },
    { field: 'lastName', header: t("appUsers.columns.fields.lastName") },
    { field: 'name', header: t("appUsers.columns.fields.name") },
    { field: 'mobile', header: t("appUsers.columns.fields.mobile") },
    { field: 'mobileVerified', header: t("appUsers.columns.fields.mobileVerified") },
    { field: 'emailId', header: t("appUsers.columns.fields.emailId") },
    { field: 'emailVerified', header: t("appUsers.columns.fields.emailVerified") },
    { field: 'isActive', header: t("appUsers.columns.fields.isActive") },
    { field: 'isAdmin', header: t("appUsers.columns.fields.isAdmin") },
    { field: 'shopName', header: t("appUsers.columns.fields.shopName") },
    { field: 'password', header: t("appUsers.columns.fields.password") },
    { field: 'pincode', header: t("appUsers.columns.fields.pincode") },
    { field: 'state', header: t("appUsers.columns.fields.state") },
    { field: 'district', header: t("appUsers.columns.fields.district") },
    { field: 'address', header: t("appUsers.columns.fields.address") },
    { field: 'addressLine', header: t("appUsers.columns.fields.addressLine") },
    { field: 'verifyShop', header: t("appUsers.columns.fields.verifyShop") },
    { field: 'gst', header: t("appUsers.columns.fields.gst") },
    { field: 'gstCertificate', header: t("appUsers.columns.fields.gstCertificate") },
    { field: 'photoShopFront', header: t("appUsers.columns.fields.photoShopFront") },
    { field: 'visitingCard', header: t("appUsers.columns.fields.visitingCard") },
    { field: 'cheque', header: t("appUsers.columns.fields.cheque") },
    { field: 'photoAttachment', header: t("appUsers.columns.fields.photoAttachment") },
    { field: 'hasImpersonateAccess', header: t("appUsers.columns.fields.hasImpersonateAccess") },
    { field: 'role', header: t("appUsers.columns.fields.role") },
    { field: 'publish', header: t("appUsers.columns.fields.publish") },
    { field: 'lastLogin', header: t("appUsers.columns.fields.lastLogin") },
  ];

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

  return (
    <div className="relative flex flex-col h-screen overflow-y-auto overflow-x-hidden mb-20">
      <div className="flex items-center topbar p-1 bg-[var(--color-white] text-[var(--color-dark)] w-full fixed top-30 z-20">
        <Button
          className="backBtn cursor-pointer flex items-center"
          onClick={() => window.history.back()}
        >
          <BsArrowLeft className=" h-7 w-7 cursor-pointer mx-3" />
        </Button>
        <h1 className=" capitalize text-[14px] font-semibold ">{t("globals.backto")} {t("appUsers.form_detail.fields.modelname")}</h1>
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
                    modelName="AppUser"
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
                <TableSkeleton cols={columns} />
              ) : (
                <>
                  <DataTable
                    value={importedData}
                    // dataKey="id"
                    resizableColumns
                    scrollable
                    // scrollHeight="53vh"
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
                      field="importAction" header={t("appUsers.form_detail.fields.importAction")} sortable
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
                      field="importRemark" header={t("appUsers.form_detail.fields.importRemark")} sortable
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
                    <Column
                      field="name" header={t("appUsers.columns.fields.name")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <>
                          <div id={`tooltip-name-${rowIndex}`} className="text-left truncate font-medium">
                            {rowData.name}
                          </div>
                          <Tooltip className=" text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-name-${rowIndex}`} content={rowData.name} showDelay={200} position="top" />
                        </>
                      )}
                    />
                    <Column
                      field="firstName" header={t("appUsers.columns.fields.firstName")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <>
                          <div id={`tooltip-firstName-${rowIndex}`} className="text-left truncate font-medium">
                            {rowData.firstName}
                          </div>
                          <Tooltip className=" text-xs font-semibold  hide-tooltip-mobile" target={`#tooltip-firstName-${rowIndex}`} content={rowData.firstName} showDelay={200} position="top" />
                        </>
                      )}
                    />
                    <Column
                      field="lastName" header={t("appUsers.columns.fields.lastName")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <>
                          <div id={`tooltip-lastName-${rowIndex}`} className="text-left truncate font-medium">
                            {rowData.lastName}
                          </div>
                          <Tooltip className=" text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-lastName-${rowIndex}`} content={rowData.lastName} showDelay={200} position="top" />
                        </>
                      )}
                    />
                    <Column
                      field="mobile" header={t("appUsers.columns.fields.mobile")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <>
                          <div id={`tooltip-mobile-${rowIndex}`} className="text-left truncate font-medium">
                            {rowData.mobile}
                          </div>
                          <Tooltip className=" text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-mobile-${rowIndex}`} content={rowData.mobile} showDelay={200} position="top" />
                        </>
                      )}
                    />
                    <Column
                      field="mobileVerified" header={t("appUsers.columns.fields.mobileVerified")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <>
                          <div id={`tooltip-mobileVerified-${rowIndex}`} className="text-left truncate font-medium">
                            {rowData.mobileVerified ? "true" : "false"}
                          </div>
                          <Tooltip className=" text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-mobileVerified-${rowIndex}`} content={rowData.mobileVerified ? "true" : "false"} showDelay={200} position="top" />
                        </>
                      )}
                    />
                    <Column
                      field="emailId" header={t("appUsers.columns.fields.emailId")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <>
                          <div id={`tooltip-emailId-${rowIndex}`} className="text-left truncate font-medium">
                            {rowData.emailId}
                          </div>
                          <Tooltip className=" text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-emailId-${rowIndex}`} content={rowData.emailId} showDelay={200} position="top" />
                        </>
                      )}
                    />
                    <Column
                      field="emailVerified" header={t("appUsers.columns.fields.emailVerified")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <>
                          <div id={`tooltip-emailVerified-${rowIndex}`} className="text-left truncate font-medium">
                            {rowData.emailVerified ? "true" : "false"}
                          </div>
                          <Tooltip className=" text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-emailVerified-${rowIndex}`} content={rowData.emailVerified ? "true" : "false"} showDelay={200} position="top" />
                        </>
                      )}
                    />
                    <Column
                      field="shopName" header={t("appUsers.columns.fields.shopName")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <>
                          <div id={`tooltip-shopName-${rowIndex}`} className="text-left truncate font-medium">
                            {rowData.shopName}
                          </div>
                          <Tooltip className=" text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-shopName-${rowIndex}`} content={rowData.shopName} showDelay={200} position="top" />
                        </>
                      )}
                    />
                    <Column
                      field="password" header={t("appUsers.columns.fields.password")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <>
                          <div id={`tooltip-password-${rowIndex}`} className="text-left truncate font-medium">
                            {rowData.password}
                          </div>
                          <Tooltip className=" text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-password-${rowIndex}`} content={rowData.password} showDelay={200} position="top" />
                        </>
                      )}
                    />
                    <Column
                      field="pincode" header={t("appUsers.columns.fields.pincode")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <>
                          <div id={`tooltip-pincode-${rowIndex}`} className="text-left truncate font-medium">
                            {rowData.pincode}
                          </div>
                          <Tooltip className=" text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-pincode-${rowIndex}`} content={rowData.pincode} showDelay={200} position="top" />
                        </>
                      )}
                    />
                    <Column
                      field="state" header={t("appUsers.columns.fields.state")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <>
                          <div id={`tooltip-state-${rowIndex}`} className="text-left truncate font-medium">
                            {rowData.state}
                          </div>
                          <Tooltip className=" text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-state-${rowIndex}`} content={rowData.state} showDelay={200} position="top" />
                        </>
                      )}
                    />
                    <Column
                      field="district" header={t("appUsers.columns.fields.district")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <>
                          <div id={`tooltip-district-${rowIndex}`} className="text-left truncate font-medium">
                            {rowData.pincode}
                          </div>
                          <Tooltip className=" text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-district-${rowIndex}`} content={rowData.district} showDelay={200} position="top" />
                        </>
                      )}
                    />
                    <Column
                      field="address" header={t("appUsers.columns.fields.address")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <>
                          <div id={`tooltip-address-${rowIndex}`} className="text-left truncate font-medium">
                            {rowData.address}
                          </div>
                          <Tooltip className=" text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-address-${rowIndex}`} content={rowData.address} showDelay={200} position="top" />
                        </>
                      )}
                    />
                    <Column
                      field="addressLine" header={t("appUsers.columns.fields.addressLine")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <>
                          <div id={`tooltip-addressLine-${rowIndex}`} className="text-left truncate font-medium">
                            {rowData.addressLine}
                          </div>
                          <Tooltip className=" text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-addressLine-${rowIndex}`} content={rowData.addressLine} showDelay={200} position="top" />
                        </>
                      )}
                    />
                    <Column
                      field="gst" header={t("appUsers.columns.fields.gst")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <>
                          <div id={`tooltip-gst-${rowIndex}`} className="text-left truncate font-medium">
                            {rowData.gst}
                          </div>
                          <Tooltip className=" text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-gst-${rowIndex}`} content={rowData.gst} showDelay={200} position="top" />
                        </>
                      )}
                    />
                    <Column
                      field="verifyShop" header={t("appUsers.columns.fields.verifyShop")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <>
                          <div id={`tooltip-verifyShop-${rowIndex}`} className="text-left truncate font-medium">
                            {rowData.verifyShop}
                          </div>
                          <Tooltip className=" text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-verifyShop-${rowIndex}`} content={rowData.verifyShop} showDelay={200} position="top" />
                        </>
                      )}
                    />
                    <Column
                      field="gstCertificate" header={t("appUsers.columns.fields.gstCertificate")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <div className="text-left truncate font-medium">
                          {renderFileCell(rowData, 'gstCertificate', rowIndex)}
                        </div>
                      )}
                    />
                    <Column
                      field="photoShopFront" header={t("appUsers.columns.fields.photoShopFront")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <div className="text-left truncate font-medium">
                          {renderFileCell(rowData, 'photoShopFront', rowIndex)}
                        </div>
                      )}
                    />
                    <Column
                      field="visitingCard" header={t("appUsers.columns.fields.visitingCard")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <div className="text-left truncate font-medium">
                          {renderFileCell(rowData, 'visitingCard', rowIndex)}
                        </div>
                      )}
                    />
                    <Column
                      field="cheque" header={t("appUsers.columns.fields.cheque")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <div className="text-left truncate font-medium">
                          {renderFileCell(rowData, 'cheque', rowIndex)}
                        </div>
                      )}
                    />
                    <Column
                      field="isActive" header={t("appUsers.columns.fields.isActive")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <>
                          <div id={`tooltip-isActive-${rowIndex}`} className="text-left truncate font-medium">
                            {rowData.isActive ? "true" : "false"}
                          </div>
                          <Tooltip className=" text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-isActive-${rowIndex}`} content={rowData.isActive} showDelay={200} position="top" />
                        </>
                      )}
                    />
                    <Column
                      field="isAdmin" header={t("appUsers.columns.fields.isAdmin")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <>
                          <div id={`tooltip-isAdmin-${rowIndex}`} className="text-left truncate font-medium">
                            {rowData.isAdmin ? "true" : "false"}
                          </div>
                          <Tooltip className=" text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-isAdmin-${rowIndex}`} content={rowData.isAdmin ? "true" : "false"} showDelay={200} position="top" />
                        </>
                      )}
                    />
                    <Column
                      field="hasImpersonateAccess" header={t("appUsers.columns.fields.hasImpersonateAccess")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <>
                          <div id={`tooltip-hasImpersonateAccess-${rowIndex}`} className="text-left truncate font-medium">
                            {rowData.hasImpersonateAccess ? "true" : "false"}
                          </div>
                          <Tooltip className=" text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-hasImpersonateAccess-${rowIndex}`} content={rowData.hasImpersonateAccess ? "true" : "false"} showDelay={200} position="top" />
                        </>
                      )}
                    />
                    <Column
                      field="photoAttachment" header={t("appUsers.columns.fields.photoAttachment")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <div className="text-left truncate font-medium">
                          {renderFileCell(rowData, 'photoAttachment', rowIndex)}
                        </div>
                      )}
                    />
                    <Column
                      field="roleLabel" header={t("appUsers.columns.fields.roleLabel")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <>
                          <div id={`tooltip-roleLabel-${rowIndex}`} className="text-left truncate font-medium">
                            {rowData.roleLabel}
                          </div>
                          <Tooltip className=" text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-roleLabel-${rowIndex}`} content={rowData.roleLabel} showDelay={200} position="top" />
                        </>
                      )}
                    />
                    <Column
                      field="publishLabel" header={t("appUsers.columns.fields.publishLabel")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <>
                          <div id={`tooltip-publishLabel-${rowIndex}`} className="text-left truncate font-medium">
                            {rowData.publishLabel}
                          </div>
                          <Tooltip className=" text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-publishLabel-${rowIndex}`} content={rowData.publishLabel} showDelay={200} position="top" />
                        </>
                      )}
                    />
                    <Column
                      field="lastLogin" header={t("appUsers.columns.fields.lastLogin")} sortable
                      headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                      style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                      body={(rowData, { rowIndex }) => (
                        <>
                          <div id={`tooltip-lastLogin-${rowIndex}`} className="text-left truncate font-medium">
                            {formatDate(rowData.lastLogin)}
                          </div>
                          <Tooltip className=" text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-lastLogin-${rowIndex}`} content={formatDate(rowData.lastLogin)} showDelay={200} position="top" />
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

export default AppUsersImport;

