import { useEffect, useState } from "react";
import { useNavigate } from "../sharedBase/globalUtils";
import { useFetchRoleDetailsData } from "../sharedBase/lookupService";

type UseEditPageProps = {
    props: {
        id?: string;
        baseModelName?: string;
    };
};

export function useViewPage({ props }: UseEditPageProps) {
    const navigate = useNavigate();
    const [hiddenFields, setHiddenFields] = useState<string[]>([]);
    const { data: roleDetailsData } = useFetchRoleDetailsData();

    useEffect(() => {
        const fetchRoleDetails = async () => {
            if (!props.baseModelName) return;

            if (roleDetailsData && roleDetailsData.length > 0) {
               const modelData = roleDetailsData.find(
                    (r) => r.name && r.name.toLowerCase() === props.baseModelName!.toLowerCase()
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
    }, [props.baseModelName, roleDetailsData]);

    const isFieldHidden = (fieldName: string) => {
        return hiddenFields.includes(fieldName)
    }

    const handleEdit = (userid: string | number) => {
        navigate(`/${props.baseModelName}/edit/${userid}`);
    };

    const handleBack = () => {
        navigate(`/${props.baseModelName}`);
    };

    return {
        isFieldHidden,
        handleEdit,
        handleBack
    }
}