import { useState, useRef, useMemo, useEffect, useCallback } from "react";
import { DataTable, DataTableFilterMeta, DataTablePageEvent, DataTableSortEvent, FilterMatchMode, Toast } from "../sharedBase/globalImports";
import { format, parseISO, useNavigate, useTranslation } from '../sharedBase/globalUtils';
import { useBaseService } from "../sharedBase/baseService";
import { ListStore } from "../store/createListStore";
import { AppUser } from "../core/model/appuser";
import { LookupServiceBase } from "../sharedBase/lookupService";

type UseTestListPageCommonProps<TItem> = {
    initialFilterValue?: string;
    baseModelName?: string;
    service: typeof useBaseService;
    onFilterChange?: (value: string) => void;
    onConfirmDelete?: (id: number) => void;
    onDeleteItem?: (id: number) => void;
    onCloseDeleteDialog?: () => void;
    onShowSuccessMessage?: (message: string) => void;
};

type UseTestListPageProps<TStore, TItem> = {
    store: TStore;
    props: UseTestListPageCommonProps<TItem>;
};

export const useColumnConfig = (columnsConfigDefault: any[], roleData: any) => {
    const hiddenColumns = useMemo(() => {
        return (Array.isArray(roleData) ? roleData : [roleData])
            .filter((role) => role && role.hideColumn)
            .reduce((acc: string[], role: any) => {
                try {
                    if (!roleData) return [];

                    const parsedColumns = JSON.parse(role.hideColumn);
                    if (Array.isArray(parsedColumns)) {
                        acc.push(...parsedColumns.map((col: any) => col.value));
                    } else if (typeof parsedColumns === "object" && parsedColumns.value) {
                        acc.push(parsedColumns.value);
                    }
                } catch (error) {
                    console.error("Error parsing hideColumn:", error);
                }
                return acc;
            }, [roleData]);
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

export function useTestListPage<TStore extends ListStore<TItem>, TItem>({ store, props }: UseTestListPageProps<TStore, TItem>) {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [globalFilterValue, setGlobalFilterValue] = useState(props.initialFilterValue);
    const [isDeleteDialogVisible, setIsDeleteDialogVisible] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<number | null>(null);
    const toast = useRef<Toast>(null);
    const [isSuccessDialogOpen, setIsSuccessDialogOpen] = useState(false);
    const dtRef = useRef<DataTable<any>>(null);
    const [sortField, setSortField] = useState<any>('ID ASC');
    const [sortOrder, setSortOrder] = useState<any>(1);
    const [currentPage, setCurrentPage] = useState<any>(1);
    const [first, setFirst] = useState<any>();
    const [rows, setRows] = useState<any>(10);
    const [totalRecords, setTotalRecords] = useState(0);
    const [filters, setFilters] = useState<DataTableFilterMeta>({ global: { value: null, matchMode: FilterMatchMode.CONTAINS }, });
    const [itemData, setItemData] = useState<AppUser[]>([]);
    const [currentPageReportTemplate, setCurrentPageReportTemplate] = useState<string>('');
    const [roleData, setRoleData] = useState<any>(null);
    const [search, setSearch] = useState({});
    const [searchRowFilter, setSearchRowFilter] = useState({});

    useEffect(() => {
        const fetchRoleDetails = async () => {
            const lookupService = new LookupServiceBase();
            const roleDetails = await lookupService.fetchRoleDetailsData();
            if (Array.isArray(roleDetails)) {
                const appuserData = roleDetails.find((r: any) => r.name.toLowerCase() === (props.baseModelName?.toLowerCase() ?? ""));
                setRoleData(appuserData);

                if (appuserData.dbStatus) {
                    store.setRoleCondition(JSON.parse(appuserData.dbStatus));
                }
                await store.loadList();
            }
        };
        fetchRoleDetails();
    }, [props.baseModelName]);

    // useEffect(() => {
    //     const loadInitialData = async () => {
    //         const validOrderBy = sortField && sortField.trim() !== "" ? sortField : "ID ASC";
    //         const response = await store.fetchGridData(currentPage, rows, validOrderBy, "AppUser");
    //         if (response) {
    //             setItemData(response?.listData || []);
    //             setTotalRecords(response?.countData?.[0]?.totalRecord);
    //         }
    //     };

    //     loadInitialData();
    //     setCurrentPageReportTemplate(t('globals.report'));
    // }, [currentPage, rows, sortField]);

    useEffect(() => {
        const applyScrollPosition = () => {
            const scrollTop = localStorage.getItem('dtScrollTop');
            const scrollLeft = localStorage.getItem('dtScrollLeft');

            if (dtRef.current) {
                const bodyEl = dtRef.current.getElement().querySelector('.p-datatable-wrapper');
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

        const bodyEl = dtRef.current?.getElement().querySelector('.p-datatable-wrapper');
        bodyEl?.addEventListener('scroll', handleScroll);

        return () => {
            bodyEl?.removeEventListener('scroll', handleScroll);
        };
    }, []);

    useEffect(() => {
        const applyScrollPosition = () => {
            const scrollTop = localStorage.getItem('dtScrollTop');
            const scrollLeft = localStorage.getItem('dtScrollLeft');

            if (dtRef.current) {
                const bodyEl = dtRef.current.getElement().querySelector('.p-datatable-wrapper');
                if (bodyEl) {
                    if (scrollTop) bodyEl.scrollTop = parseInt(scrollTop);
                    if (scrollLeft) bodyEl.scrollLeft = parseInt(scrollLeft);
                }
            }
        };
        setTimeout(applyScrollPosition, 100);
    }, []);

    useEffect(() => {
        if (store.tableSearch?.searchRowFilter) {
            const updatedFilters = Object.entries(store.tableSearch.searchRowFilter).reduce((acc, [field, value]) => {
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

        setSortField(store.tableSearch?.sortField);
        setSortOrder(store.tableSearch?.sortOrder);
        setFirst(store.tableSearch?.first);
        setRows(store.tableSearch?.rows);
        setTotalRecords(store.data?.length);

    }, [store.tableSearch, store.data, globalFilterValue]);

    const hasAccess = (roleData: any, requiredAction: string) => {
        if (!roleData) return false;
        const actions = typeof roleData.action === "string" ? JSON.parse(roleData.action) : [];
        return actions.some((action: any) => action.name.toLowerCase() === requiredAction.toLowerCase());
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setGlobalFilterValue(value);
        store.tableSearch.filter = value;
    }

    const refreshItemData = async () => {
        store.resetStatus();
        await store.loadList();
    };

    const onPage = (event: DataTablePageEvent) => {
        setFirst(event.first);
        setRows(event.rows);

        store.tableSearch.first = event.first;
        store.tableSearch.rows = event.rows;
        store.loadList();
    };

    const onSort = (e: DataTableSortEvent) => {
        setSortField(e.sortField);
        setSortOrder(e.sortOrder);

        store.tableSearch.sortField = e.sortField;
        store.tableSearch.sortOrder = e.sortOrder?.toString() || "";
    };

    const setListSearch = () => {
        store.setSearch(search);
        searchData();
    }

    const searchData = async () => {
        // store.clearSearch('table');
        // store.setTableSearch((prev: any) => ({
        //     ...prev,
        //     searchRowFilter: {},
        // }));
        await store.reloadList();
    }

    const clearListSearch = (type: 'search' | 'table' | 'both') => {
        store.clearSearch(type);
        if (type === 'table') {
            // store.setTableSearch((prev: any) => ({
            //     ...prev,
            //     searchRowFilter: {},
            // }));
            setSearchRowFilter({});
        }

        if (type === 'search') {
            // store.setSearch({});
            setSearch({});
            searchData();
        }
    }

    const searchChange = (value: any, name: string, type: string) => {
        let val = value;
        if (type === 'date') {
            val = formatDate(value);
        }
        store.setSearch({ [name]: value });
    };

    const setTableSearchInfo = () => {
        const body = dtRef.current?.getElement().querySelector('.p-datatable-wrapper');
        const info = {
            filter: store.tableSearch.filter,
            sortField: store.tableSearch.sortField,
            sortOrder: store.tableSearch.sortOrder,
            first: store.tableSearch.first,
            rows: store.tableSearch.rows,
            top: body?.scrollTop || 0,
            left: body?.scrollLeft || 0,
            searchRowFilter: store.tableSearch.searchRowFilter,
        };
        store.setTableSearch(info);
    };

    const openItem = useCallback((item: any, action: string) => {
        setTableSearchInfo();
        switch (action) {
            case 'edit':
                navigate(`/${props.baseModelName}/edit/${item.id}`)
                break;
            case 'add':
                navigate(`/${props.baseModelName}/add/${0}`)
                break;
            case 'view':
                navigate(`/${props.baseModelName}/${item.id}`)
                break;
        }
    }, [props.baseModelName, navigate, setTableSearchInfo]);

    const exportToExcel = async (service: any, searchVal: string, title: string) => {
        try {
            const blob = await service.exportExcel(searchVal);
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${title}.xlsx`;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Error exporting to Excel:", error);
        }
    };

    const importFromExcel = (navigate: Function, basePath: string) => {
        navigate(`/${basePath}/import`);
    };

    const addData = (navigate: Function, basePath: string) => {
        navigate(`/${basePath}/add`);
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
                await props.service.delete(itemToDelete);
                store.resetStatus();
                await store.loadList();
            } catch (error) {
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
        console.log("Default close delete dialog");
    };

    const formatDate = (dateString: string | Date | undefined) => {
        if (!dateString) return "";
        const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
        return format(date, "MM-dd-yyyy");
    };

    const onPageChange = async (event: DataTablePageEvent) => {
        try {
            const currentpage = Math.floor(event.first / event.rows) + 1;
            const response = await store.fetchGridData(currentpage, event.rows, "ID ASC", "AppUser");

            setItemData(response?.listData || []);
            setFirst(event.first);
            setRows(event.rows);
            setCurrentPage(currentpage);

            const total = response?.countData?.[0]?.totalRecord ?? 0;
            setTotalRecords(total);

            const updatedReportTemplate = t('globals.report').replace('{totalRecords}', total);
            setCurrentPageReportTemplate(updatedReportTemplate);

            store.tableSearch.first = event.first;
            store.tableSearch.rows = event.rows;
            // setTableSearch(tableSearch);
            // loadList();
        } catch (error) {
            console.error("Error fetching grid data:", error);
        }
    };

    return {
        roleData, itemData, onPageChange, currentPage, setItemData, setCurrentPageReportTemplate, currentPageReportTemplate,
        globalFilterValue, setGlobalFilterValue, onGlobalFilterChange, setFilters,
        first, rows, sortField, sortOrder, totalRecords, filters, onPage, onSort, refreshItemData,
        setListSearch, clearListSearch, searchChange, isDeleteDialogVisible, setIsDeleteDialogVisible,
        confirmDeleteItem, deleteItem, openItem, closeDeleteDialog, setItemToDelete, toast, isSuccessDialogOpen,
        setIsSuccessDialogOpen, formatDate, hasAccess, exportToExcel, importFromExcel, addData, handleDelete,
        useColumnConfig, setTotalRecords
    };
}