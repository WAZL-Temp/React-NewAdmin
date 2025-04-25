import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useListPage } from "../../../hooks/useListPage"
import { BiSolidTrash, Button, Calendar, Column, DataTable, Dialog, HiOutlinePlus, Image, InputText, IoMdRefresh, MdOutlineUploadFile, MenuItem, RiPencilFill, SplitButton, TbFileExcel, TiEye, Toast, Tooltip, useNavigate, FilterMatchMode, useTranslation } from "../../../sharedBase/globalImports";
import successimg from '../../../assets/images/success.gif'
import confirmImg from '../../../assets/images/are-you-sure.jpg'
import { AppUser } from "../../../core/model/appuser";
import { RowData } from "../../../types/listpage";
import { useListQuery } from "../../../store/createListStore";
import { useAppUserService } from "../../../core/services/appUsers.service";

export default function AppUsersList() {
    const navigate = useNavigate();
    const baseModelName = "appuser";
    const { t } = useTranslation();
    // const [visible, setVisible] = useState(false);
    const dtRef = useRef<DataTable<AppUser[]>>(null);
    // search
    const [calendarCreateDateFrom, setCalendarCreateDateFrom] = useState<Date | undefined | null>(null);
    const [calendarCreateDateTo, setCalendarCreateDateTo] = useState<Date | undefined | null>(null);
    const userService = useAppUserService();
    const query = useListQuery<AppUser>(userService);
    const {
        roleData, globalFilterValue, setGlobalFilterValue, onGlobalFilterChange, refreshItemData, isDeleteDialogVisible,
        deleteItem, closeDeleteDialog, setFilters, onSort, onPage, first, rows, sortField, sortOrder, totalRecords,
        filters, setListSearch, clearListSearch, searchChange, openItem, confirmDeleteItem,
        toast, isSuccessDialogOpen, setIsSuccessDialogOpen, formatDate, exportToExcel,
        importFromExcel, addData, handleDelete, useColumnConfig }
        = useListPage<typeof query, AppUser>({
            query: query,
            props: {
                initialFilterValue: '',
                baseModelName: baseModelName,
                service: userService
            }
        });

    const columnsConfigDefault = useMemo(() => [
        { field: "createDate", header: t("appUsers.columns.fields.createDate"), isDefault: true, show: true },
        { field: "name", header: t("appUsers.columns.fields.name"), isDefault: true, show: true },
        { field: "firstName", header: t("appUsers.columns.fields.firstName"), isDefault: true, show: true },
        { field: "lastName", header: t("appUsers.columns.fields.lastName"), isDefault: true, show: true },
        { field: "mobile", header: t("appUsers.columns.fields.mobile"), isDefault: false, show: false },
        { field: "mobileVerified", header: t("appUsers.columns.fields.mobileVerified"), isDefault: false, show: false },
        { field: "emailId", header: t("appUsers.columns.fields.emailId"), isDefault: false, show: false },
        { field: "emailVerified", header: t("appUsers.columns.fields.emailVerified"), isDefault: false, show: false },
        { field: "shopName", header: t("appUsers.columns.fields.shopName"), isDefault: false, show: false },
        { field: "password", header: t("appUsers.columns.fields.password"), width: "200px", filter: false },
        { field: "pincode", header: t("appUsers.columns.fields.pincode"), isDefault: false, show: false },
        { field: "state", header: t("appUsers.columns.fields.state"), isDefault: false, show: false },
        { field: "district", header: t("appUsers.columns.fields.district"), isDefault: false, show: false },
        { field: "address", header: t("appUsers.columns.fields.address"), isDefault: false, show: false },
        { field: "addressLine", header: t("appUsers.columns.fields.addressLine"), isDefault: false, show: false },
        { field: "verifyShop", header: t("appUsers.columns.fields.verifyShop"), isDefault: false, show: false },
        { field: "gst", header: t("appUsers.columns.fields.gst"), isDefault: false, show: false },
        { field: "gstCertificate", header: t("appUsers.columns.fields.gstCertificate"), isDefault: false, show: false },
        { field: "photoShopFront", header: t("appUsers.columns.fields.photoShopFront"), isDefault: false, show: false },
        { field: "visitingCard", header: t("appUsers.columns.fields.visitingCard"), isDefault: false, show: false },
        { field: "cheque", header: t("appUsers.columns.fields.cheque"), isDefault: false, show: false },
        { field: "isActive", header: t("appUsers.columns.fields.isActive"), isDefault: false, show: false },
        { field: "isAdmin", header: t("appUsers.columns.fields.isAdmin"), isDefault: false, show: false },
        { field: "hasImpersonateAccess", header: t("appUsers.columns.fields.hasImpersonateAccess"), isDefault: false, show: false },
        { field: "photoAttachment", header: t("appUsers.columns.fields.photoAttachment"), isDefault: false, show: false },
        { field: "roleLabel", header: t("appUsers.columns.fields.roleLabel"), isDefault: false, show: false },
        { field: "publishLabel", header: t("appUsers.columns.fields.publishLabel"), isDefault: false, show: false },
        { field: "lastLogin", header: t("appUsers.columns.fields.lastLogin"), isDefault: false, show: false },
        { field: "totalPlot", header: t("appUsers.columns.fields.totalPlot"), isDefault: false, show: false },
    ].filter(col => col.field),
        [t]);

    const { columnsConfig } = useColumnConfig(columnsConfigDefault, roleData);

    // useEffect(() => {
    //     console.log("appuser data", query?.data);
    // }, [])

    useEffect(() => {
        if (query.search) {
            if (query.search?.createDateSearchFrom) {
                setCalendarCreateDateFrom(new Date(query.search.createDateSearchFrom))
            }
            if (query.search?.createDateSearchTo) {
                setCalendarCreateDateTo(new Date(query.search.createDateSearchTo))
            }
        }
    }, [query.search, query.tableSearch]);

    useEffect(() => {
        const initFilters = () => {
            query.tableSearch.searchRowFilter = query.tableSearch.searchRowFilter || {};

            const initialFilters: Record<string, { value: string | number | boolean | null | Array<string | number | boolean>; matchMode: FilterMatchMode }> = {
                global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            };
            columnsConfig.forEach(column => {
                initialFilters[column.field] = { value: query.tableSearch.searchRowFilter[column.field] || null, matchMode: FilterMatchMode.CONTAINS };
            });
            setFilters(initialFilters);
        };
        initFilters();
        if (query.tableSearch) {
            if (query.tableSearch.filter) {
                setGlobalFilterValue(query.tableSearch.filter);
            }
        }
    }, [columnsConfig, setFilters, setGlobalFilterValue, query.tableSearch]);

    const items: MenuItem[] = []
    // if (hasAccess(roleData, "Add")) {
    items.push({
        label: t("globals.add"),
        icon: 'pi pi-plus',
        command: () => addData(navigate, baseModelName)
    });
    // }

    items.push({
        label: t("globals.exportExcel"),
        icon: 'pi pi-file-excel',
        command: () => exportToExcel(userService, globalFilterValue || '', 'AppUser')
    });

    // if (hasAccess(roleData, "Import")) {
    items.push({
        label: t("globals.import"),
        icon: 'pi pi-upload',
        command: () => importFromExcel(navigate, baseModelName)
    });
    // }

    items.push({
        label: t("globals.refresh"),
        icon: 'pi pi-refresh',
        command: () => refreshItemData()
    });

    const handleFilterChangeLocal = (field: string, value: string | number | boolean | null | Array<string | number | boolean>) => {
        setFilters(prevFilters => ({
            ...prevFilters,
            [field]: Array.isArray(value)
                ? { value, matchMode: FilterMatchMode.IN }
                : { value, matchMode: FilterMatchMode.CONTAINS },
        }));

        query.tableSearch.searchRowFilter = query.tableSearch.searchRowFilter || {};
        query.tableSearch.searchRowFilter[field] = value;
        query.setTableSearch({ ...query.tableSearch });
    };

    const actionBodyTemplate = useCallback((rowData: AppUser, openItem: (item: AppUser, action: string) => void) => {
        return (
            <div className="flex items-center justify-start action-group gap-3">
                {/* {hasAccess(roleData, "View") && ( */}
                <div id={`tooltip-view-${rowData.id}`} className="p-button-text text-xs w-2 text-center cursor-pointer" onClick={() => openItem(rowData, 'view')}>
                    <TiEye size={17} className="font-bold text-[var(--color-primary)]" />
                </div>
                {/* )} */}
                <Tooltip className='text-xs font-semibold hide-tooltip-mobile' target={`#tooltip-view-${rowData.id}`} content="View Data" showDelay={200} position="top" />

                {/* {hasAccess(roleData, "Edit") && ( */}
                <div id={`tooltip-edit-${rowData.id}`} className="p-button-text text-xs w-2 text-center cursor-pointer" onClick={() => openItem(rowData, 'edit')}>
                    <RiPencilFill size={17} className="font-bold" />
                </div>
                {/* )} */}
                <Tooltip className='text-xs font-semibold hide-tooltip-mobile' target={`#tooltip-edit-${rowData.id}`} content="Edit Data" showDelay={200} position="top" />

                {/* {hasAccess(roleData, "Delete") && ( */}
                <div id={`tooltip-delete-${rowData.id}`} className="p-button-text text-xs w-2 text-center cursor-pointer" onClick={() => handleDelete(deleteItem, rowData.id)} >
                    <BiSolidTrash size={17} className="font-bold text-[var(--color-danger)]" />
                </div>
                {/* )} */}
                <Tooltip className='text-xs font-semibold hide-tooltip-mobile' target={`#tooltip-delete-${rowData.id}`} content="Delete Data" showDelay={200} position="top" />
            </div>
        );
    }, [deleteItem, handleDelete]);

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
                <Tooltip className='text-xs font-semibold hide-tooltip-mobile' target={`#${uniqueId}`} content={fileName} showDelay={200} position="top" />
            </div>
        );
    };

    return (
        <div className='relative h-screen flex flex-col overflow-auto'>
            <div className="flex justify-between items-center m-1">
                <h1 className="font-bold text-[16px] lg:text-xl ml-2">{t("appUsers.form_detail.fields.modelname")}</h1>
            </div>

            <div className="flex mx-2 flex-wrap justify-between items-center gap-3 border text-[var(--color-dark)] border-[var(--color-border)] rounded-md p-1 lg:my-1">
                <div className="flex sm:flex md:flex lg:hidden card justify-content-center">
                    <Toast ref={toast}></Toast>
                    <SplitButton
                        label={t("globals.action")}
                        className="small-button text-xs lg:text-sm border border-[var(--color-border)] p-1 lg:p-2"
                        model={items} />
                </div>

                <div className="hidden lg:flex items-center space-x-2 flex-wrap  bg-[var(--color-white)] text-[var(--color-dark)]">
                    {/* {hasAccess(roleData, "Add") && ( */}
                    <Button
                        type="button"
                        className="bg-[var(--color-secondary)] text-[var(--color-white)] p-1 lg:p-2 text-xs lg:text-sm rounded-md"
                        onClick={() => addData(navigate, baseModelName)}
                        tooltip={t("globals.add")}
                        tooltipOptions={{
                            position: 'top',
                            className: 'font-normal rounded text-sm p-1'
                        }}
                    >
                        <HiOutlinePlus size={18} />
                    </Button>
                    {/* )} */}

                    <Button
                        type="button"
                        className="bg-[var(--color-success)] text-[var(--color-white)] p-1 lg:p-2 text-xs lg:text-sm rounded-md"
                        onClick={() => exportToExcel(userService, globalFilterValue || '', 'AppUser')}
                        tooltip={t("globals.exportExcel")}
                        tooltipOptions={{
                            position: 'top',
                            className: 'font-normal rounded text-sm p-1'
                        }}
                    >
                        <TbFileExcel size={18} />
                    </Button>

                    {/* {hasAccess(roleData, "Import") && ( */}
                    <Button
                        type="button"
                        className="bg-[var(--color-info)] text-[var(--color-white)] p-1 lg:p-2 text-xs lg:text-sm rounded-md"
                        tooltip={t("globals.import")}
                        onClick={() => importFromExcel(navigate, baseModelName)}
                        tooltipOptions={{
                            position: 'top',
                            className: 'font-normal rounded text-sm p-1'
                        }}
                    >
                        <MdOutlineUploadFile size={18} />
                    </Button>
                    {/* )} */}

                    <Button
                        type="button"
                        className="bg-[var(--color-warning)] text-[var(--color-white)] p-1 lg:p-2 text-xs lg:text-sm rounded-md"
                        onClick={refreshItemData}
                        tooltip={t("globals.refresh")}
                        tooltipOptions={{
                            position: 'top',
                            className: 'font-normal rounded text-sm p-1'
                        }}
                    >
                        <IoMdRefresh size={18} />
                    </Button>
                </div>

                <div className="flex flex-grow">
                    <span className="p-input-icon-left w-full relative">
                        <i className="pi pi-search  pl-2 ml-1 bg-[var(--color-white)] text-[var(--color-dark)]" />
                        <InputText
                            type="search"
                            className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] text-xs rounded-md pl-5 lg:py-2 py-1"
                            placeholder={t("globals.globalSearch")}
                            value={globalFilterValue}
                            onChange={onGlobalFilterChange}
                        />
                    </span>
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <Calendar
                        value={calendarCreateDateFrom}
                        dateFormat="mm-dd-yy"
                        id="fromDate"
                        name="fromDate"
                        onChange={(e) => { setCalendarCreateDateFrom(e.value); searchChange(e.value, 'createDateSearchFrom', 'date') }}
                        showIcon
                        placeholder={t("globals.startDatePlaceholder")}
                        yearRange="2023:2025"
                        monthNavigator
                        yearNavigator
                        className="calendardark w-[130px] lg:w-[150px] bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] p-1 lg:p-2 rounded-md text-xs"
                    />

                    <Calendar
                        value={calendarCreateDateTo}
                        dateFormat="mm-dd-yy"
                        id="toDate"
                        name="toDate"
                        onChange={(e) => { setCalendarCreateDateTo(e.value); searchChange(e.value, 'createDateSearchTo', 'date') }}
                        showIcon
                        placeholder={t("globals.endDatePlaceholder")}
                        yearRange="2023:2025"
                        monthNavigator
                        yearNavigator
                        className="calendardark w-[130px] lg:w-[150px] bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] p-1 lg:p-2 rounded-md text-xs"
                    />
                </div>

                <div className="card flex justify-center gap-2">
                    <Button
                        type="button"
                        className="bg-[var(--color-primary)] text-[var(--color-white)] p-1 lg:p-2 text-xs lg:text-sm rounded-md"
                        onClick={() => { setListSearch(); }}
                    >
                        {t("globals.apply")}
                    </Button>
                    <Button
                        type="button"
                        className="bg-[var(--color-danger)] text-[var(--color-white)] p-1 lg:p-2 text-xs lg:text-sm rounded-md"
                        onClick={() => { clearListSearch('search'); setCalendarCreateDateTo(null); setCalendarCreateDateFrom(null); }}
                    >
                        {t("globals.clearAll")}
                    </Button>
                    {/* <Button
                        onClick={() => setVisible(true)}
                        className="p-1 lg:p-2 bg-[var(--color-white)] text-[var(--color-primary)] border border-[var(--color-border)] text-xs lg:text-sm rounded-md"
                    >
                        <IoMdSettings size={20} />
                    </Button> */}
                </div>
            </div>

            {/* <Dialog
                header={t("globals.columnVisibility")}
                visible={visible}
                onHide={() => setVisible(false)}
                className="w-full max-w-[95vw] sm:max-w-[70vw] md:max-w-[60vw] lg:max-w-[50vw] text-xs lg:text-sm"
                style={{
                    position: "fixed",
                    top: "10vh",
                    left: "50%",
                    transform: "translateX(-50%)",
                    maxHeight: "80vh",
                    overflowY: "auto"
                }}
            >
                <div className="my-2">
                    <label className="flex items-center justify-end space-x-2 mb-2">
                        <Checkbox
                            onChange={handleSelectAll}
                            checked={visibleColumns.length === columnsConfigDefault.length}
                        >
                        </Checkbox>
                        <span className=" text-sm font-normal text-black">{t("globals.selectAll")}</span>
                    </label>
                </div>

                <div className="selectable-columns-container">
                    <div className="selectable-columns-grid">
                        {columnsConfigDefault.map((col) => (
                            <label key={col.field} className="flex items-center space-x-2">
                                <Checkbox
                                    onChange={() => handleColumnChange(col.field)}
                                    checked={visibleColumns.includes(col.field)}
                                    disabled={col.isDefault}>
                                </Checkbox>
                                <span className="text-base sm:text-sm font-normal text-black">{col.header}</span>
                            </label>
                        ))}
                    </div>
                </div>
            </Dialog> */}

            <div className="m-2">
                {!query.isLoading && (
                    <DataTable
                        ref={dtRef}
                        value={query?.data}
                        dataKey="id"
                        showGridlines
                        filters={filters}
                        sortField={sortField}
                        sortOrder={sortOrder}
                        onSort={onSort}
                        onFilter={(e) => setFilters(e.filters)}
                        removableSort
                        paginator
                        rowsPerPageOptions={[10, 25, 50]}
                        rows={rows}
                        first={first}
                        totalRecords={totalRecords}
                        onPage={onPage}
                        globalFilter={globalFilterValue}
                        globalFilterFields={columnsConfig.map(config => config.field)}
                        paginatorTemplate={t('globals.layout')}
                        currentPageReportTemplate={t('globals.report')}
                        className="p-datatable-gridlines datatable-responsive bg-[var(--color-white)] text-[var(--color-dark)] tableResponsive"
                        filterDisplay="row"
                        emptyMessage={t('globals.emptyMessage')}
                        resizableColumns
                        scrollable
                        scrollHeight="68vh"
                    >
                        <Column
                            header={t('globals.headerActions')}
                            headerStyle={{
                                backgroundColor: "var(--color-primary)",
                                color: "var(--color-white)",
                                textAlign: "center",
                            }}
                            body={(rowData) => actionBodyTemplate(rowData, openItem)}
                            style={{ width: '50px', minWidth: '50px', maxWidth: '50px', background: 'var(--color-white)', color: 'var(--color-dark)' }}
                            frozen
                            alignFrozen="left"
                            className="text-sm sticky bg-[var(--color-white)] text-[var(--color-dark)]  font-semibold whitespace-nowrap overflow-hidden text-ellipsis"
                        />
                        <Column
                            field="createDate" header={t("appUsers.columns.fields.createDate")} sortable headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            body={(rowData, { rowIndex }) => (
                                <>
                                    <div id={`tooltip-createDate-${rowIndex}`} className="text-left truncate font-medium">
                                        {formatDate(rowData.createDate)}
                                    </div>
                                </>
                            )}
                        />

                        <Column
                            field="name" header={t("appUsers.columns.fields.name")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.name || ''}
                                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                                    onChange={(e) => handleFilterChangeLocal("name", e.target.value)}
                                />
                            }
                            body={(rowData, { rowIndex }) => (
                                <>
                                    <div id={`tooltip-name-${rowIndex}`} className="text-left truncate font-medium">
                                        {rowData.name}
                                    </div>
                                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile hide-tooltip-mobile" target={`#tooltip-name-${rowIndex}`} content={rowData.name} showDelay={200} position="top" />
                                </>
                            )}
                        />

                        <Column
                            field="firstName" header={t("appUsers.columns.fields.firstName")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.firstName || ''}
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

                        <Column
                            field="lastName" header={t("appUsers.columns.fields.lastName")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.lastName || ''}
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

                        <Column
                            field="mobile" header={t("appUsers.columns.fields.mobile")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.mobile || ''}
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

                        <Column
                            field="mobileVerified" header={t("appUsers.columns.fields.mobileVerified")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.mobileVerified || ''}
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

                        <Column
                            field="emailId" header={t("appUsers.columns.fields.emailId")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.emailId || ''}
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

                        <Column
                            field="emailVerified" header={t("appUsers.columns.fields.emailVerified")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.emailVerified || ''}
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

                        <Column
                            field="shopName" header={t("appUsers.columns.fields.shopName")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.shopName || ''}
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

                        <Column
                            field="password" header={t("appUsers.columns.fields.password")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.password || ''}
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

                        <Column
                            field="pincode" header={t("appUsers.columns.fields.pincode")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.pincode || ''}
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

                        <Column
                            field="state" header={t("appUsers.columns.fields.state")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.state || ''}
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

                        <Column
                            field="district" header={t("appUsers.columns.fields.district")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.district || ''}
                                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                                    onChange={(e) => handleFilterChangeLocal("district", e.target.value)}
                                />
                            }
                            body={(rowData, { rowIndex }) => (
                                <>
                                    <div id={`tooltip-district-${rowIndex}`} className="text-left truncate font-medium">
                                        {rowData.pincode}
                                    </div>
                                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-district-${rowIndex}`} content={rowData.district} showDelay={200} position="top" />
                                </>
                            )}
                        />

                        <Column
                            field="address" header={t("appUsers.columns.fields.address")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.address || ''}
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

                        <Column
                            field="addressLine" header={t("appUsers.columns.fields.addressLine")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.addressLine || ''}
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

                        <Column
                            field="gst" header={t("appUsers.columns.fields.gst")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.gst || ''}
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

                        <Column
                            field="verifyShop" header={t("appUsers.columns.fields.verifyShop")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.verifyShop || ''}
                                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                                    onChange={(e) => handleFilterChangeLocal("verifyShop", e.target.value)}
                                />
                            }
                            body={(rowData, { rowIndex }) => (
                                <>
                                    <div id={`tooltip-verifyShop-${rowIndex}`} className="text-left truncate font-medium">
                                        {rowData.verifyShop}
                                    </div>
                                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-verifyShop-${rowIndex}`} content={rowData.verifyShop} showDelay={200} position="top" />
                                </>
                            )}
                        />

                        <Column
                            field="gstCertificate" header={t("appUsers.columns.fields.gstCertificate")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.gstCertificate || ''}
                                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                                    onChange={(e) => handleFilterChangeLocal("gstCertificate", e.target.value)}
                                />
                            }
                            body={(rowData, { rowIndex }) => (
                                <div className="text-left truncate font-medium">
                                    {renderFileCell(rowData, 'gstCertificate', rowIndex)}
                                </div>
                            )}
                        />

                        <Column
                            field="photoShopFront" header={t("appUsers.columns.fields.photoShopFront")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.photoShopFront || ''}
                                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                                    onChange={(e) => handleFilterChangeLocal("photoShopFront", e.target.value)}
                                />
                            }
                            body={(rowData, { rowIndex }) => (
                                <div className="text-left truncate font-medium">
                                    {renderFileCell(rowData, 'photoShopFront', rowIndex)}
                                </div>
                            )}
                        />

                        <Column
                            field="visitingCard" header={t("appUsers.columns.fields.visitingCard")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.visitingCard || ''}
                                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                                    onChange={(e) => handleFilterChangeLocal("visitingCard", e.target.value)}
                                />
                            }
                            body={(rowData, { rowIndex }) => (
                                <div className="text-left truncate font-medium">
                                    {renderFileCell(rowData, 'visitingCard', rowIndex)}
                                </div>
                            )}
                        />

                        <Column
                            field="cheque" header={t("appUsers.columns.fields.cheque")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.cheque || ''}
                                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                                    onChange={(e) => handleFilterChangeLocal("cheque", e.target.value)}
                                />
                            }
                            body={(rowData, { rowIndex }) => (
                                <div className="text-left truncate font-medium">
                                    {renderFileCell(rowData, 'cheque', rowIndex)}
                                </div>
                            )}
                        />

                        <Column
                            field="isActive" header={t("appUsers.columns.fields.isActive")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.isActive || ''}
                                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                                    onChange={(e) => handleFilterChangeLocal("isActive", e.target.value)}
                                />
                            }
                            body={(rowData, { rowIndex }) => (
                                <>
                                    <div id={`tooltip-isActive-${rowIndex}`} className="text-left truncate font-medium">
                                        {rowData.isActive ? "true" : "false"}
                                    </div>
                                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-isActive-${rowIndex}`} content={rowData.isActive} showDelay={200} position="top" />
                                </>
                            )}
                        />

                        <Column
                            field="isAdmin" header={t("appUsers.columns.fields.isAdmin")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.isAdmin || ''}
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

                        <Column
                            field="hasImpersonateAccess" header={t("appUsers.columns.fields.hasImpersonateAccess")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.hasImpersonateAccess || ''}
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

                        <Column
                            field="photoAttachment" header={t("appUsers.columns.fields.photoAttachment")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.photoAttachment || ''}
                                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                                    onChange={(e) => handleFilterChangeLocal("photoAttachment", e.target.value)}
                                />
                            }
                            body={(rowData, { rowIndex }) => (
                                <div className="text-left truncate font-medium">
                                    {renderFileCell(rowData, 'photoAttachment', rowIndex)}
                                </div>
                            )}
                        />

                        <Column
                            field="roleLabel" header={t("appUsers.columns.fields.roleLabel")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.roleLabel || ''}
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

                        <Column
                            field="publishLabel" header={t("appUsers.columns.fields.publishLabel")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.publishLabel || ''}
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

                        <Column
                            field="lastLogin" header={t("appUsers.columns.fields.lastLogin")} sortable
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            body={(rowData, { rowIndex }) => (
                                <>
                                    <div id={`tooltip-lastLogin-${rowIndex}`} className="text-left truncate font-medium">
                                        {formatDate(rowData.lastLogin)}
                                    </div>
                                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-lastLogin-${rowIndex}`} content={formatDate(rowData.lastLogin)} showDelay={200} position="top" />
                                </>
                            )}
                        />

                        <Column
                            field="totalPlot" header={t("appUsers.columns.fields.totalPlot")} sortable filter
                            headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                            style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                            filterElement={
                                <InputText
                                    value={query.tableSearch.searchRowFilter?.totalPlot || ''}
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
                    </DataTable>
                )}
            </div>

            <Dialog
                visible={isDeleteDialogVisible}
                style={{ width: '380px', fontSize: '12px' }}
                modal
                onHide={closeDeleteDialog}
            >
                <div className="bg-white text-black rounded-lg text-center relative">
                    <div className="imgContainer flex justify-center">
                        <div className="w-28 h-28 rounded-full border-2 p-1 border-[var(--color-border)] overflow-hidden flex items-center justify-center">
                            <Image
                                src={confirmImg}
                                alt="Delete Record?"
                                className="w-full h-full object-cover"
                            />
                        </div>
                    </div>
                    <div>
                        <p className="bg-white text-sm leading-relaxed">
                            {t("globals.confirmDelete")} <br />
                            <span className="font-medium text-[var(--color-danger)]">{t("globals.deleteWarning")}</span>
                        </p>
                    </div>
                    <div className="mt-2">
                        <div className="grid grid-cols-2 justify-center gap-2 sm:gap-4">
                            <Button
                                label={t("globals.noKeepIt")}
                                icon="pi pi-times"
                                onClick={closeDeleteDialog}
                                autoFocus
                                className="border-none bg-[var(--color-primary)] text-[var(--color-white)] px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg shadow-md transition duration-200 hover:scale-105 text-xs sm:text-sm md:text-base min-w-[120px] w-full sm:w-auto"
                            />
                            <Button
                                label={t("globals.yesDelete")}
                                icon="pi pi-check"
                                onClick={confirmDeleteItem}
                                className="border-none bg-[var(--color-danger)] text-[var(--color-white)] px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg shadow-md transition duration-200 hover:scale-105 text-xs sm:text-sm md:text-base min-w-[120px] w-full sm:w-auto"
                            />
                        </div>
                    </div>
                </div>
            </Dialog>

            <Dialog visible={isSuccessDialogOpen} onHide={() => setIsSuccessDialogOpen(false)} >
                <div className="p-0 max-w-sm mx-auto bg-white rounded-lg">
                    <div className="flex justify-between items-center border-b">
                        <button
                            onClick={() => setIsSuccessDialogOpen(false)}
                            className="bg-[var(--color-gray)]"
                        >
                            <i className="ri-close-fill text-xl"></i>
                        </button>
                    </div>
                    <div className="flex flex-col items-center p-3">
                        <Image
                            src={successimg}
                            alt={t("globals.recordDeleted")}
                            className="h-[100px] w-[100px] lg:h-[150px] lg:w-[150px] object-cover rounded-full"
                        />
                        <div className="text-center">
                            <h2 className="text-lg font-semibold text-black mb-2">{t("globals.recordDeleted")}</h2>
                        </div>
                    </div>
                </div>
            </Dialog>
        </div >
    )
}
