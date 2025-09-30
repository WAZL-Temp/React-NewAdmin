import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { DataTable, DataTableFilterMeta, DataTableValueArray, FilterMatchMode, Toast } from "../sharedBase/globalImports";
import { format, parseISO, useNavigate, useTranslation } from '../sharedBase/globalUtils';
import { useBaseService } from "../sharedBase/baseService";
import { Action, ColumnConfig, RoleData } from "../types/listpage";
import { UseListQueryResult } from "../store/useListQuery";
import { useFetchRoleDetailsData } from "../sharedBase/lookupService";
import { RoleDetail } from "../core/model/roledetail";
import { getGridData } from "../core/service/appUsers.service";
import { CustomFile } from "../core/model/customfile";

type UseListPageCommonProps = {
    initialFilterValue?: string;
    baseModelName?: string;
    typeName?: string;
    service: ReturnType<typeof useBaseService>;
    pageGridService?: ReturnType<typeof getGridData>;
    onFilterChange?: (value: string) => void;
    onConfirmDelete?: (id: number) => void;
    onDeleteItem?: (id: number) => void;
    onCloseDeleteDialog?: () => void;
    onShowSuccessMessage?: (message: string) => void;
};

type UseListGridPageProps<TQuery> = {
    query: TQuery;
    props: UseListPageCommonProps;
};

export const useColumnConfig = (columnsConfigDefault: ColumnConfig[], roleData: RoleDetail | RoleDetail[] | null) => {
    const hiddenColumns = useMemo<string[]>(() => {
        return (Array.isArray(roleData) ? roleData : [roleData])
            .filter((role): role is RoleData => !!role?.hideColumn)
            .reduce((acc: string[], role: RoleData) => {
                try {
                    const parsedColumns = JSON.parse(role.hideColumn!);
                    if (Array.isArray(parsedColumns)) {
                        acc.push(...parsedColumns.map((col: { value: string }) => col.value));
                    } else if (typeof parsedColumns === "object" && parsedColumns.value) {
                        acc.push(parsedColumns.value);
                    }
                } catch (error) {
                    console.error("Error parsing hideColumn:", error);
                }
                return acc;
            }, []);
    }, [roleData]);

    const filteredFixedColumns = useMemo(() => {
        return columnsConfigDefault.filter(col => col.isDefault && !hiddenColumns.includes(col.field));
    }, [hiddenColumns, columnsConfigDefault]);

    const fixedColumnFields = useMemo(() => filteredFixedColumns.map(col => col.field), [filteredFixedColumns]);

    const selectableColumns = useMemo(() => {
        return columnsConfigDefault.filter(col => !col.isDefault && !hiddenColumns.includes(col.field));
    }, [hiddenColumns, columnsConfigDefault]);

    const columnsConfig = useMemo(() => {
        return [...filteredFixedColumns, ...selectableColumns];
    }, [filteredFixedColumns, selectableColumns]);

    const [visibleColumns, setVisibleColumns] = useState(
        columnsConfigDefault.filter(col => col.isDefault || col.show).map(col => col.field)
    );

    useEffect(() => {
        setVisibleColumns((prevVisibleColumns) => {
            const allFields = [...fixedColumnFields, ...columnsConfig.map(col => col.field)];
            return prevVisibleColumns.length > 0
                ? prevVisibleColumns.filter(field => allFields.includes(field))
                : allFields;
        });
    }, [columnsConfig, fixedColumnFields]);

    const handleSelectAll = () => {
        if (visibleColumns.length === columnsConfigDefault.length) {
            setVisibleColumns(columnsConfigDefault.filter(col => col.isDefault).map(col => col.field));
        } else {
            setVisibleColumns(columnsConfigDefault.map(col => col.field));
        }
    };

    const handleColumnChange = (field: string) => {
        setVisibleColumns(prev => {
            if (prev.includes(field)) {
                return prev.filter(f => f !== field);
            } else {
                return [...prev, field];
            }
        });
    };
    return { columnsConfig, visibleColumns, setVisibleColumns, fixedColumnFields, selectableColumns, filteredFixedColumns, handleSelectAll, handleColumnChange };
};

export function useListGridPage<TQuery extends UseListQueryResult<TItem>, TItem>({ query, props }: UseListGridPageProps<TQuery>) {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [globalFilterValue, setGlobalFilterValue] = useState(props.initialFilterValue);
    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const toast = useRef<Toast>(null);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const dtRef = useRef<DataTable<DataTableValueArray>>(null);
    const [first, setFirst] = useState<number>(0);
    const [rows, setRows] = useState<number>(10);
    const [totalCount, setTotalCount] = useState<number>(0);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalRecords, setTotalRecords] = useState(0);
    const [sortField, setSortField] = useState<string>('Id DESC');
    const [sortOrder, setSortOrder] = useState<string | number | undefined>(1);
    const [filters, setFilters] = useState<DataTableFilterMeta>({ global: { value: null, matchMode: FilterMatchMode.CONTAINS } });
    const [roleData, setRoleData] = useState<RoleDetail | null>(null);
    const [search, setSearch] = useState<Record<string, unknown>>({});
    const [searchRowFilter, setSearchRowFilter] = useState<Record<string, unknown>>({});
    const { data: roleDetailsData } = useFetchRoleDetailsData();
    const [visible, setVisible] = useState(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [selectedRow, setSelectedRow] = useState<any>(null);
    const [multiSortMeta, setMultiSortMeta] = useState([]);
    const [currentPageReportTemplate, setCurrentPageReportTemplate] = useState<string>('');
    const [data, setData] = useState<TItem[]>([]);
    const sortFieldRef = useRef('ID ASC');
    const hasInitialized = useRef(false);
    const [calendarCreateDateFrom, setCalendarCreateDateFrom] = useState<Date | undefined | null>(null);
    const [calendarCreateDateTo, setCalendarCreateDateTo] = useState<Date | undefined | null>(null);
    const [selectedItem, setSelectedItem] = useState<TItem | null>(null);
    const [sidebarVisible, setSidebarVisible] = useState(false);

    useEffect(() => {
        setCurrentPageReportTemplate(t('globals.report'));
    }, [t])

    useEffect(() => {
        if (
            !hasInitialized.current &&
            query.roleCondition &&
            Object.keys(query.roleCondition).length > 0
        ) {
            hasInitialized.current = true;

            const finalCondition = {
                ...query.condition,
                ...query.search,
                ...query.roleCondition,
            };

            gridData(finalCondition);
        }
    }, [query.roleCondition, query.condition, query.search]);

    useEffect(() => {
        const fetchRoleDetails = async () => {
            if (roleDetailsData && roleDetailsData.length > 0) {

                const itemData = (roleDetailsData as RoleDetail[]).find(
                    (r: RoleDetail) => typeof r.name === "string" && r.name.toLowerCase() === (props.typeName ?? "").toLowerCase()
                );
                setRoleData(itemData ?? null);

                if (itemData?.dbStatus) {
                    const parsedDbStatus = typeof itemData.dbStatus === "string" ? JSON.parse(itemData.dbStatus) : itemData.dbStatus;
                    query?.setRoleCondition(parsedDbStatus);
                } else {
                    query?.setRoleCondition({});
                }
            }
        };

        if (roleDetailsData && roleDetailsData.length > 0) {
            fetchRoleDetails();
        }
    }, [roleDetailsData, props.typeName]);


    useEffect(() => {
        if (query.search) {
            if (query.search?.createDateSearchFrom) {
                setCalendarCreateDateFrom(new Date(query.search.createDateSearchFrom));
            }
            if (query.search?.createDateSearchTo) {
                setCalendarCreateDateTo(new Date(query.search.createDateSearchTo));
            }
        }

        if (query.tableSearch) {
            if (query.tableSearch.filter) {
                setGlobalFilterValue(query.tableSearch.filter);
            }
        }
    }, [query.search, query.tableSearch, setGlobalFilterValue]);

    useEffect(() => {
        if (query.tableSearch.searchRowFilter) {
            const updatedFilters = Object.entries(query.tableSearch.searchRowFilter).reduce((acc, [field, value]) => {
                acc[field] = {
                    value: value,
                    matchMode: Array.isArray(value) ? FilterMatchMode.IN : FilterMatchMode.CONTAINS
                };
                return acc;
            }, {} as DataTableFilterMeta);

            setFilters((prevFilters) => ({
                ...prevFilters,
                global: { value: globalFilterValue, matchMode: FilterMatchMode.CONTAINS },
                ...updatedFilters
            }));
        }

        setSortField(query.tableSearch?.sortField);
        setSortOrder(query.tableSearch?.sortOrder);
        setFirst(query.tableSearch?.first);
        setRows(query.tableSearch?.rows);
        setTotalRecords(query.data?.length ?? 0);

    }, [query.tableSearch, query.data, globalFilterValue]);

    useEffect(() => {
        if (query?.search) {
            setSearchRowFilter(query.search?.searchRowFilter);
        }
    }, [searchRowFilter, query.search?.searchRowFilter, query.search]);

    useEffect(() => {
        const applyScrollPosition = () => {
            const scrollTop = localStorage.getItem('dtScrollTop');
            const scrollLeft = localStorage.getItem('dtScrollLeft');

            const dtElement = dtRef.current?.getElement();
            if (dtElement) {
                const bodyEl = dtElement.querySelector('.p-datatable-wrapper');
                if (bodyEl) {
                    if (scrollTop) bodyEl.scrollTop = parseInt(scrollTop);
                    if (scrollLeft) bodyEl.scrollLeft = parseInt(scrollLeft);
                } else {
                    console.log("DataTable body element not found");
                }
            }
        };

        setTimeout(applyScrollPosition, 500);

        const handleScroll = (e: Event) => {
            const target = e.target as HTMLElement;
            localStorage.setItem('dtScrollTop', target.scrollTop.toString());
            localStorage.setItem('dtScrollLeft', target.scrollLeft.toString());
        };

        const dtElement = dtRef.current?.getElement();
        const bodyEl = dtElement?.querySelector('.p-datatable-wrapper');

        bodyEl?.addEventListener('scroll', handleScroll);

        return () => {
            bodyEl?.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const applyScrollPosition = () => {
            const scrollTop = localStorage.getItem('dtScrollTop');
            const scrollLeft = localStorage.getItem('dtScrollLeft');

            const dtElement = dtRef.current?.getElement();
            if (dtElement) {
                const bodyEl = dtElement.querySelector('.p-datatable-wrapper');
                if (bodyEl) {
                    if (scrollTop) bodyEl.scrollTop = parseInt(scrollTop);
                    if (scrollLeft) bodyEl.scrollLeft = parseInt(scrollLeft);
                }
            }
        };
        setTimeout(applyScrollPosition, 100);
    }, []);

    const hasAccess = (roleData: RoleDetail | null, requiredAction: string) => {
        if (!roleData) return false;
        const actions = typeof roleData.action === "string" ? JSON.parse(roleData.action) : [];
        return actions.some((action: Action) => action.name.toLowerCase() === requiredAction.toLowerCase());
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
        query.tableSearch.filter = value;
        setFilters((prevFilters) => ({
            ...prevFilters,
            global: { value, matchMode: FilterMatchMode.CONTAINS },
        }));
        onLazyLoad({ filters: { global: { value, matchMode: FilterMatchMode.CONTAINS } } });
    };

    const refreshItemData = async () => {
        setFirst(0);
        setRows(10);
        setTotalCount(0);
        setCurrentPage(1);
        setTotalRecords(0);
        setSortField('ID ASC');
        setSortOrder(1);
        await gridData();
    };

    const onLazyLoad = useCallback((event: any) => {

        if (event.first !== undefined) setFirst(event.first);
        if (event.rows !== undefined) setRows(event.rows);
        if (event.filters !== undefined) setFilters(event.filters);
        if (event.multiSortMeta !== undefined) setMultiSortMeta(event.multiSortMeta);

        const newCondition: Record<string, any> = { ...query.roleCondition };

        if (event.filters) {
            Object.keys(event.filters).forEach((key) => {
                const filterValue = event.filters[key];
                if (filterValue && filterValue.value !== null && filterValue.value !== undefined && filterValue.value !== '') {
                    const keyName = key.charAt(0).toUpperCase() + key.slice(1) + "SearchContains";
                    newCondition[keyName] = filterValue.value;
                }
            });
        }

        let sortFieldToUse = sortFieldRef.current;

        if (event.multiSortMeta && event.multiSortMeta.length > 0) {
            event.multiSortMeta.forEach((meta: { field: any; order: any; }) => {
                const sortType = meta.order === 1
                    ? meta.field + ' ASC'
                    : meta.order === -1
                        ? meta.field + ' DESC'
                        : 'ID DESC';
                sortFieldToUse = sortType;
            });
        } else if (event.sortField) {
            const sortType = event.sortOrder === 1
                ? event.sortField + ' ASC'
                : event.sortOrder === -1
                    ? event.sortField + ' DESC'
                    : 'ID DESC';
            sortFieldToUse = sortType;
        }

        sortFieldRef.current = sortFieldToUse;
        setSortField(sortFieldToUse);
        setSortOrder(event.sortOrder);

        loadData({
            ...event,
            condition: newCondition,
            sortField: sortFieldToUse,
        });

    }, [query.roleCondition]);


    const loadData = async (params: any) => {
        setLoading(true);

        const currentPage = Math.floor((params.first || 0) / (params.rows || 10)) + 1;
        const finalCondition = {
            ...params.condition,
            ...query.search,
            ...query.roleCondition,
        };
        const payload = {
            condition: finalCondition,
            orderColumns: [params.sortField || 'ID ASC'],
            pageNo: currentPage,
            pageSize: params.rows || 10,
        };

        if (!props.pageGridService) {
            setLoading(false);
            return;
        }

        try {
            const response = await props.pageGridService.getPageData(payload);

            if (response) {
                const items = response.items || response.data?.items || [];
                setData(items);
                setTotalRecords(response.totalCount || 0);
                const updatedReportTemplate = t('globals.report', { totalRecords: response.totalCount || 0 });
                setCurrentPageReportTemplate(updatedReportTemplate);
            } else {
                setData([]);
                setTotalRecords(0);
                setCurrentPageReportTemplate(t('globals.report', { totalRecords: 0 }));
            }
        } catch (error) {
            console.error("Error loading data:", error);
            setData([]);
            setTotalRecords(0);
            setCurrentPageReportTemplate(t('globals.report', { totalRecords: 0 }));
        } finally {
            setLoading(false);
        }
    };

    const gridData = async (conditionOverride?: Record<string, unknown>) => {
        try {
            const finalCondition = conditionOverride ?? {
                ...query.condition,
                ...query.search,
                ...query.roleCondition,
            };

            const payload = {
                condition: finalCondition,
                orderColumns: [sortField || 'Id DESC'],
                pageNo: currentPage,
                pageSize: rows,
                totalCount: totalCount,
            };

            const response = await props.pageGridService?.getPageData(payload);

            if (response) {
                const items = response.items || response.data?.items || [];
                setData(items);
                setTotalRecords(response.totalCount || 0);
                const updatedReportTemplate = t('globals.report', { totalRecords: response.totalCount || 0 });
                setCurrentPageReportTemplate(updatedReportTemplate);
            } else {
                setData([]);
                setTotalRecords(0);
                setCurrentPageReportTemplate(t('globals.report', { totalRecords: 0 }));
            }
        } catch (error) {
            console.error("Error loading data:", error);
            setData([]);
            setTotalRecords(0);
            setCurrentPageReportTemplate(t('globals.report', { totalRecords: 0 }));
        } finally {
            setLoading(false);
        }
    }

    const setListSearch = async () => {
        const newSearch = { ...search };
        await query.setSearch(newSearch);

        const finalCondition = {
            ...query.condition,
            ...newSearch,
            ...query.roleCondition,
        };
        await searchData();
        await gridData(finalCondition);
    };

    const searchData = async () => {
        setSearchRowFilter({});
    }

    const clearListSearch = async (type: 'search' | 'table' | 'both') => {
        query.clearSearch(type);
        setSearch({});
        setSearchRowFilter({});

        const finalCondition = {
            ...query.condition,
            ...query.roleCondition
        };

        await gridData(finalCondition);
    };

    const searchChange = (value: string | Date | null | undefined, name: string) => {
        // query.setSearch({ [name]: value });
        setSearch((prevSearch) => ({
            ...prevSearch,
            [name]: value
        }));
    };

    const setTableSearchInfo = useCallback(() => {
        const body = dtRef.current?.getElement()?.querySelector('.p-datatable-wrapper');
        const info = {
            filter: query.tableSearch.filter,
            sortField: query.tableSearch.sortField,
            sortOrder: query.tableSearch.sortOrder,
            first: query.tableSearch.first,
            rows: query.tableSearch.rows,
            top: (body?.scrollTop || 0).toString(),
            left: (body?.scrollLeft || 0).toString(),
            searchRowFilter: query.tableSearch.searchRowFilter,
        };
        query.setTableSearch(info);
    }, [query, dtRef]);

    const openItem = useCallback((item: any, action: string) => {
        setTableSearchInfo();
        switch (action) {
            case 'edit':
                navigate(`/${props.baseModelName}/edit/${item.id}`);
                break;
            case 'add':
                navigate(`/${props.baseModelName}/add/${0}`);
                break;
            case 'view':
                navigate(`/${props.baseModelName}/${item.id}`);
                break;
        }
    }, [props.baseModelName, navigate, setTableSearchInfo]);

    const exportToExcel = async (service: ReturnType<typeof useBaseService>, searchVal: string, title: string) => {
        try {
            const blob = await service.exportExcel(searchVal);
            if (blob) {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = url;
                link.download = `${title}.xlsx`;
                link.click();
                window.URL.revokeObjectURL(url);
            } else {
                console.error("Failed to export to Excel: Blob is undefined.");
            }
        } catch (error) {
            console.error("Error exporting to Excel:", error);
        }
    };

    const importFromExcel = (navigateFn: (path: string) => void, basePath: string) => {
        navigateFn(`/${basePath}/import`);
    };

    const addData = (navigateFn: (path: string) => void, basePath: string) => {
        navigateFn(`/${basePath}/add`);
    };

    const handleDelete = (deleteFunction: (id: number) => void, id: number | undefined) => {
        if (id !== undefined) {
            deleteFunction(id);
        } else {
            console.error("Invalid ID for delete action.");
        }
    };

    const confirmDeleteItem = async () => {
        if (itemToDelete) {
            try {
                await query.deleteItem(itemToDelete);
                await query.load();
            } catch {
                alert("Failed to delete app Users. Please try again later.");
            } finally {
                setIsDeleteDialogVisible(false);
                setItemToDelete(null);
                setIsSuccessDialogOpen(true);
                setTimeout(() => {
                    setIsSuccessDialogOpen(false);
                }, 2000);
            }
        }
    };

    const deleteItem = (userId: number) => {
        setIsDeleteDialogVisible(true);
        setItemToDelete(userId);
    };

    const closeDeleteDialog = () => {
        setIsDeleteDialogVisible(false);
        setItemToDelete(null);
    };

    const formatDate = (dateString: string | Date | undefined) => {
        if (!dateString) return "";
        const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
        return format(date, "MM-dd-yyyy");
    };

    const parseAndFormatImages = (imageData: string | null) => {
        if (!imageData) return [];
        try {
            const parsedFiles = JSON.parse(imageData);
            if (!Array.isArray(parsedFiles)) {
                return [];
            }
            return parsedFiles.map((img: CustomFile) => ({
                fileName: img.fileName,
                filePath: img.filePath.replace(/\\/g, '/'),
                type: img.type,
            }));
        } catch (error) {
            console.error('Failed to parse image data:', error);
            return [];
        }
    };

    const handleSelectItem = (item: TItem) => {
        setSelectedItem(item);
        setSidebarVisible(true);
    };

    const stripHtml = (html: string) => {
        if (!html) return "";
        return html.replace(/<[^>]+>/g, "");
    };

    return {
        roleData, globalFilterValue, setGlobalFilterValue, onGlobalFilterChange, setFilters,
        first, rows, sortField, sortOrder, totalRecords, setTotalRecords, filters, refreshItemData,
        setListSearch, clearListSearch, searchChange, isDeleteDialogVisible, setIsDeleteDialogVisible,
        confirmDeleteItem, deleteItem, openItem, closeDeleteDialog, setItemToDelete, toast, isSuccessDialogOpen,
        setIsSuccessDialogOpen, formatDate, hasAccess, exportToExcel, importFromExcel, addData, handleDelete, useColumnConfig,
        visible, setVisible, currentPage, setCurrentPage, totalCount, setTotalCount,
        loading, setLoading, setFirst, onLazyLoad, selectedRow, setSelectedRow,
        multiSortMeta, setMultiSortMeta, currentPageReportTemplate, data, setData, calendarCreateDateFrom, setCalendarCreateDateFrom,
        calendarCreateDateTo, setCalendarCreateDateTo, parseAndFormatImages, stripHtml,
        selectedItem, setSelectedItem, sidebarVisible, setSidebarVisible, handleSelectItem
    };
}
