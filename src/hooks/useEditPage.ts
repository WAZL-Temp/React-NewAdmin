import { useCallback, useEffect, useState } from "react";
import { format, parseISO, useNavigate } from "../sharedBase/globalUtils";
import { useFetchRoleDetailsData } from "../sharedBase/lookupService";
import { UseListQueryResult } from "../store/useListQuery";

type UseEditPageProps<TItem> = {
    props: {
        id?: string;
        baseModelName?: string;
        typeName?: string;
        listQuery?: UseListQueryResult<TItem>
    };
};

export function useEditPage<TItem>({ props }: UseEditPageProps<TItem>) {
    const [showDialog, setShowDialog] = useState(false);
    const navigate = useNavigate();
    const [hiddenFields, setHiddenFields] = useState<string[]>([]);
    const { data: roleDetailsData } = useFetchRoleDetailsData();

    useEffect(() => {
        const fetchRoleDetails = async () => {
            if (!props.typeName) return;

            if (roleDetailsData && roleDetailsData.length > 0) {
                const modelData = roleDetailsData.find(
                    (r) => r.name && r.name.toLowerCase() === props.typeName!.toLowerCase()
                );

                if (modelData?.hideColumn) {
                    let parsedColumns: { value: string }[] = [];

                    try {
                        parsedColumns = JSON.parse(modelData.hideColumn);
                    } catch {
                        console.error("Invalid JSON in hideColumn", modelData.hideColumn);
                    }

                    if (Array.isArray(parsedColumns)) {
                        const hiddenFieldNames = parsedColumns.map((column) => column.value);
                        setHiddenFields(hiddenFieldNames);
                    }
                }
            }
        };

        fetchRoleDetails();
    }, [props.typeName, roleDetailsData]);

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

    const removeEmptyFields = (obj: Record<string, unknown>) => {
        return Object.keys(obj).reduce((acc, key) => {
            if (obj[key] !== "" && obj[key] !== undefined && obj[key] !== null) {
                acc[key] = obj[key];
            }
            return acc;
        }, {} as Record<string, unknown>);
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
                result[key as keyof T] = (value as Date).toISOString() as unknown as T[keyof T];
            } else if (value !== undefined && value !== null) {
                result[key as keyof T] = value;
            } else {
                result[key as keyof T] = defaults[key as keyof T];
            }
        }
    }

    return result;
}