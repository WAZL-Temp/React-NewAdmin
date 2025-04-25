import { useCallback, useEffect, useState } from "react";
import { format, parseISO, useNavigate } from "../sharedBase/globalImports";
import { UseItemQueryResult } from "../store/createItemStore";
import { useFetchRoleDetailsData } from "../sharedBase/lookupService";
import { RolePermission } from "../types/roles";
import { UseListQueryResult } from "../store/createListStore";

type UseEditPageProps<TQuery, TItem> = {
    query: TQuery;
    props: {
        id?: string;
        baseModelName?: string;
        listQuery?: UseListQueryResult<TItem>
    };
};

export function useEditPage<TQuery extends UseItemQueryResult<TItem>, TItem>({ query, props }: UseEditPageProps<TQuery, TItem>) {
    const [showDialog, setShowDialog] = useState(false);
    const navigate = useNavigate();
    const [hiddenFields, setHiddenFields] = useState<string[]>([]);
    const { data: roleDetailsData } = useFetchRoleDetailsData();

    useEffect(() => {
        const fetchRoleDetails = async () => {
            if (!props.baseModelName) return;

            if (roleDetailsData && roleDetailsData.length > 0) {

                const modelData = roleDetailsData.find(
                    (r: RolePermission) => r.name.toLowerCase() === props.baseModelName!.toLowerCase()
                );

                if (modelData?.hideColumn) {
                    try {
                        const parsedColumns = JSON.parse(modelData.hideColumn);
                        if (Array.isArray(parsedColumns)) {
                            const hiddenFieldNames = parsedColumns.map((column: any) => column.value);
                            setHiddenFields(hiddenFieldNames);
                        }
                    } catch (error) {
                        console.error("Error parsing hideColumn:", error);
                    }
                }
            }
        };

        fetchRoleDetails();
    }, []);

    const handleBackToUser = () => {
        if (props.baseModelName) {
            navigate(`/${props.baseModelName}`);
        }
    };

    const handleCloseDialog = () => {
        setTimeout(() => {
            setShowDialog(false);
        }, 1000);
        handleBackToUser();
    };

    const isFieldHidden = useCallback(
        (fieldName: string) => {
            return hiddenFields.includes(fieldName);
        },
        [hiddenFields]
    );

    const formatDate = (dateString: string | Date | undefined) => {
        if (!dateString) return "";
        const date = typeof dateString === 'string' ? parseISO(dateString) : dateString;
        return format(date, "MM-dd-yyyy");
    };

    const removeEmptyFields = (obj: any) => {
        return Object.keys(obj).reduce((acc, key) => {
            if (obj[key] !== "" && obj[key] !== undefined && obj[key] !== null) {
                acc[key] = obj[key];
            }
            return acc;
        }, {} as Record<string, any>);
    };

    return {
        showDialog,
        setShowDialog,
        handleCloseDialog,
        isFieldHidden,
        formatDate,
        removeEmptyFields,
        prepareObject
    }
}


export function prepareObject<T>(source: Partial<T>, defaults: T): T {
    const result: T = { ...defaults };

    for (const key in defaults) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
            const value = source[key as keyof T];

            if (value instanceof Date) {
                result[key as keyof T] = (value as Date).toISOString() as any;
            } else if (value !== undefined && value !== null) {
                result[key as keyof T] = value;
            } else {
                result[key as keyof T] = defaults[key as keyof T];
            }
        }
    }

    return result;
}