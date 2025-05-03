import { useEffect, useState } from "react";
import { useNavigate } from "../sharedBase/globalUtils";
import { useFetchRoleDetailsData } from "../sharedBase/lookupService";
import { RoleDetail } from "../core/model/roledetail";

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
                    (r: RoleDetail) => r.name === props.baseModelName!.toLowerCase()
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

    const isFieldHidden = (fieldName: string) => {
        return hiddenFields.includes(fieldName)
    }

    const handleEdit = (userid: string | number) => {
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