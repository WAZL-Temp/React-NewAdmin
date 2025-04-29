import { useCallback, useEffect, useState } from "react";
import { format, parseISO, useNavigate } from "../sharedBase/globalUtils";
import { useFetchRoleDetailsData } from "../sharedBase/lookupService";
import { UseListQueryResult } from "../store/useListQuery";
import { RoleDetail } from "../core/model/roledetail";

type UseEditPageProps<TItem> = {
    props: {
        id?: string;
        baseModelName?: string;
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
            if (!props.baseModelName) return;

            if (roleDetailsData && roleDetailsData.length > 0) {

                const modelData = roleDetailsData.find(
                    (r: RoleDetail) => r.name  === props.baseModelName!.toLowerCase()
                );

                if (modelData?.hideColumn) {
                    try {
                        const parsedColumns = JSON.parse(modelData.hideColumn);
                        if (Array.isArray(parsedColumns)) {
                            const hiddenFieldNames = parsedColumns.map((column: { value: string }) => column.value);
                            setHiddenFields(hiddenFieldNames);
                        }
                    } catch (error) {
                        console.error("Error parsing hideColumn:", error);
                    }
                }
            }
        };

        fetchRoleDetails();
    }, [props.baseModelName, roleDetailsData]);

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

    const removeEmptyFields = (obj:  Record<string, unknown>) => {
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