import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useListPage } from "../../../hooks/useListPage";
import { BiSolidTrash, Button, Calendar, Column, DataTable, Dialog, HiOutlinePlus, IoMdSettings ,Image, InputText, IoMdRefresh, MdOutlineUploadFile, MenuItem, RiPencilFill, SplitButton, TbFileExcel, TiEye, Toast, Tooltip, FilterMatchMode, Checkbox } from "../../../sharedBase/globalImports";
import {useTranslation,useNavigate} from '../../../sharedBase/globalUtils';
import successimg from '../../../assets/images/success.gif';
import confirmImg from '../../../assets/images/are-you-sure.jpg';
import { Category } from "../../../core/model/category";
import { RowData } from "../../../types/listpage";
import { useListQuery } from "../../../store/useListQuery";
import { CategoriesService } from "../../../core/service/categories.service";
import Loader from "../../../components/Loader";
export default function CategoriesList() {
    const navigate = useNavigate();
    const baseModelName = "categories";
const typeName= "category";
    const { t, i18n } = useTranslation();
    const dtRef = useRef<DataTable<Category[]>>(null);
    // search
    const [calendarCreateDateFrom, setCalendarCreateDateFrom] = useState<Date | undefined | null>(null);
    const [calendarCreateDateTo, setCalendarCreateDateTo] = useState<Date | undefined | null>(null);
    const categoriesService = CategoriesService();
    const query = useListQuery<Category>(categoriesService);
    const {
        roleData, hasAccess,globalFilterValue, setGlobalFilterValue, onGlobalFilterChange, refreshItemData, isDeleteDialogVisible,
        deleteItem, closeDeleteDialog, setFilters, onSort, onPage, first, rows, sortField, sortOrder, totalRecords,
        filters, setListSearch, clearListSearch, searchChange, openItem, confirmDeleteItem,
        toast, isSuccessDialogOpen, setIsSuccessDialogOpen, exportToExcel,
        importFromExcel, addData, handleDelete, useColumnConfig,visible,setVisible }
        = useListPage<typeof query, Category>({
            query: query,
            props: {
                initialFilterValue: '',
                baseModelName: baseModelName,
                typeName: typeName,
                service: categoriesService
            }
        });
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

        const { columnsConfig, visibleColumns, handleSelectAll, handleColumnChange } = useColumnConfig(columnsConfigDefault, roleData);

    useEffect(() => {
        if (query.search) {
            if (query.search?.createDateSearchFrom) {
                setCalendarCreateDateFrom(new Date(query.search.createDateSearchFrom))
            }
            if (query.search?.createDateSearchTo) {
                setCalendarCreateDateTo(new Date(query.search.createDateSearchTo))
            }
        }

        if (query.tableSearch) {
            if (query.tableSearch.filter) {
                setGlobalFilterValue(query.tableSearch.filter);
            }
        }
    }, [query.search, query.tableSearch, setGlobalFilterValue]);

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
    }, [columnsConfig, setFilters, setGlobalFilterValue, query.tableSearch]);

    const items: MenuItem[] = []
    if (roleData && hasAccess(roleData, "Add")) {
        items.push({
            label: t("globals.add"),
            icon: 'pi pi-plus',
            command: () => addData(navigate, baseModelName)
        });
    }
if (roleData && hasAccess(roleData, "Export")){
    items.push({
        label: t("globals.exportExcel"),
        icon: 'pi pi-file-excel',
        command: () => exportToExcel(categoriesService, globalFilterValue || '', 'Category')
    });
}
    if (roleData && hasAccess(roleData, "Import")) {
        items.push({
            label: t("globals.import"),
            icon: 'pi pi-upload',
            command: () => importFromExcel(navigate, baseModelName)
        });
    }

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

    const actionBodyTemplate = useCallback((rowData: Category, openItem: (item: Category, action: string) => void) => {
        return (
            <div className="flex items-center justify-start action-group gap-3">
                {hasAccess(roleData, "View") && (
                    <div id={`tooltip-view-${rowData.id}`} className="p-button-text text-xs w-2 text-center cursor-pointer" onClick={() => openItem(rowData, 'view')}>
                        <TiEye size={17} className="font-bold text-[var(--color-primary)]" />
                    </div>
                )}
                <Tooltip className='text-xs font-semibold hide-tooltip-mobile' target={`#tooltip-view-${rowData.id}`} content={t("globals.viewData")} showDelay={200} position="top" />

                {hasAccess(roleData, "Edit") && (
                    <div id={`tooltip-edit-${rowData.id}`} className="p-button-text text-xs w-2 text-center cursor-pointer" onClick={() => openItem(rowData, 'edit')}>
                        <RiPencilFill size={17} className="font-bold" />
                    </div>
                )}
                <Tooltip className='text-xs font-semibold hide-tooltip-mobile' target={`#tooltip-edit-${rowData.id}`} content={t("globals.editData")} showDelay={200} position="top" />

                {hasAccess(roleData, "Delete") && (
                    <div id={`tooltip-delete-${rowData.id}`} className="p-button-text text-xs w-2 text-center cursor-pointer" onClick={() => handleDelete(deleteItem, rowData.id)} >
                        <BiSolidTrash size={17} className="font-bold text-[var(--color-danger)]" />
                    </div>
                )}
                <Tooltip className='text-xs font-semibold hide-tooltip-mobile' target={`#tooltip-delete-${rowData.id}`} content={t("globals.deleteData")} showDelay={200} position="top" />
            </div>
        );
    }, [deleteItem, handleDelete, hasAccess, roleData, t]);

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
                <h1 className="font-bold text-[16px] lg:text-xl ml-2">{t("categories.form_detail.fields.modelname")}</h1>
            </div>
 {query.isLoading ? (
                <Loader />
            ) : (
                <>
            <div className="flex mx-2 flex-wrap justify-between items-center gap-3 border text-[var(--color-dark)] border-[var(--color-border)] rounded-md p-1 lg:my-1">
                <div className="flex sm:flex md:flex lg:hidden card justify-content-center">
                    <Toast ref={toast}></Toast>
                    <SplitButton
                        label={t("globals.action")}
                        className="small-button text-xs lg:text-sm border border-[var(--color-border)] p-1 lg:p-2"
                        model={items} />
                </div>

                <div className="hidden lg:flex items-center space-x-2 flex-wrap  bg-[var(--color-white)] text-[var(--color-dark)]">
                    {hasAccess(roleData, "Add") && (
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
                   )} 
                    {hasAccess(roleData, "Export") && (
                    <Button
                        type="button"
                        className="bg-[var(--color-success)] text-[var(--color-white)] p-1 lg:p-2 text-xs lg:text-sm rounded-md"
                        onClick={() => exportToExcel(categoriesService, globalFilterValue || '', 'Category')}
                        tooltip={t("globals.exportExcel")}
                        tooltipOptions={{
                            position: 'top',
                            className: 'font-normal rounded text-sm p-1'
                        }}
                    >
                        <TbFileExcel size={18} />
                    </Button>
                    )}
                    {hasAccess(roleData, "Import") && (
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
                   )}

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
                        onChange={(e) => { setCalendarCreateDateFrom(e.value); searchChange(e.value, 'createDateSearchFrom') }}
                        showIcon
                        placeholder={t("globals.startDatePlaceholder")}
                        yearRange="2023:2025"
                        monthNavigator
                        yearNavigator
                        className="calendardark w-[180px] bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] p-1 lg:p-2 rounded-md text-xs"
                    />

                    <Calendar
                        value={calendarCreateDateTo}
                        dateFormat="mm-dd-yy"
                        id="toDate"
                        name="toDate"
                        onChange={(e) => { setCalendarCreateDateTo(e.value); searchChange(e.value, 'createDateSearchTo') }}
                        showIcon
                        placeholder={t("globals.endDatePlaceholder")}
                        yearRange="2023:2025"
                        monthNavigator
                        yearNavigator
                        className="calendardark w-[180px] bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] p-1 lg:p-2 rounded-md text-xs"
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
                        onClick={() => { setCalendarCreateDateTo(null); setCalendarCreateDateFrom(null);clearListSearch('search');  }}
                    >
                        {t("globals.clearAll")}
                    </Button>
                    <Button
                        onClick={() => setVisible(true)}
                        className="p-1 lg:p-2 bg-[var(--color-white)] text-[var(--color-primary)] border border-[var(--color-border)] text-xs lg:text-sm rounded-md"
                    >
                        <IoMdSettings size={20} />
                    </Button>
                </div>
                <Dialog
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
                                        checked={visibleColumns.length === columnsConfig.length}
                                    >
                                    </Checkbox>
                                    <span className="text-sm sm:text-xs font-normal text-black">{t("globals.selectAll")}</span>
                                </label>
                            </div>

                            <div className="selectable-columns-container">
                                <div className="selectable-columns-grid">
                                    {columnsConfigDefault.map((col) => (
                                        <label key={col.field} className="flex items-center space-x-2">
                                            <>
                                                <Checkbox
                                                    onChange={() => handleColumnChange(col.field)}
                                                    checked={visibleColumns.includes(col.field)}
                                                    disabled={col.isDefault}
                                                >
                                                </Checkbox>
                                                <span className="text-sm sm:text-xs font-normal text-black">{col.header}</span>
                                            </>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </Dialog>
            </div>         

            <div className="m-2">
                {!query.isLoading && (
                    <DataTable
                    key={i18n.language}
                        ref={dtRef}
                        value={query?.data}
                        dataKey="id"
                        showGridlines
                        filters={filters}
                        sortField={sortField}
                        sortOrder={sortOrder as 1 | 0 | -1}
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
                        {hasAccess(roleData, "Actions") && (
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
                        )}
                       {visibleColumns.includes('name') && (
<Column field="name" header={t("categories.columns.fields.name")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
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
<Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-name-${rowIndex}`} content={rowData.name} showDelay={200} position="top" />
</>
)}
 />)} 
{visibleColumns.includes('slug') && (
<Column field="slug" header={t("categories.columns.fields.slug")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
value={query.tableSearch.searchRowFilter?.slug || ''}
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
 />)} 
{visibleColumns.includes('icon') && (
<Column field="icon" header={t("categories.columns.fields.icon")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
value={query.tableSearch.searchRowFilter?.icon || ''}
className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
onChange={(e) => handleFilterChangeLocal("icon", e.target.value)}
/> 
 }
body={(rowData, { rowIndex }) => (
<div className="text-left truncate font-medium">
 {renderFileCell(rowData, 'icon', rowIndex)}
 </div>
)} />)} 
{visibleColumns.includes('createDate') && (
<Column field="createDate" header={t("categories.columns.fields.createDate")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
value={query.tableSearch.searchRowFilter?.createDate || ''}
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
 />)} 
{visibleColumns.includes('createById') && (
<Column field="createById" header={t("categories.columns.fields.createById")} sortable filter
headerStyle={{backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
style={{width: "200px", backgroundColor: "var(--color-white)" }}
filterElement={
<InputText
value={query.tableSearch.searchRowFilter?.createById || ''}
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
 />)} 


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
            </>
            )}
        </div >
    )
}
