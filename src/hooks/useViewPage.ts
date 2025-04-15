import { useEffect, useState } from "react";
import { ItemStore } from "../store/createItemStore";
import { useNavigate } from "../sharedBase/globalImports";
import { LookupServiceBase } from "../sharedBase/lookupService";

type UseEditPageProps<TStore, TItem> = {
    store: TStore;
    props: {
        id?: string;
        baseModelName?: string;
    };
};

export function useViewPage<TStore extends ItemStore<TItem>, TItem>({ store, props }: UseEditPageProps<TStore, TItem>) {
    const navigate = useNavigate();
    const [hiddenFields, setHiddenFields] = useState<string[]>([])

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

    const isFieldHidden = (fieldName: string) => {
        return hiddenFields.includes(fieldName)
    }

    const handleEdit = (userid: any) => {
        navigate(`/${props.baseModelName}/edit/${userid}`);
    };

    const handleBackToUser = () => {
        navigate(`/${props.baseModelName}`);
    };

    return {
        isFieldHidden,
        handleEdit,
        handleBackToUser
    }
}