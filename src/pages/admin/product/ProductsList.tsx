import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Product } from "../../../core/model/product";
import successimg from '../../../assets/images/success.gif';
import { ProductService } from "../../../core/service/products.service";
import confirmImg from '../../../assets/images/are-you-sure.jpg'
import { BiSolidTrash, Button, Calendar, Checkbox, Column, DataTable, Dialog, FilterMatchMode, HiOutlinePlus, Image, InputText, IoMdRefresh, IoMdSettings, MdOutlineUploadFile, MenuItem, RiPencilFill, SplitButton, TbFileExcel, TiEye, Toast, Tooltip } from "../../../sharedBase/globalImports";
import { useNavigate, useTranslation } from '../../../sharedBase/globalUtils';
import { useListPage } from "../../../hooks/useListPage";
import { useListQuery } from "../../../store/useListQuery";
import Loader from "../../../components/Loader";


const ProductsList = () => {
  const navigate = useNavigate();
  const baseModelName = "product";
  const { t } = useTranslation();
  const productService = ProductService();
  const query = useListQuery<Product>(productService);
  const [visible, setVisible] = useState(false);
  const dtRef = useRef<DataTable<Product[]>>(null);
  // search
  const [calendarCreateDateFrom, setCalendarCreateDateFrom] = useState<Date | undefined | null>(null);
  const [calendarCreateDateTo, setCalendarCreateDateTo] = useState<Date | undefined | null>(null);

  const columnsConfigDefault = useMemo(() => [
    { field: "name", header: t("products.columns.fields.name"), isDefault: true, show: true },
    { field: "slug", header: t("products.columns.fields.slug"), isDefault: true, show: true },
    { field: "sku", header: t("products.columns.fields.sku"), isDefault: true, show: true },
    { field: "specifications", header: t("products.columns.fields.specifications"), isDefault: true, show: true },
    { field: "shippingAmount", header: t("products.columns.fields.shippingAmount"), isDefault: true, show: true },
    { field: "regularPrice", header: t("products.columns.fields.regularPrice"), isDefault: true, show: true },
    { field: "salePrice", header: t("products.columns.fields.salePrice"), isDefault: true, show: true },
    { field: "cgst", header: t("products.columns.fields.cgst"), isDefault: false, show: false },
    { field: "sgst", header: t("products.columns.fields.sgst"), isDefault: false, show: false },
    { field: "igst", header: t("products.columns.fields.igst"), isDefault: false, show: false },
    { field: "categoryId", header: t("products.columns.fields.categoryId"), isDefault: false, show: false },
    { field: "productStatus", header: t("products.columns.fields.productStatus"), isDefault: false, show: false, },
    { field: "category", header: t("products.columns.fields.category"), isDefault: false, show: false },
    { field: "minQty", header: t("products.columns.fields.minQty"), isDefault: false, show: false },
    { field: "minQtyFarmer", header: t("products.columns.fields.minQtyFarmer"), isDefault: false, show: false },
    { field: "salePriceFarmer", header: t("products.columns.fields.salePriceFarmer"), isDefault: false, show: false },
    { field: "isActive", header: t("products.columns.fields.isActive"), isDefault: false, show: false, boolean: true },
    { field: "orderNo", header: t("products.columns.fields.orderNo"), isDefault: false, show: false },
    { field: "deliveredData", header: t("products.columns.fields.deliveredData"), isDefault: false, show: false },
    { field: "totalDeliverProduct", header: t("products.columns.fields.totalDeliverProduct"), isDefault: false, show: false },
    { field: "isParent", header: t("products.columns.fields.isParent"), isDefault: false, show: false, boolean: true },
    { field: "variableLabel", header: t("products.columns.fields.variableLabel"), isDefault: false, show: false },
    { field: "variableValue", header: t("products.columns.fields.variableValue"), isDefault: false, show: false },
  ], [t]);

  const {
    roleData, hasAccess, globalFilterValue, setGlobalFilterValue, onGlobalFilterChange, refreshItemData, isDeleteDialogVisible,
    deleteItem, closeDeleteDialog, setFilters, onSort, onPage, first, rows, sortField, sortOrder, totalRecords,
    filters, setListSearch, clearListSearch, searchChange, openItem, confirmDeleteItem,
    toast, isSuccessDialogOpen, setIsSuccessDialogOpen, exportToExcel,
    importFromExcel, addData, handleDelete, useColumnConfig }
    = useListPage<typeof query, Product>({
      query: query,
      props: {
        initialFilterValue: '',
        baseModelName: baseModelName,
        service: productService
      }
    });

  const { columnsConfig, visibleColumns, handleSelectAll, handleColumnChange } = useColumnConfig(columnsConfigDefault, roleData);

  useEffect(() => {
    if (query.search) {
      if (query.search?.createDateSearchFrom) {
        setCalendarCreateDateFrom(new Date(query.search.createDateSearchFrom));
      }
      if (query.search?.createDateSearchTo) {
        setCalendarCreateDateTo(new Date(query.search.createDateSearchTo));
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
  if (hasAccess(roleData, "Add")) {
  items.push({
    label: t("globals.add"),
    icon: 'pi pi-plus',
    command: () => addData(navigate, baseModelName)
  });
  }

  items.push({
    label: t("globals.exportExcel"),
    icon: 'pi pi-file-excel',
    command: () => exportToExcel(productService, globalFilterValue || '', 'Product')
  });

  if (hasAccess(roleData, "Import")) {
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

  const actionBodyTemplate = useCallback((rowData: Product, openItem: (item: Product, action: string) => void) => {
    return (
      <div className="flex items-center justify-start action-group gap-3">
        {hasAccess(roleData, "View") && (
        <Button id={`tooltip-view-${rowData.id}`} className="p-button-text text-xs w-3 text-center" onClick={() => openItem(rowData, 'view')}>
          <TiEye size={17} className="font-bold text-[var(--color-primary)]" />
        </Button>
        )}
        <Tooltip className='text-xs font-semibold hide-tooltip-mobile' target={`#tooltip-view-${rowData.id}`} content="View Data" showDelay={200} position="top" />

        {hasAccess(roleData, "Edit") && (
        <Button id={`tooltip-edit-${rowData.id}`} className="p-button-text text-xs w-3 text-center" onClick={() => openItem(rowData, 'edit')}>
          <RiPencilFill size={17} className="font-bold" />
        </Button>
        )}
        <Tooltip className='text-xs font-semibold hide-tooltip-mobile' target={`#tooltip-edit-${rowData.id}`} content="Edit Data" showDelay={200} position="top" />

        {hasAccess(roleData, "Delete") && (
        <Button id={`tooltip-delete-${rowData.id}`} className="p-button-text text-xs w-3 text-center text-[var(--color-danger)]" onClick={() => handleDelete(deleteItem, rowData.id)} >
          <BiSolidTrash size={17} className="font-bold" />
        </Button>
        )}
        <Tooltip className='text-xs font-semibold hide-tooltip-mobile' target={`#tooltip-delete-${rowData.id}`} content="Delete Data" showDelay={200} position="top" />
      </div>
    );
  }, [deleteItem, handleDelete, hasAccess, roleData]);

  return (
    <div className='relative h-screen flex flex-col overflow-auto'>
      <div className="flex justify-between items-center m-1">
        <h1 className="font-bold text-[16px] lg:text-xl">{t("products.form_detail.fields.modelname")}</h1>
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

            <div className="hidden lg:flex items-center space-x-2 flex-wrap  text-[var(--color-white)] bg-[var(--color-white)]">
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

              <Button
                type="button"
                className="bg-[var(--color-success)] text-[var(--color-white)] p-1 lg:p-2 text-xs lg:text-sm rounded-md"
                onClick={() => exportToExcel(productService, globalFilterValue || '', 'Product')}
                tooltip={t("globals.exportExcel")}
                tooltipOptions={{
                  position: 'top',
                  className: 'font-normal rounded text-sm p-1'
                }}
              >
                <TbFileExcel size={18} />
              </Button>

              {hasAccess(roleData, "Import") && (
              <Button
                type="button"
                className="bg-[var(--color-info)]  text-[var(--color-white)] p-1 lg:p-2 text-xs lg:text-sm rounded-md"
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
                className="bg-[var(--color-warning)] text-[var(--color-white)] p-2 text-sm rounded-md"
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
                  className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] text-xs lg:text-sm rounded-md pl-5 lg:py-2 py-1"
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
                onClick={() => setListSearch()}
                tooltip={t("globals.apply")}
                tooltipOptions={{
                  position: 'top',
                  className: 'font-normal rounded text-sm p-1'
                }}
              >
                {t("globals.apply")}
              </Button>
              <Button
                type="button"
                className="bg-[var(--color-danger)] text-[var(--color-white)] p-1 lg:p-2 text-xs lg:text-sm rounded-md"
                onClick={() => { clearListSearch('search'); setCalendarCreateDateTo(null); setCalendarCreateDateFrom(null); }}
                tooltip={t("globals.clearAll")}
                tooltipOptions={{
                  position: 'top',
                  className: 'font-normal rounded text-sm p-1'
                }}
              >
                {t("globals.clearAll")}
              </Button>
              <Button
                onClick={() => setVisible(true)}
                className="p-1 lg:p-2 bg-[var(--color-white)] text-[var(--color-primary)] border border-[var(--color-border)] text-xs lg:text-sm rounded-md"          >
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
              <div className="mb-2 ">
                <label className="flex items-center justify-end space-x-2 mb-2">
                  <Checkbox
                    onChange={handleSelectAll}
                    checked={visibleColumns.length === columnsConfig.length}
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
                        disabled={col.isDefault}
                      >
                      </Checkbox>
                      <span className="text-base sm:text-sm font-normal text-black">{col.header}</span>
                    </label>
                  ))}
                </div>
              </div>
            </Dialog>
          </div>

          <div className="m-2">
            <DataTable
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

              {visibleColumns.includes('name') && (
              <Column
                field="name" header={t("products.columns.fields.name")} sortable
                headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                filter filterElement={
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
              />
              )}
              {visibleColumns.includes('slug') && (
              <Column
                field="slug" header={t("products.columns.fields.slug")} sortable
                headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                filter filterElement={
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
              />
              )}
              {visibleColumns.includes('sku') && (
              <Column
                field="sku" header={t("products.columns.fields.sku")} sortable
                headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                filter filterElement={
                  <InputText
                    value={query.tableSearch.searchRowFilter?.sku || ''}
                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                    onChange={(e) => handleFilterChangeLocal("sku", e.target.value)}
                  />
                }
                body={(rowData, { rowIndex }) => (
                  <>
                    <div id={`tooltip-sku-${rowIndex}`} className="text-left truncate font-medium">
                      {rowData.sku}
                    </div>
                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-sku-${rowIndex}`} content={rowData.sku} showDelay={200} position="top" />
                  </>
                )}
              />
              )}
              {visibleColumns.includes('specifications') && (
              <Column
                field="specifications" header={t("products.columns.fields.specifications")} sortable
                headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                filter filterElement={
                  <InputText
                    value={query.tableSearch.searchRowFilter?.specifications || ''}
                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                    onChange={(e) => handleFilterChangeLocal("specifications", e.target.value)}
                  />
                }
                body={(rowData, { rowIndex }) => (
                  <>
                    <div id={`tooltip-specifications-${rowIndex}`} className="text-left truncate font-medium">
                      {rowData.specifications}
                    </div>
                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-specifications-${rowIndex}`} content={rowData.specifications} showDelay={200} position="top" />
                  </>
                )}
              />
              )}
              {visibleColumns.includes('shippingAmount') && (
              <Column
                field="shippingAmount" header={t("products.columns.fields.shippingAmount")} sortable
                headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                filter filterElement={
                  <InputText
                    value={query.tableSearch.searchRowFilter?.shippingAmount || ''}
                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                    onChange={(e) => handleFilterChangeLocal("shippingAmount", e.target.value)}
                  />
                }
                body={(rowData, { rowIndex }) => (
                  <>
                    <div id={`tooltip-shippingAmount-${rowIndex}`} className="text-left truncate font-medium">
                      {rowData.shippingAmount}
                    </div>
                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-shippingAmount-${rowIndex}`} content={rowData.shippingAmount} showDelay={200} position="top" />
                  </>
                )}
              />
              )}
              {visibleColumns.includes('regularPrice') && (
              <Column
                field="regularPrice" header={t("products.columns.fields.regularPrice")} sortable
                headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                filter filterElement={
                  <InputText
                    value={query.tableSearch.searchRowFilter?.regularPrice || ''}
                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                    onChange={(e) => handleFilterChangeLocal("regularPrice", e.target.value)}
                  />
                }
                body={(rowData, { rowIndex }) => (
                  <>
                    <div id={`tooltip-regularPrice-${rowIndex}`} className="text-left truncate font-medium">
                      {rowData.regularPrice}
                    </div>
                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-regularPrice-${rowIndex}`} content={rowData.regularPrice} showDelay={200} position="top" />
                  </>
                )}
              />
              )}
              {visibleColumns.includes('salePrice') && (
              <Column
                field="salePrice" header={t("products.columns.fields.salePrice")} sortable
                headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                filter filterElement={
                  <InputText
                    value={query.tableSearch.searchRowFilter?.salePrice || ''}
                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                    onChange={(e) => handleFilterChangeLocal("salePrice", e.target.value)}
                  />
                }
                body={(rowData, { rowIndex }) => (
                  <>
                    <div id={`tooltip-salePrice-${rowIndex}`} className="text-left truncate font-medium">
                      {rowData.salePrice}
                    </div>
                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-salePrice-${rowIndex}`} content={rowData.salePrice} showDelay={200} position="top" />
                  </>
                )}
              />
              )}
              {visibleColumns.includes('cgst') && (
              <Column
                field="cgst" header={t("products.columns.fields.cgst")} sortable
                headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                filter filterElement={
                  <InputText
                    value={query.tableSearch.searchRowFilter?.cgst || ''}
                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                    onChange={(e) => handleFilterChangeLocal("cgst", e.target.value)}
                  />
                }
                body={(rowData, { rowIndex }) => (
                  <>
                    <div id={`tooltip-cgst-${rowIndex}`} className="text-left truncate font-medium">
                      {rowData.cgst}
                    </div>
                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-cgst-${rowIndex}`} content={rowData.cgst} showDelay={200} position="top" />
                  </>
                )}
              />
              )}
              {visibleColumns.includes('sgst') && (
              <Column
                field="sgst" header={t("products.columns.fields.sgst")} sortable
                headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                filter filterElement={
                  <InputText
                    value={query.tableSearch.searchRowFilter?.sgst || ''}
                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                    onChange={(e) => handleFilterChangeLocal("sgst", e.target.value)}
                  />
                }
                body={(rowData, { rowIndex }) => (
                  <>
                    <div id={`tooltip-sgst-${rowIndex}`} className="text-left truncate font-medium">
                      {rowData.sgst}
                    </div>
                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-sgst-${rowIndex}`} content={rowData.sgst} showDelay={200} position="top" />
                  </>
                )}
              />
              )}
              {visibleColumns.includes('igst') && (
              <Column
                field="igst" header={t("products.columns.fields.igst")} sortable
                headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                filter filterElement={
                  <InputText
                    value={query.tableSearch.searchRowFilter?.igst || ''}
                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                    onChange={(e) => handleFilterChangeLocal("igst", e.target.value)}
                  />
                }
                body={(rowData, { rowIndex }) => (
                  <>
                    <div id={`tooltip-igst-${rowIndex}`} className="text-left truncate font-medium">
                      {rowData.igst}
                    </div>
                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-igst-${rowIndex}`} content={rowData.igst} showDelay={200} position="top" />
                  </>
                )}
              />
              )}
              {visibleColumns.includes('categoryId') && (
              <Column
                field="categoryId" header={t("products.columns.fields.categoryId")} sortable
                headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                filter filterElement={
                  <InputText
                    value={query.tableSearch.searchRowFilter?.categoryId || ''}
                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                    onChange={(e) => handleFilterChangeLocal("categoryId", e.target.value)}
                  />
                }
                body={(rowData, { rowIndex }) => (
                  <>
                    <div id={`tooltip-categoryId-${rowIndex}`} className="text-left truncate font-medium">
                      {rowData.categoryId}
                    </div>
                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-categoryId-${rowIndex}`} content={rowData.categoryId} showDelay={200} position="top" />
                  </>
                )}
              />
              )}
              {visibleColumns.includes('productStatus') && (
              <Column
                field="productStatus" header={t("products.columns.fields.productStatus")} sortable
                headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                filter filterElement={
                  <InputText
                    value={query.tableSearch.searchRowFilter?.productStatus || ''}
                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                    onChange={(e) => handleFilterChangeLocal("productStatus", e.target.value)}
                  />
                }
                body={(rowData, { rowIndex }) => (
                  <>
                    <div id={`tooltip-productStatus-${rowIndex}`} className="text-left truncate font-medium">
                      {rowData.pincode}
                    </div>
                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-productStatus-${rowIndex}`} content={rowData.productStatus} showDelay={200} position="top" />
                  </>
                )}
              />
              )}
              {visibleColumns.includes('category') && (
              <Column
                field="category" header={t("products.columns.fields.category")} sortable
                headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                filter filterElement={
                  <InputText
                    value={query.tableSearch.searchRowFilter?.category || ''}
                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                    onChange={(e) => handleFilterChangeLocal("category", e.target.value)}
                  />
                }
                body={(rowData, { rowIndex }) => (
                  <>
                    <div id={`tooltip-category-${rowIndex}`} className="text-left truncate font-medium">
                      {rowData.category}
                    </div>
                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-category-${rowIndex}`} content={rowData.category} showDelay={200} position="top" />
                  </>
                )}
              />
              )}
              {visibleColumns.includes('minQty') && (
              <Column
                field="minQty" header={t("products.columns.fields.minQty")} sortable
                headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                filter filterElement={
                  <InputText
                    value={query.tableSearch.searchRowFilter?.minQty || ''}
                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                    onChange={(e) => handleFilterChangeLocal("minQty", e.target.value)}
                  />
                }
                body={(rowData, { rowIndex }) => (
                  <>
                    <div id={`tooltip-minQty-${rowIndex}`} className="text-left truncate font-medium">
                      {rowData.minQty}
                    </div>
                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-minQty-${rowIndex}`} content={rowData.minQty} showDelay={200} position="top" />
                  </>
                )}
              />
              )}
              {visibleColumns.includes('minQtyFarmer') && (
              <Column
                field="minQtyFarmer" header={t("products.columns.fields.minQtyFarmer")} sortable
                headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                filter filterElement={
                  <InputText
                    value={query.tableSearch.searchRowFilter?.minQtyFarmer || ''}
                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                    onChange={(e) => handleFilterChangeLocal("minQtyFarmer", e.target.value)}
                  />
                }
                body={(rowData, { rowIndex }) => (
                  <>
                    <div id={`tooltip-minQtyFarmer-${rowIndex}`} className="text-left truncate font-medium">
                      {rowData.minQtyFarmer}
                    </div>
                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-minQtyFarmer-${rowIndex}`} content={rowData.minQtyFarmer} showDelay={200} position="top" />
                  </>
                )}
              />
              )}
              {visibleColumns.includes('salePriceFarmer') && (
              <Column
                field="salePriceFarmer" header={t("products.columns.fields.salePriceFarmer")} sortable
                headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                filter filterElement={
                  <InputText
                    value={query.tableSearch.searchRowFilter?.salePriceFarmer || ''}
                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                    onChange={(e) => handleFilterChangeLocal("salePriceFarmer", e.target.value)}
                  />
                }
                body={(rowData, { rowIndex }) => (
                  <>
                    <div id={`tooltip-salePriceFarmer-${rowIndex}`} className="text-left truncate font-medium">
                      {rowData.salePriceFarmer}
                    </div>
                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-salePriceFarmer-${rowIndex}`} content={rowData.salePriceFarmer} showDelay={200} position="top" />
                  </>
                )}
              />
              )}
              {visibleColumns.includes('isActive') && (
              <Column
                field="isActive" header={t("products.columns.fields.isActive")} sortable
                headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                filter filterElement={
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
              )}
              {visibleColumns.includes('orderNo') && (
              <Column
                field="orderNo" header={t("products.columns.fields.orderNo")} sortable
                headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                filter filterElement={
                  <InputText
                    value={query.tableSearch.searchRowFilter?.orderNo || ''}
                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                    onChange={(e) => handleFilterChangeLocal("orderNo", e.target.value)}
                  />
                }
                body={(rowData, { rowIndex }) => (
                  <>
                    <div id={`tooltip-orderNo-${rowIndex}`} className="text-left truncate font-medium">
                      {rowData.orderNo}
                    </div>
                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-orderNo-${rowIndex}`} content={rowData.orderNo} showDelay={200} position="top" />
                  </>
                )}
              />
              )}
              {visibleColumns.includes('deliveredData') && (
              <Column
                field="deliveredData" header={t("products.columns.fields.deliveredData")} sortable
                headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                filter filterElement={
                  <InputText
                    value={query.tableSearch.searchRowFilter?.deliveredData || ''}
                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                    onChange={(e) => handleFilterChangeLocal("deliveredData", e.target.value)}
                  />
                }
                body={(rowData, { rowIndex }) => (
                  <>
                    <div id={`tooltip-deliveredData-${rowIndex}`} className="text-left truncate font-medium">
                      {rowData.deliveredData}
                    </div>
                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-deliveredData-${rowIndex}`} content={rowData.deliveredData} showDelay={200} position="top" />
                  </>
                )}
              />
              )}
              {visibleColumns.includes('totalDeliverProduct') && (
              <Column
                field="totalDeliverProduct" header={t("products.columns.fields.totalDeliverProduct")} sortable
                headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                filter filterElement={
                  <InputText
                    value={query.tableSearch.searchRowFilter?.totalDeliverProduct || ''}
                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                    onChange={(e) => handleFilterChangeLocal("totalDeliverProduct", e.target.value)}
                  />
                }
                body={(rowData, { rowIndex }) => (
                  <>
                    <div id={`tooltip-totalDeliverProduct-${rowIndex}`} className="text-left truncate font-medium">
                      {rowData.totalDeliverProduct}
                    </div>
                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-totalDeliverProduct-${rowIndex}`} content={rowData.totalDeliverProduct} showDelay={200} position="top" />
                  </>
                )}
              />
              )}
              {visibleColumns.includes('isParent') && (
              <Column
                field="isParent" header={t("products.columns.fields.isParent")} sortable
                headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                filter filterElement={
                  <InputText
                    value={query.tableSearch.searchRowFilter?.isParent || ''}
                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                    onChange={(e) => handleFilterChangeLocal("isParent", e.target.value)}
                  />
                }
                body={(rowData, { rowIndex }) => (
                  <>
                    <div id={`tooltip-isParent-${rowIndex}`} className="text-left truncate font-medium">
                      {rowData.isParent ? "true" : "false"}
                    </div>
                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-isParent-${rowIndex}`} content={rowData.isParent} showDelay={200} position="top" />
                  </>
                )}
              />
              )}
              {visibleColumns.includes('variableLabel') && (
              <Column
                field="variableLabel" header={t("products.columns.fields.variableLabel")} sortable
                headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                filter filterElement={
                  <InputText
                    value={query.tableSearch.searchRowFilter?.variableLabel || ''}
                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                    onChange={(e) => handleFilterChangeLocal("variableLabel", e.target.value)}
                  />
                }
                body={(rowData, { rowIndex }) => (
                  <>
                    <div id={`tooltip-variableLabel-${rowIndex}`} className="text-left truncate font-medium">
                      {rowData.variableLabel}
                    </div>
                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-variableLabel-${rowIndex}`} content={rowData.variableLabel} showDelay={200} position="top" />
                  </>
                )}
              />
              )}
              {visibleColumns.includes('variableValue') && (
              <Column
                field="variableValue" header={t("products.columns.fields.variableValue")} sortable
                headerStyle={{ backgroundColor: "var(--color-primary)", color: "var(--color-white)", textAlign: "center" }}
                style={{ width: "200px", backgroundColor: "var(--color-white)" }}
                filter filterElement={
                  <InputText
                    value={query.tableSearch.searchRowFilter?.variableValue || ''}
                    className="w-full bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] rounded-md p-[5px]"
                    onChange={(e) => handleFilterChangeLocal("variableValue", e.target.value)}
                  />
                }
                body={(rowData, { rowIndex }) => (
                  <>
                    <div id={`tooltip-variableValue-${rowIndex}`} className="text-left truncate font-medium">
                      {rowData.variableValue}
                    </div>
                    <Tooltip className="text-xs font-semibold hide-tooltip-mobile" target={`#tooltip-variableValue-${rowIndex}`} content={rowData.variableValue} showDelay={200} position="top" />
                  </>
                )}
              />
              )}
            </DataTable>
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
                  {t("globals.confirmDelete")}  <br />
                  <span className="font-medium text-[var(--color-danger)]">{t("globals.deleteWarning")}</span>
                </p>
              </div>
              <div className="mt-2">
                <div className="grid grid-cols-2 justify-center gap-2 sm:gap-4">
                  <Button
                    label={t("globals.noKeepIt")}
                    icon="pi pi-times"
                    onClick={closeDeleteDialog} autoFocus
                    className="border-none bg-[var(--color-primary)] text-[var(--color-white)] px-5 py-2.5 rounded-lg shadow-md transition duration-200 hover:scale-105"
                  />
                  <Button
                    label={t("globals.yesDelete")}
                    icon="pi pi-check"
                    onClick={confirmDeleteItem}
                    className="border-none bg-[var(--color-danger)] text-[var(--color-white)] px-5 py-2.5 rounded-lg shadow-md transition duration-200 hover:scale-105"
                  />
                </div>
              </div>
            </div>
          </Dialog>

          <Dialog visible={isSuccessDialogOpen} onHide={() => setIsSuccessDialogOpen(false)} >
            <div className="p-0 max-w-sm mx-auto bg-white rounded-lg shadow-lg">
              <div className="flex justify-between items-center border-b">
                <button
                  onClick={() => setIsSuccessDialogOpen(false)}
                  className="bg-[var(--color-gray)] hover:text-[#374151]"
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
                  <h2 className="text-lg text-black font-semibold mb-2">{t("globals.recordDeleted")}</h2>
                </div>
              </div>
            </div>
          </Dialog>

          <Toast ref={toast} />
        </>
      )}
    </div>
  )
}

export default ProductsList;