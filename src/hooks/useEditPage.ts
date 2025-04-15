import { useCallback, useEffect, useState } from "react";
import { ItemStore } from "../store/createItemStore";
import { format, parseISO, useNavigate } from "../sharedBase/globalImports";
import { LookupServiceBase } from "../sharedBase/lookupService";
import { ListStore } from "../store/createListStore";

type UseEditPageProps<TStore, TItem> = {
    store: TStore;
    props: {
        id?: string;
        baseModelName?: string;
        listStore?: ListStore<TItem>
    };
};

export function useEditPage<TStore extends ItemStore<TItem>, TItem>({ store, props }: UseEditPageProps<TStore, TItem>) {
    const [showDialog, setShowDialog] = useState(false);
    const navigate = useNavigate();
    const [hiddenFields, setHiddenFields] = useState<string[]>([]);

    useEffect(() => {
        const fetchRoleDetails = async () => {
            if (!props.baseModelName) return;

            const lookupService = new LookupServiceBase();
            const roleDetails = await lookupService.fetchRoleDetailsData();

            if (Array.isArray(roleDetails)) {
                const modelData = roleDetails.find(
                    (r: any) => r.name.toLowerCase() === props.baseModelName!.toLowerCase()
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
    }, [props.baseModelName]);

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
        removeEmptyFields
    }
}