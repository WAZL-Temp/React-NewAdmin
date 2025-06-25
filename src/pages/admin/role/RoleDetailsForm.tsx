import React, { useEffect, useState } from 'react';
import TooltipWithText from '../../../components/TooltipWithText';
import { Role } from '../../../core/model/role';
import { RoleData } from '../../../core/model/roledata';
import { RoleDetail } from '../../../core/model/roledetail';
import successImg from '../../../assets/images/success.gif';
import { BsArrowLeft, Button, Column, DataTable, Dialog, Dropdown, FaSave, Image, InputText, MultiSelect, MultiSelectChangeEvent } from '../../../sharedBase/globalImports';
import { useNavigate, useTranslation } from '../../../sharedBase/globalUtils';
import { selectMultiData } from '../../../sharedBase/dropdownUtils';
import { useFetchRoleDetailsData } from '../../../sharedBase/lookupService';
import { roleAddService, RoleService } from '../../../core/service/roles.service';
import { useListQuery } from '../../../store/useListQuery';
import { RoleDataService } from '../../../core/service/roleDatas.service';
import { AppUser } from '../../../core/model/appuser';
import { RoleDetailService } from '../../../core/service/roleDetails.service';

interface SourceOption {
    value: string | number;
    name: string;
    label?: string;
}

interface Option {
    id: string | number;
    name: string;
}

interface RoleDataItem {
    id: string;
    statuses: SourceOption[];
    hideColumns: SourceOption[];
    actions: SourceOption[];
    selectedStatuses?: SourceOption[];
    selectedStatusesLabel?: string;
    selectedHideColumns?: SourceOption[];
    selectedHideColumnsLabel?: string;
    selectedActions?: SourceOption[];
    selectedActionsLabel?: string;
}

const RoleDetailsForm = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [model, setModel] = useState<{ name: string }>({ name: '' });
    const [selectedRole, setSelectedRole] = useState<Role>({});
    const [roleList, setRoleList] = useState<Role[]>([]);
    const [roleDetails, setRoleDetails] = useState<RoleDetail[]>([]);
    const [roleData, setRoleData] = useState<RoleData[]>([]);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [displayData, setDisplayData] = useState<any[]>([]);
    const [errorMsg, setErrorMsg] = useState<string>('');
    const fetchRoleDetailsData = useFetchRoleDetailsData();

    const roleService = RoleService();
    const roleQuery = useListQuery<AppUser>(roleService);

    const roleDetailService = RoleDetailService();
    const roleDetailQuery = useListQuery<RoleDetail>(roleDetailService);

    const roleDataService = RoleDataService();
    const roleDataQuery = useListQuery<RoleData>(roleDataService);

    const safeParseJson = (data: string) => {
        try {
            let validJson = data.replace(/'/g, '"');
            validJson = validJson.replace(
                /([{,]\s*)([a-zA-Z0-9_]+)(\s*:)/g,
                '$1"$2"$3'
            );
            return JSON.parse(validJson);
        } catch (error) {
            console.error('Error parsing JSON:', data, error);
            return [];
        }
    };

    useEffect(() => {
        roleQuery.load();
        roleDetailQuery.load();
        roleDataQuery.load();
    }, []);

    useEffect(() => {
        const bindDropDownList = async () => {
            try {
                setRoleList(Array.isArray(roleQuery?.data) ? roleQuery?.data : []);
                setRoleDetails(Array.isArray(roleDetailQuery?.data) ? roleDetailQuery?.data : []);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        bindDropDownList();
    }, [roleDetailQuery?.data, roleQuery?.data]);

    useEffect(() => {
        if (roleDataQuery?.data) {
            loadData();
        }
    }, [roleDataQuery?.data]);


    const loadData = async () => {
        const parsedData = Array.isArray(roleDataQuery?.data) ? roleDataQuery?.data.map(item => {
            try {
                return {
                    ...item,
                    id: item.id,
                    name: item.name,
                    actions: item.action ? safeParseJson(item.action) : [],
                    hideColumns: item.columnData ? safeParseJson(item.columnData) : [],
                    statuses: item.status ? safeParseJson(item.status) : [],
                };
            } catch (error) {
                console.error("Error parsing item:", item, error);
                return item;
            }
        }) : [];

        setRoleData(parsedData);
        setDisplayData(parsedData.reverse());
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setModel({ ...model, [e.target.name]: e.target.value });
    };

    const safeParse = (data: string) => {
        try {
            return JSON.parse(data.replace(/'/g, '"'));
        } catch (e) {
            console.error("JSON Parse Error:", e);
            return [];
        }
    };

    const handleDropdownChange = (selectedRole: Role) => {
        setSelectedRole(selectedRole);
        const selectedRoleId = selectedRole.id;

        const list = roleDetails.filter((a) => a.roleId == selectedRoleId);

        const parsedList = list.map(detail => ({
            ...detail,
            action1: detail.action ? safeParse(detail.action) : [],
            hideColumn1: detail.hideColumn ? safeParse(detail.hideColumn) : [],
            status1: detail.status ? safeParse(detail.status) : []
        }));


        const orignalData = [...displayData];
        const updatedRoleData = parsedList.map((item) => {
            const matchedData = orignalData.find((d) => d.name === item.name);

            const parsedActions = typeof matchedData?.actions === 'string'
                ? JSON.parse(matchedData.actions.replace(/'/g, '"'))
                : matchedData?.actions || [];

            const parsedHideColumns = typeof matchedData?.hideColumns === 'string'
                ? JSON.parse(matchedData.hideColumns.replace(/'/g, '"'))
                : matchedData?.hideColumns || [];

            const parsedStatuses = typeof matchedData?.statuses === 'string'
                ? JSON.parse(matchedData.statuses.replace(/'/g, '"'))
                : matchedData?.statuses || [];

            return {
                id: item.id,
                name: item.name,

                actions: parsedActions,
                selectedActions: item.action1,

                hideColumns: parsedHideColumns,
                selectedHideColumns: item.hideColumn1,

                statuses: parsedStatuses,
                selectedStatuses: item.status1,
            };
        }).reverse();
        setRoleData(updatedRoleData);
    };

    const handleMultiSelectChange = (
        e: MultiSelectChangeEvent,
        item: RoleDataItem,
        field: string
    ) => {
        const updatedData = roleData.map((dataItem: any) => {
            if (dataItem.id === item.id) {
                let sourceArray: SourceOption[] = [];
                if (field === 'selectedStatuses') {
                    sourceArray = item.statuses || [];
                } else if (field === 'selectedHideColumns') {
                    sourceArray = item.hideColumns || [];
                } else if (field === 'selectedActions') {
                    sourceArray = item.actions || [];
                }

                const updatedSelections = sourceArray.filter((option: SourceOption) =>
                    Array.isArray(e.value) &&
                    e.value.includes(option.value === '1' ? option.label : option.value)
                );

                const mappedSelections: Option[] = updatedSelections.map((option: SourceOption) => ({
                    id: option.value,
                    name: option.name,
                }));

                const updatedItem = selectMultiData(mappedSelections, field);

                return {
                    ...dataItem,
                    ...updatedItem,
                    [field]: updatedSelections,
                };
            }
            return dataItem;
        });

        setRoleData(updatedData);
    };

    const transformArrayToObject = (array: { label: string; value: string | number }[]): Record<string, string | number> => {
        return array.reduce((acc, item) => {
            acc[item.label] = item.value;
            return acc;
        }, {} as Record<string, string | number>);
    };

    const handleCloseDialog = () => {
        setTimeout(() => {
            setShowSuccessDialog(false);
        }, 1000);
    };

    const save = async () => {
        const roleDetail: RoleDetail[] = roleData.map((element: any) => ({
            name: element.name,
            action: JSON.stringify(element.selectedActions),
            hideColumn: JSON.stringify(element.selectedHideColumns),
            status: JSON.stringify(element.selectedStatuses),
            dbStatus: element.selectedStatuses
                ? JSON.stringify(transformArrayToObject(element.selectedStatuses))
                : '',
        }));

        if (!selectedRole?.id) {
            setSelectedRole({ name: model.name, id: 0 });
        }

        if (selectedRole.id === 0) {
            const recordData = roleList.filter(
                (a: Role) => a.name === selectedRole.name
            );
            if (recordData.length) {
                setErrorMsg('Role Name Already Exists');
                setTimeout(() => setErrorMsg(''), 2000);
                return false;
            }
        }

        try {
            const newRole = {
                "name": model.name,
                "id": 0
            }
            const form = !selectedRole?.id ? newRole : selectedRole;
            
            const response = await roleAddService.addData(form, roleDetail);

            if (response.trim() === 'Success') {
                loadData();
                await roleQuery.load();
                await roleDetailQuery.load();
                await roleDataQuery.load();

                if (fetchRoleDetailsData) {
                    // const updatedList = roleDataResponse.map((element: any) => ({
                    //     ...element,
                    //     action: element.action ? JSON.parse(element.action) : '',
                    //     hideColumn: element.hideColumn ? JSON.parse(element.hideColumn) : '',
                    //     status: element.status ? JSON.parse(element.status) : '',
                    //     dbStatus: element.dbStatus ? JSON.parse(element.dbStatus) : '',
                    // }));
                }
                setModel({ name: '' });
                setShowSuccessDialog(true);
                setSelectedRole({});


            } else {
                console.error('Unexpected response:', response);
            }
        } catch (error) {
            console.error('Error saving role:', error);
        }
    };

    const handleBackToUser = () => {
        navigate("/appuser");
    };

    return (
        <div className="relative h-screen flex flex-col overflow-y-auto overflow-x-hidden">
            <div className="flex items-center p-1 border-b border-[var(--color-gray)] shadow-md bg-[var(--color-white)] text-[var(--color-dark)] w-full fixed  top-30 z-20">
                <Button
                    className="backBtn cursor-pointer flex items-center"
                    onClick={handleBackToUser}
                >
                    <BsArrowLeft className="h-6 w-6 cursor-pointer mx-3" />
                </Button>
                <h1 className=" capitalize text-[14px] font-semibold ">{t("globals.backto")} {t("appUsers.form_detail.fields.modelname")}</h1>
            </div>

            <div className="flex flex-col p-4 border-none mb-10 sm:mb-24">
                <div className="import-grid pb-2 lg:pb-4 mt-5 lg:mt-10">
                    <div className="flex flex-col">
                        <div className=" flex items-center">
                            <label
                                htmlFor="name"
                                className="text-sm font-bold py-2"
                            >
                                {t("appUsers.columns.fields.name")}
                            </label>
                            <span className=" text-red-600 pl-2">*</span>
                            <TooltipWithText text={t('appUsers.columns.fields.name')} />
                        </div>

                        <InputText
                            id="name"
                            className="w-full lg:w-20rem  rounded-md py-2 bg-[var(--color-white)] px-3 border text-sm border-[var(--color-gray)] focus:border-blue-500 focus:ring focus:ring-blue-200"
                            type="text"
                            placeholder={t('appUsers.columns.fields.name')}
                            name="name"
                            value={model.name}
                            onChange={handleInputChange}
                        />
                    </div>

                    <div className="flex flex-col">
                        <div className=" flex items-center">
                            <label
                                htmlFor="role"
                                className="text-sm font-bold py-2 "
                            >
                                {t("appUsers.columns.fields.role")}
                            </label>
                            <span className=" text-red-600 pl-2">*</span>
                            <TooltipWithText text={t("appUsers.columns.fields.role")} />
                        </div>
                        <Dropdown
                            id="select"
                            name="select"
                            value={selectedRole}
                            onChange={(e) => handleDropdownChange(e.value)}
                            options={roleList}
                            placeholder={t("appUsers.columns.fields.role")}
                            optionLabel="name"
                            filter
                            className="w-full lg:w-20rem text-sm bg-[var(--color-white)]  flex items-center h-[40px]"
                        />
                    </div>
                </div>
                <small className="text-red-500 mt-2 block">{errorMsg}</small>

                <DataTable value={roleData} className="p-datatable-gridlines datatable-responsive tableResponsive" >
                    <Column
                        headerStyle={{
                            backgroundColor: "var(--color-primary)",
                            color: "var(--color-white)",
                            textAlign: "center",
                        }}
                        field="name"
                        header={t('appUsers.columns.fields.name')}
                        style={{ width: '50px', minWidth: '50px', maxWidth: '50px', background: "var(--color-white)", color: 'var(--color-dark)' }}
                        className="text-sm sticky text-slate-600 font-semibold whitespace-nowrap overflow-hidden text-ellipsis"
                    />
                    <Column
                        header={t('globals.action')}
                        headerStyle={{
                            backgroundColor: "var(--color-primary)",
                            color: "var(--color-white)",
                            textAlign: "center",
                            fontSize: "13px"
                        }}
                        className='text-xs '
                        body={(item) => {
                            return (
                                <MultiSelect
                                    id={`action-${item.id}`}
                                    name="action"
                                    value={(item.selectedActions || []).map((action: SourceOption) => action.value)}
                                    options={item.actions}
                                    onChange={(e) => handleMultiSelectChange(e, item, 'selectedActions')}
                                    optionLabel="name"
                                    optionValue="value"
                                    filter
                                    placeholder={t("roles.columns.fields.actions")}
                                    className="w-full border bg-[var(--color-white)] text-[var(--color-dark)] border-[var(--color-gray)] rounded-md shadow-sm"
                                />
                            )
                        }}
                    />
                    <Column
                        header={t("roles.columns.fields.hideColumns")}
                        headerStyle={{
                            backgroundColor: "var(--color-primary)",
                            color: "var(--color-white)",
                            textAlign: "center",
                            fontSize: "13px"
                        }}
                        className='text-xs '
                        body={(item) => (
                            <MultiSelect
                                id={`hideColumn-${item.id}`}
                                name="hideColumn"
                                value={(item.selectedHideColumns || []).map((col: { value: SourceOption; }) => col.value)}
                                options={item.hideColumns}
                                onChange={(e) => handleMultiSelectChange(e, item, 'selectedHideColumns')}
                                optionLabel="name"
                                optionValue="value"
                                filter
                                placeholder={t("roles.columns.fields.hideColumns")}
                                className="w-full border bg-[var(--color-white)] text-[var(--color-dark)] border-[var(--color-gray)] rounded-md shadow-sm"
                            />
                        )}
                    />
                    <Column
                        header={t("roles.columns.fields.statuses")}
                        headerStyle={{
                            backgroundColor: "var(--color-primary)",
                            color: "var(--color-white)",
                            textAlign: "center",
                        }}
                        body={(item) => {
                            return (
                                <MultiSelect
                                    id={`status-${item.id}`}
                                    name="status"
                                    value={(item.selectedStatuses || []).map((status: SourceOption) =>
                                        status.value === "1" ? status.label : status.value
                                    )}
                                    options={item.statuses}
                                    onChange={(e) => handleMultiSelectChange(e, item, 'selectedStatuses')}
                                    optionLabel="name"
                                    optionValue="label"
                                    filter
                                    placeholder={t("roles.columns.fields.statuses")}
                                    className="w-full border bg-[var(--color-white)] text-[var(--color-dark)] border-[var(--color-gray)] rounded-md shadow-sm"
                                />
                            )
                        }}
                    />
                </DataTable>
            </div>

            <div className="fixed flex bottom-0 z-auto bg-[var(--color-white)] shadow-lg border-t border-[var(--color-gray)] p-2 available-width">
                <div className="flex justify-end items-end gap-2 px-3">
                    <Button
                        type="button"
                        className={`p-2 w-[100px] font-medium text-[13px] flex items-center justify-center 
                                 bg-[#059669] text-white disabled:bg-[#9ca3af] disabled:text-black disabled:cursor-not-allowed`}
                        onClick={save}                    >
                        <span>{t('globals.save')}</span> <FaSave size={15} />
                    </Button>
                </div>
            </div>

            <Dialog
                visible={showSuccessDialog}
                onHide={handleCloseDialog}
                className="w-[350px]">
                <div className="flex flex-col items-center">
                    <Image
                        src={successImg}
                        alt="Update Image"
                        className="w-24 h-24 mb-4"
                    />
                    <div className="text-center flex flex-col gap-2">
                        <p className="text-[16px] font-semibold text-slate-800">{model.name ? t('globals.addDialogMsg', { model: 'Role' }) : t('globals.updateDialogMsg', { model: 'Role' })}</p>
                    </div>
                </div>
            </Dialog>

        </div>
    );
};

export default RoleDetailsForm;
