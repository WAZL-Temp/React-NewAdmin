import { useEffect, useState } from "react";
import { useNavigate } from "../sharedBase/globalImports";
import { UseItemQueryResult } from "../store/createItemStore";
import { useFetchRoleDetailsData } from "../sharedBase/lookupService";
import { RolePermission } from "../types/roles";

type UseEditPageProps<TQuery, TItem> = {
    query: TQuery;
    props: {
        id?: string;
        baseModelName?: string;
    };
};

export function useViewPage<TQuery extends UseItemQueryResult<TItem>, TItem>({ query, props }: UseEditPageProps<TQuery, TItem>) {
    const navigate = useNavigate();
    const [hiddenFields, setHiddenFields] = useState<string[]>([])
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