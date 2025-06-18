import { useEffect, useRef, useState } from 'react'
import successImg from '../../../assets/images/success.gif'
import { BsArrowLeft, Button, Calendar, Checkbox, Dialog, Dropdown, DropdownChangeEvent, FaSave, Image, InputText, InputTextarea, IoIosArrowBack, IoIosArrowForward, MultiSelect, MultiSelectChangeEvent, RadioButton, RadioButtonChangeEvent, Stepper, StepperPanel, StepperRefAttributes, Toast } from '../../../sharedBase/globalImports';
import { useNavigate, useParams, useTranslation } from '../../../sharedBase/globalUtils';
import { useEditPage } from '../../../hooks/useEditPage';
import { AppUser } from '../../../core/model/appuser';
import { selectDropdownEnum, selectMultiData, selectRadioEnum } from '../../../sharedBase/dropdownUtils';
import TooltipWithText from '../../../components/TooltipWithText';
import FileUploadMain from '../../../components/FileUploadMain';
import { EnumDetail } from '../../../core/model/enumdetail';
import { CustomFile } from '../../../core/model/customfile';
import { useItemQuery } from '../../../store/useItemQuery';
import { AppUserService } from '../../../core/service/appUsers.service';
import { useListQuery } from '../../../store/useListQuery';
import { getData, useFetchDataEnum } from '../../../sharedBase/lookupService';
import Loader from '../../../components/Loader';
import { appUser } from '../../../schema/appuser';

export default function AppUsersEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const appUserSchema = appUser(t);
  const toast = useRef<Toast>(null);
  const baseModelName = "appuser";
  const typeName = "appuser";
  const userService = AppUserService();
  const itemQuery = useItemQuery<AppUser>(userService);
  const listQuery = useListQuery<AppUser>(userService);
  const isEditMode = Boolean(id);
  const stepperRef = useRef<StepperRefAttributes | null>(null);
  const [item, setItem] = useState<AppUser>(initData());
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [stepNo, setStepNo] = useState(0);
  const headers = [
    t("appUsers.form_detail.fields.accessDetails"),
    t("appUsers.form_detail.fields.shopDetails"),
    t("appUsers.form_detail.fields.shopAddress"),
    t("appUsers.form_detail.fields.verifyShop"),
  ];

  const [listVerifyShop, setListVerifyShop] = useState<EnumDetail[]>([]);
  const [listRole, setListRole] = useState<EnumDetail[]>([]);
  const [listPublish, setListPublish] = useState<EnumDetail[]>([]);

  const [selectedVerifyShop, setSelectedVerifyShop] = useState<string | undefined>(undefined);
  const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);
  const [selectedPublish, setSelectedPublish] = useState<string | undefined>(undefined);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [itemData, setItemData] = useState<AppUser>(initData());

  const roleData = useFetchDataEnum("RoleType");
  const publishData = useFetchDataEnum("PublishType");
  const verifyData = useFetchDataEnum("VerifyType");

  // const [calendarLastLogin, setCalendarLastLogin] = useState<Date | null>(null);

  const [reportedByList, setReportedByList] = useState<AppUser[]>([]);
  const [reportedToList, setReportedToList] = useState<AppUser[]>([]);
  const [selectedReportedBy, setSelectedReportedBy] = useState<string | null>(null);
  const [selectedReportedTo, setSelectedReportedTo] = useState<AppUser[]>([]);

  function initData(): AppUser {
    return {
      id: undefined,
      name: '',
      firstName: '',
      lastName: '',
      mobile: '',
      mobileVerified: false,
      emailId: '',
      emailVerified: false,
      shopName: '',
      password: '',
      pincode: '',
      state: '0',
      district: '0',
      address: '',
      addressLine: '',
      verifyShop: '',
      verifyShopLabel: '',
      gst: '',
      gstCertificate: undefined,
      photoShopFront: undefined,
      visitingCard: undefined,
      cheque: undefined,
      gstOtp: '',
      isActive: false,
      isAdmin: false,
      hasImpersonateAccess: false,
      photoAttachment: undefined,
      role: '',
      roleLabel: '',
      publish: '',
      publishLabel: '',
      lastLogin: undefined,
      defaultLanguage: '',
      isPremiumUser: false,
      totalPlot: undefined,
      reportedBy: "",
      reportedByLabel: '',
      reportedTo: undefined,
    };
  }

  const { showDialog, setShowDialog, isFieldHidden, handleCloseDialog, formatDate, removeEmptyFields, prepareObject }
    = useEditPage<AppUser>({
      props: {
        id: id,
        baseModelName: baseModelName,
        typeName: typeName,
        listQuery: listQuery
      }
    });

  useEffect(() => {
    const fetchData = async () => {
      if (isEditMode) {
        const data = await itemQuery.getItem(parseInt(id as string, 10));
        setItemData(data);
        const preparedData = prepareObject<AppUser>(data, initData());
        setItem(preparedData);
      }
    };
    fetchData();
  }, [isEditMode, prepareObject, id]);

  // if (preparedData.lastLogin) {
  //   setCalendarLastLogin(new Date(preparedData.lastLogin));
  // } else {
  //   setCalendarLastLogin(null);
  // }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const listReportedBy = await getData(userService);
        const options = listReportedBy.map((item) => ({
          ...item, id: item.id?.toString()
        }));
        setReportedByList(options);
        if (itemData.reportedBy) {
          setSelectedReportedBy(itemData.reportedBy);
        }

        const listReportedTo = await getData(userService);
        setReportedToList(listReportedTo);
        if (itemData.reportedTo) {
          const arrList = itemData.reportedTo.split(",");
          const selectedList = listReportedTo.filter((a: AppUser) =>
            arrList.includes("" + a.id)
          );
          if (selectedList.length) {
            setSelectedReportedTo(selectedList);
          }
        }

      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [itemData]);

  useEffect(() => {
    const bindDropDownList = async () => {
      setListRole(roleData?.data);
      setListPublish(publishData?.data);
      setListVerifyShop(verifyData?.data);

      if (!itemData) return;

      if (itemData?.role) {
        const selectedList = roleData?.data.filter(
          (a) => a.value === itemData?.role
        );
        if (selectedList.length) {
          setSelectedRole(selectedList[0].value);
        }
      }

      if (itemData?.verifyShop) {
        const selectedList = verifyData?.data.filter(
          (a) => a.value === itemData?.verifyShop
        );
        if (selectedList.length) {
          setSelectedVerifyShop(selectedList[0].value);
        }
      }

      if (itemData?.publish) {
        const selectedList = publishData?.data.filter(
          (a) => a.value === itemData?.publish
        );
        if (selectedList.length) {
          setSelectedPublish(selectedList[0].value);
        }
      }

    };

    bindDropDownList();
  }, [itemData, roleData?.data, publishData?.data, verifyData?.data]);

  const handleInputChange = (field: string, value: string) => {
    setItem((prev) => ({ ...prev, [field]: value }));
    const schema = appUserSchema[field as keyof typeof appUserSchema];

    if (schema) {
      const result = schema.safeParse(value);
      if (result.success) {
        setErrors((prev) => ({ ...prev, [field]: '' }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [field]: result.error.errors[0].message,
        }));
      }
    }
  };

  // const onClearDate = () => {
  //   setItem((prev) => ({ ...prev, lastLogin: undefined }));
  //   setCalendarLastLogin(null);
  //   setErrors((prev) => ({ ...prev, lastLogin: '' }));
  // };

  const handleFileUpload = (files: CustomFile[], inputName: string) => {
    setItem(prevData => ({
      ...prevData,
      [inputName]: JSON.stringify(files)
    }));
  };

  const handleBackToUser = () => {
    navigate("/appuser");
  };

  const handleCheckboxChange = (e: { checked?: boolean }, key: string) => {
    const value = e.checked ?? false;

    setItem((prev) => ({
      ...prev,
      [key]: value,
    }));

    const schema = appUserSchema[key as keyof typeof appUserSchema];
    if (schema) {
      const result = schema.safeParse(value);
      if (result.success) {
        setErrors((prev) => ({ ...prev, [key]: '' }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [key]: result.error.errors[0].message,
        }));
      }
    }
  };

  const validateStepFields = (step: number) => {
    const container = stepRefs.current[step];
    let hasError = false;
    const newErrors: Record<string, string> = { ...errors };

    if (container) {
      const nativeInputs = container.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
        'input, select, textarea'
      );

      nativeInputs.forEach((input) => {
        const fieldName = input.name;
        const value = item[fieldName as keyof typeof item];
        const schema = appUserSchema[fieldName as keyof typeof appUserSchema];
        const isRequired = input.hasAttribute('required');
        const isEmpty = value === '' || value === null || value === undefined;

        if (isRequired) {
          if (schema) {
            const result = schema.safeParse(value);
            if (!result.success) {
              newErrors[fieldName] = result.error.errors[0].message;
              hasError = true;
            } else {
              newErrors[fieldName] = '';
            }
          } else if (isEmpty) {
            newErrors[fieldName] = 'This field is required';
            hasError = true;
          } else {
            newErrors[fieldName] = '';
          }
        } else if (schema && !isEmpty) {
          const result = schema.safeParse(value);
          if (!result.success) {
            newErrors[fieldName] = result.error.errors[0].message;
            hasError = true;
          } else {
            newErrors[fieldName] = '';
          }
        } else {
          newErrors[fieldName] = '';
        }
      });

      const multiSelectInputs = container.querySelectorAll('.p-multiselect');
      multiSelectInputs.forEach((input) => {
        const fieldName = input.getAttribute('data-name');
        const schema = appUserSchema[fieldName as keyof typeof appUserSchema];

        const isRequired = input.getAttribute('data-required') === 'true';
        if (fieldName) {
          const value = item[fieldName as keyof typeof item];
          const isEmpty = value === '' || value === null || value === undefined || (Array.isArray(value) && value.length === 0);

          if (isRequired) {
            if (schema) {
              const result = schema.safeParse(value);
              if (!result.success) {
                newErrors[fieldName] = result.error.errors[0].message;
                hasError = true;
              } else {
                newErrors[fieldName] = '';
              }
            } else if (isEmpty) {
              newErrors[fieldName] = 'This field is required';
              hasError = true;
            }
          } else {
            newErrors[fieldName] = '';
          }
        }
      });
    }

    setErrors(newErrors);
    return !hasError;
  };

  const next = () => {
    const isValid = validateStepFields(stepNo);
    if (!isValid) {
      return;
    }
    if (stepNo <= headers?.length) {
      setStepNo((prev) => prev + 1);
      stepperRef?.current?.nextCallback();
    }
  };

  const previous = () => {
    setStepNo((prev) => (prev > 0 ? prev - 1 : 0));
    stepperRef?.current?.prevCallback();
  };

  const handleSubmitClick = () => {
    const isValid = validateStepFields(stepNo);

    if (!isValid) return;
    const form = document.getElementById("myForm") as HTMLFormElement | null;
    if (form) {
      form.requestSubmit();
    }
  };

  const handleDropdownChange = (e: DropdownChangeEvent, controlName: string) => {
    const value = e.value || '';

    const inputElement = document.querySelector(`[name="${controlName}"]`) as HTMLElement;
    const isRequired = inputElement?.hasAttribute('required');

    if (isRequired) {
      const schema = appUserSchema[controlName as keyof typeof appUserSchema];

      if (schema) {
        const result = schema.safeParse(value.toString());

        if (!result.success) {
          setErrors((prev) => ({
            ...prev,
            [controlName]: result.error.errors[0].message,
          }));
          return;
        } else {
          setErrors((prev) => ({ ...prev, [controlName]: '' }));
        }
      } else if (value === '' || value === false) {
        setErrors((prev) => ({
          ...prev,
          [controlName]: 'This field is required',
        }));
        return;
      }
    } else {
      setErrors((prev) => ({ ...prev, [controlName]: '' }));
    }

    const updatedFormData = selectDropdownEnum(e, controlName, false, item);
    setItem(updatedFormData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {

      const payload = {
        ...item,
      };

      const cleanedPayload = removeEmptyFields(payload);
      let updatedItem;

      if (itemData?.id) {
        updatedItem = { ...cleanedPayload, id: parseInt(itemData?.id.toString(), 10) };
        await itemQuery.updateItem(updatedItem);
        setDialogMessage(t('globals.updateDialogMsg', { model: 'App User' }));
      } else {
        await itemQuery.addItem(cleanedPayload);
        setDialogMessage(t('globals.addDialogMsg', { model: 'App User' }));
      }

      setItem(initData());
      await listQuery?.load();
      setShowDialog(true);
    } catch (error) {
      console.error("Error:", error);
      if (itemData?.id) {
        alert("Failed to update App User. Please try again later.");
      } else {
        alert("Failed to add App User. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleMultiSelectChange = (e: MultiSelectChangeEvent, fieldName: string, setFieldValue: React.Dispatch<React.SetStateAction<AppUser[]>>) => {
    const selectedValues = e.value as AppUser[];
    setFieldValue(selectedValues);

    const inputElement = document.querySelector(`[name="${fieldName}"]`) as HTMLElement;
    const isRequired = inputElement?.hasAttribute('required') || inputElement?.getAttribute('aria-required') === 'true';
    const selectedIds = selectedValues.map((user) => user.id).filter((id) => id !== undefined).join(',');

    if (isRequired) {
      const schema = appUserSchema[fieldName as keyof typeof appUserSchema];
      if (schema) {
        const result = schema.safeParse(selectedIds);
        if (!result.success) {
          setErrors((prev) => ({
            ...prev,
            [fieldName]: result.error.errors[0].message,
          }));
          return;
        } else {
          setErrors((prev) => ({ ...prev, [fieldName]: '' }));
        }
      } else if (!selectedValues || selectedValues.length === 0) {
        setErrors((prev) => ({
          ...prev,
          [fieldName]: 'This field is required',
        }));
        return;
      }
    } else {
      setErrors((prev) => ({ ...prev, [fieldName]: '' }));
    }

    const updatedModel = selectMultiData(selectedValues, fieldName);
    setItem((prev) => ({
      ...prev,
      [fieldName]: updatedModel[fieldName] || '',
      [`${fieldName}Label`]: updatedModel[`${fieldName}Label`]?.toString() || '',
    }));
  };

  const handleRadioChange = (e: RadioButtonChangeEvent, controlName: string, isBoolean = false) => {
    selectRadioEnum(e, controlName, item, setItem, isBoolean);
  };

  return (
    <div className='relative h-screen flex flex-col'>
      <div className="flex flex-col overflow-y-auto overflow-x-hidden">
        <div className="flex items-center p-1 border-b topbar border-[var(--color-border)] shadow-md bg-[var(--color-white)] text-[var(--color-dark)] w-full fixed  top-30 z-20">
          <Button
            className="backBtn cursor-pointer flex items-center"
            onClick={handleBackToUser}
          >
            <BsArrowLeft className="h-6 w-6 cursor-pointer mx-3" />
          </Button>
          <h1 className=" capitalize text-[14px] font-semibold ">{t("globals.backto")} {t("appUsers.form_detail.fields.modelname")}</h1>
        </div>

        {itemQuery.isLoading ? (
          <Loader />
        ) : (
          <>
            <div className="flex flex-col  border-none bg-[var(--color-white)] text-[var(--color-dark)] mb-10 sm:mb-20">
              <form id="myForm" onSubmit={handleSubmit} noValidate>
                <div className="w-full bg-[var(--color-white)] text-[var(--color-dark)]">
                  <Stepper ref={stepperRef} headerPosition="bottom">
                    <StepperPanel header={headers[0]}>
                      <div ref={(el) => { stepRefs.current[0] = el; }} className="p-2 mt-3 lg:mt-10 mb-12 md:mb-0 lg:mb-0 bg-[var(--color-white)] text-[var(--color-dark)]">
                        <div className="user-grid pb-5">
                          {!isFieldHidden("name") && (
                            <div className="flex flex-col">
                              <div className=" flex items-center">
                                <label
                                  htmlFor="name"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
                                >
                                  {t("appUsers.columns.fields.name")}
                                </label>
                                <span className=" text-[var(--color-danger)] pl-2 ">*</span>
                                <TooltipWithText text={t('appUsers.columns.fields.name')} />
                              </div>
                              <InputText
                                type="text"
                                id="name"
                                name="name"
                                value={item.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                placeholder={t('appUsers.columns.fields.name')}
                                className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                minLength={2}
                                maxLength={100}
                                required
                              />
                              {errors.name && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.name}
                                </p>
                              )}
                            </div>
                          )}

                          {!isFieldHidden("firstName") && (
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <label
                                  htmlFor="firstName"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
                                >
                                  {t("appUsers.columns.fields.firstName")}
                                </label>
                                <TooltipWithText text={t("appUsers.columns.fields.firstName")} />
                              </div>
                              <InputText
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={item.firstName}
                                placeholder={t("appUsers.columns.fields.firstName")}
                                className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                minLength={2}
                                maxLength={100}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                              />
                              {errors.firstName && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.firstName}
                                </p>
                              )}
                            </div>
                          )}

                          {!isFieldHidden("lastName") && (
                            <div className="flex flex-col">
                              <div className=" flex items-center">
                                <label
                                  htmlFor="lastName"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)] "
                                >
                                  {t("appUsers.columns.fields.lastName")}
                                </label>
                                <TooltipWithText text={t("appUsers.columns.fields.lastName")} />
                              </div>
                              <InputText
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={item.lastName}
                                placeholder={t("appUsers.columns.fields.lastName")}
                                className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                minLength={2}
                                maxLength={100}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                              />
                              {errors.lastName && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.lastName}
                                </p>
                              )}
                            </div>
                          )}

                          {!isFieldHidden("mobile") && (
                            <div className="flex flex-col">
                              <div className=" flex items-center">
                                <label
                                  htmlFor="mobile"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)] "
                                >
                                  {t("appUsers.columns.fields.mobile")}
                                </label>
                                <span className=" text-[var(--color-danger)] pl-2">*</span>
                                <TooltipWithText text={t("appUsers.columns.fields.mobile")} />
                              </div>
                              <InputText
                                type="text"
                                id="mobile"
                                name="mobile"
                                value={item.mobile}
                                placeholder={t("appUsers.columns.fields.mobile")}
                                className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                minLength={10}
                                maxLength={10}
                                onChange={(e) => handleInputChange('mobile', e.target.value)}
                                required
                              />
                              {errors.mobile && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.mobile}
                                </p>
                              )}
                            </div>
                          )}

                          {!isFieldHidden("mobileVerified") && (
                            <div className="flex flex-col">
                              <div className=" flex items-center">
                                <label
                                  htmlFor="mobileVerified"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)] "
                                >
                                  {t("appUsers.columns.fields.mobileVerified")}
                                </label>
                                <span className=" text-[var(--color-danger)] pl-2">*</span>
                                <TooltipWithText text={t("appUsers.columns.fields.mobileVerified")} />
                              </div>
                              <Checkbox
                                inputId="mobileVerified"
                                name="mobileVerified"
                                value="mobileVerified"
                                checked={item.mobileVerified ?? false}
                                onChange={(e) =>
                                  handleCheckboxChange(e, "mobileVerified")
                                }
                                className="bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                required
                              />
                              {errors.mobileVerified && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.mobileVerified}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </StepperPanel>

                    <StepperPanel header={headers[1]}>
                      <div ref={(el) => { stepRefs.current[1] = el; }} className="p-2 mt-3 lg:mt-10 bg-[var(--color-white)] text-[var(--color-dark)] mb-12 md:mb-0 lg:mb-0">
                        <div className="user-grid pb-5">
                          {!isFieldHidden("emailId") && (
                            <div className="flex flex-col">
                              <div className=" flex items-center">
                                <label
                                  htmlFor="emailId"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)] "
                                >
                                  {t("appUsers.columns.fields.emailId")}
                                </label>
                                <TooltipWithText text={t("appUsers.columns.fields.emailId")} />
                              </div>
                              <InputText
                                type="email"
                                id="emailId"
                                name="emailId"
                                value={item.emailId}
                                placeholder={t("appUsers.columns.fields.emailId")}
                                className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                maxLength={100}
                                onChange={(e) => handleInputChange('emailId', e.target.value)}
                              />
                              {errors.emailId && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.emailId}
                                </p>
                              )}
                            </div>
                          )}

                          {!isFieldHidden("emailVerified") && (
                            <div className="flex flex-col">
                              <div className=" flex items-center">
                                <label
                                  htmlFor="emailVerified"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)] "
                                >
                                  {t("appUsers.columns.fields.emailVerified")}
                                </label>
                                <TooltipWithText text={t("appUsers.columns.fields.emailVerified")} />
                              </div>
                              <Checkbox
                                inputId="emailVerified"
                                name="emailVerified"
                                value="emailVerified"
                                checked={item.emailVerified ?? false}
                                onChange={(e) =>
                                  handleCheckboxChange(e, "emailVerified")
                                }
                                className="bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                              />
                              {errors.emailVerified && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.emailVerified}
                                </p>
                              )}
                            </div>
                          )}

                          {!isFieldHidden("shopName") && (
                            <div className="flex flex-col">
                              <div className=" flex items-center">
                                <label
                                  htmlFor="shopName"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)] "
                                >
                                  {t("appUsers.columns.fields.shopName")}
                                </label>
                                <TooltipWithText text={t("appUsers.columns.fields.shopName")} />
                              </div>
                              <InputText
                                type="text"
                                id="shopName"
                                name="shopName"
                                value={item.shopName}
                                placeholder={t("appUsers.columns.fields.shopName")}
                                className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                minLength={2}
                                maxLength={100}
                                onChange={(e) => handleInputChange('shopName', e.target.value)}
                              />
                              {errors.shopName && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.shopName}
                                </p>
                              )}
                            </div>
                          )}

                          {!isFieldHidden("password") && (
                            <div className="flex flex-col">
                              <div className=" flex items-center">
                                <label
                                  htmlFor="password"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)] "
                                >
                                  {t("appUsers.columns.fields.password")}
                                </label>
                                <TooltipWithText text={t("appUsers.columns.fields.password")} />
                              </div>
                              <InputText
                                type="password"
                                id="password"
                                name="password"
                                value={item.password}
                                placeholder={t("appUsers.columns.fields.password")}
                                className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                minLength={2}
                                maxLength={100}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                              />
                              {errors.password && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.password}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </StepperPanel>

                    <StepperPanel header={headers[2]}>
                      <div ref={(el) => { stepRefs.current[2] = el; }} className="p-2 mt-3 lg:mt-10 bg-[var(--color-white)] text-[var(--color-dark)] mb-12 md:mb-0 lg:mb-0">
                        <div className="user-grid pb-5">
                          {!isFieldHidden("pincode") && (
                            <div className="flex flex-col">
                              <div className=" flex items-center">
                                <label
                                  htmlFor="pincode"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)] "
                                >
                                  {t("appUsers.columns.fields.pincode")}
                                </label>
                                <TooltipWithText text={t("appUsers.columns.fields.pincode")} />
                              </div>
                              <InputText
                                type="text"
                                id="pincode"
                                name="pincode"
                                value={item.pincode}
                                placeholder={t("appUsers.columns.fields.pincode")}
                                className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                maxLength={6}
                                onChange={(e) => handleInputChange('pincode', e.target.value)}
                              />
                              {errors.pincode && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.pincode}
                                </p>
                              )}
                            </div>
                          )}

                          {!isFieldHidden("state") && (
                            <div className="flex flex-col">
                              <div className=" flex items-center">
                                <label
                                  htmlFor="state"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)] "
                                >
                                  {t("appUsers.columns.fields.state")}
                                </label>
                                <TooltipWithText text={t("appUsers.columns.fields.state")} />
                              </div>
                              <InputText
                                type="text"
                                id="state"
                                name="state"
                                value={item.state}
                                placeholder={t("appUsers.columns.fields.state")}
                                className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)]  border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                maxLength={100}
                                onChange={(e) => handleInputChange('state', e.target.value)}
                              />
                              {errors.state && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.state}
                                </p>
                              )}
                            </div>
                          )}

                          {!isFieldHidden("district") && (
                            <div className="flex flex-col">
                              <div className=" flex items-center">
                                <label
                                  htmlFor="district"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)] "
                                >
                                  {t("appUsers.columns.fields.district")}
                                </label>
                                <TooltipWithText text={t("appUsers.columns.fields.district")} />
                              </div>
                              <InputText
                                type="text"
                                id="district"
                                name="district"
                                value={item.district}
                                placeholder={t("appUsers.columns.fields.district")}
                                className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                maxLength={100}
                                onChange={(e) => handleInputChange('district', e.target.value)}
                              />
                              {errors.district && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.district}
                                </p>
                              )}
                            </div>
                          )}

                          {!isFieldHidden("address") && (
                            <div className="flex flex-col">
                              <div className=" flex items-center">
                                <label
                                  htmlFor="address"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)] "
                                >
                                  {t("appUsers.columns.fields.address")}
                                </label>
                                <TooltipWithText text={t("appUsers.columns.fields.address")} />
                              </div>
                              <InputTextarea
                                id="address"
                                name="address"
                                value={item.address}
                                placeholder={t("appUsers.columns.fields.address")}
                                className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)]  border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                minLength={2}
                                maxLength={10000}
                                onChange={(e) => handleInputChange('address', e.target.value)}
                              />
                              {errors.address && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.address}
                                </p>
                              )}
                            </div>
                          )}

                          {!isFieldHidden("addressLine") && (
                            <div className="flex flex-col">
                              <div className=" flex items-center">
                                <label
                                  htmlFor="addressLine"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)] "
                                >
                                  {t("appUsers.columns.fields.addressLine")}
                                </label>
                                <TooltipWithText text={t("appUsers.columns.fields.addressLine")} />
                              </div>
                              <InputTextarea
                                id="addressLine"
                                name="addressLine"
                                value={item.addressLine}
                                placeholder={t("appUsers.columns.fields.addressLine")}
                                className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                minLength={2}
                                maxLength={10000}
                                onChange={(e) => handleInputChange('addressLine', e.target.value)}
                              />
                              {errors.addressLine && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.addressLine}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </StepperPanel>

                    <StepperPanel header={headers[3]}>
                      <div ref={(el) => { stepRefs.current[3] = el; }} className="p-2 mb-12 md:mb-0 lg:mb-0 bg-[var(--color-white)] text-[var(--color-dark)] mt-3 lg:mt-10">
                        <div className="user-grid pb-5">
                          {!isFieldHidden("verifyShop") && (
                            <div className="flex flex-col">
                              <div className=" flex items-center">
                                <label
                                  htmlFor="verifyShop"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
                                >
                                  {t("appUsers.columns.fields.verifyShop")}
                                </label>
                                <TooltipWithText text={t("appUsers.columns.fields.verifyShop")} />
                              </div>
                              <Dropdown
                                id="verifyShop"
                                name="verifyShop"
                                value={selectedVerifyShop}
                                placeholder={t("appUsers.columns.fields.verifyShop")}
                                options={listVerifyShop}
                                optionLabel="name"
                                onChange={(e: DropdownChangeEvent) => { handleDropdownChange(e, "verifyShop"); setSelectedVerifyShop(e.value) }}
                                filter
                                checkmark={true}
                                highlightOnSelect={false}
                                appendTo="self"
                                className="dropdowndark text-sm w-full lg:w-20rem flex items-center h-[40px]  bg-[var(--color-white)] text-[var(--color-dark)]"
                              />
                              {errors.verifyShop && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.verifyShop}
                                </p>
                              )}
                            </div>
                          )}

                          {!isFieldHidden("gst") && (
                            <div className="flex flex-col">
                              <div className=" flex items-center">
                                <label
                                  htmlFor="gst"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)] "
                                >
                                  {t("appUsers.columns.fields.gst")}
                                </label>
                                <TooltipWithText text={t("appUsers.columns.fields.gst")} />
                              </div>
                              <InputText
                                type="text"
                                id="gst"
                                name="gst"
                                value={item.gst}
                                placeholder={t("appUsers.columns.fields.gst")}
                                className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                minLength={2}
                                maxLength={100}
                                onChange={(e) => handleInputChange('gst', e.target.value)}
                              />
                              {errors.gst && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.gst}
                                </p>
                              )}
                            </div>
                          )}

                          {!isFieldHidden("gstCertificate") && (
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <label
                                  htmlFor="gstCertificate"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)] "
                                >
                                  {t("appUsers.columns.fields.gstCertificate")}
                                </label>
                                <TooltipWithText text={t("appUsers.columns.fields.gstCertificate")} />
                              </div>
                              <FileUploadMain
                                modelName="AppUser"
                                propName="gstCertificate"
                                onFileUpload={(files) => handleFileUpload(files, 'gstCertificate')}
                                accept=".jpg,.jpeg,.png,.pdf"
                                initialData={item.gstCertificate ?? null}
                                maxFileNumber={2}
                              />                             
                            </div>
                          )}

                          {!isFieldHidden("photoShopFront") && (
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <label
                                  htmlFor="photoShopFront"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)] "
                                >
                                  {t("appUsers.columns.fields.photoShopFront")}
                                </label>
                                <TooltipWithText text={t("appUsers.columns.fields.photoShopFront")} />
                              </div>

                              <FileUploadMain
                                modelName="AppUser"
                                propName="photoShopFront"
                                onFileUpload={(files) => handleFileUpload(files, 'photoShopFront')}
                                accept=".jpg,.jpeg,.png,.pdf"
                                initialData={item.photoShopFront ?? null}
                                maxFileNumber={2}
                              />
                            </div>
                          )}

                          {!isFieldHidden("visitingCard") && (
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <label
                                  htmlFor="visitingCard"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)] "
                                >
                                  {t("appUsers.columns.fields.visitingCard")}
                                </label>
                                <TooltipWithText text={t("appUsers.columns.fields.visitingCard")} />
                              </div>
                              <FileUploadMain
                                modelName="AppUser"
                                propName="visitingCard"
                                onFileUpload={(files) => handleFileUpload(files, 'visitingCard')}
                                accept=".jpg,.jpeg,.png,.pdf"
                                initialData={item.visitingCard ?? null}
                                maxFileNumber={2}
                              />
                            </div>
                          )}

                          {!isFieldHidden("cheque") && (
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <label
                                  htmlFor="cheque"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)] "
                                >
                                  {t("appUsers.columns.fields.cheque")}
                                </label>
                                <TooltipWithText text={t("appUsers.columns.fields.cheque")} />
                              </div>

                              <FileUploadMain
                                modelName="AppUser"
                                propName="cheque"
                                onFileUpload={(files) => handleFileUpload(files, 'cheque')}
                                accept=".jpg,.jpeg,.png,.pdf"
                                initialData={item.cheque ?? null}
                                maxFileNumber={1}
                              />
                            </div>
                          )}

                          {!isFieldHidden("gstOtp") && (
                            <div className="flex flex-col">
                              <div className=" flex items-center">
                                <label
                                  htmlFor="gstOtp"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)] "
                                >
                                  {t("appUsers.columns.fields.gstOtp")}
                                </label>
                                <TooltipWithText text={t("appUsers.columns.fields.gstOtp")} />
                              </div>
                              <InputText
                                type="text"
                                id="gstOtp"
                                name="gstOtp"
                                value={item.gstOtp}
                                placeholder={t("appUsers.columns.fields.gstOtp")}
                                className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                maxLength={100}
                                onChange={(e) => handleInputChange('gstOtp', e.target.value)}
                              />
                            </div>
                          )}

                          {!isFieldHidden("isActive") && (
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <label
                                  htmlFor="isActive"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)] "
                                >
                                  {t("appUsers.columns.fields.isActive")}
                                </label>
                                <span className=" text-[var(--color-danger)] pl-2">*</span>
                                <TooltipWithText text={t("appUsers.columns.fields.isActive")} />
                              </div>
                              <div>
                                <Checkbox
                                  inputId="isActive"
                                  name="isActive"
                                  value="isActive"
                                  checked={item.isActive ?? false}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, "isActive")
                                  }
                                  className="bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                  required
                                />
                              </div>
                              {errors.isActive && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.isActive}
                                </p>
                              )}
                            </div>
                          )}

                          {!isFieldHidden("isAdmin") && (
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <label
                                  htmlFor="isAdmin"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
                                >
                                  {t("appUsers.columns.fields.isAdmin")}
                                </label>
                                <span className=" text-[var(--color-danger)] pl-2">*</span>
                                <TooltipWithText text={t("appUsers.columns.fields.isAdmin")} />
                              </div>
                              {/* <Checkbox
                                inputId="isAdmin"
                                name="isAdmin"
                                value="isAdmin"
                                checked={item.isAdmin ?? false}
                                onChange={(e) => handleCheckboxChange(e, "isAdmin")}
                                className="bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                required
                              /> */}
                              <div className="flex">
                                <div className="flex items-center px-2">
                                  <RadioButton
                                    inputId="isAdminTrue"
                                    name="isAdmin"
                                    value="true"
                                    onChange={(e) => handleRadioChange(e, "isAdmin", true)}
                                    checked={item.isAdmin === true}
                                  />
                                  <label htmlFor="isAdminTrue" className="ml-2 text-gray-700 text-sm">True</label>
                                </div>
                                <div className="flex items-center py-2">
                                  <RadioButton
                                    inputId="isAdminFalse"
                                    name="isAdmin"
                                    value="false"
                                    onChange={(e) => handleRadioChange(e, "isAdmin", true)}
                                    checked={item.isAdmin === false}
                                  />
                                  <label htmlFor="isAdminFalse" className="ml-2 text-gray-700 text-sm">False</label>
                                </div>
                              </div>
                              {errors.isAdmin && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.isAdmin}
                                </p>
                              )}
                            </div>
                          )}

                          {!isFieldHidden("hasImpersonateAccess") && (
                            <div className="flex flex-col">
                              <div className=" flex items-center">
                                <label
                                  htmlFor="hasImpersonateAccess"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
                                >
                                  {t("appUsers.columns.fields.hasImpersonateAccess")}
                                </label>
                                <TooltipWithText text={t("appUsers.columns.fields.hasImpersonateAccess")} />
                              </div>
                              <div className="">
                                <Checkbox
                                  inputId="hasImpersonateAccess"
                                  name="hasImpersonateAccess"
                                  value="hasImpersonateAccess"
                                  checked={item.hasImpersonateAccess ?? false}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, "hasImpersonateAccess")
                                  }
                                  className="bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                />
                              </div>
                            </div>
                          )}

                          {!isFieldHidden("photoAttachment") && (
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <label
                                  htmlFor="photoAttachment"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
                                >
                                  {t("appUsers.columns.fields.photoAttachment")}
                                </label>
                                <TooltipWithText text={t("appUsers.columns.fields.photoAttachment")} />
                              </div>
                              <FileUploadMain
                                modelName="AppUser"
                                propName="photoAttachment"
                                onFileUpload={(files) => handleFileUpload(files, 'photoAttachment')}
                                accept=".jpg,.jpeg,.png,.pdf"
                                initialData={item.photoAttachment ?? null}
                                maxFileNumber={2}
                              />
                            </div>
                          )}

                          {!isFieldHidden("role") && (
                            <div className="flex flex-col">
                              <div className=" flex items-center">
                                <label
                                  htmlFor="role"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)] "
                                >
                                  {t("appUsers.columns.fields.role")}
                                </label>
                                <span className=" text-[var(--color-danger)] pl-2">*</span>
                                <TooltipWithText text={t("appUsers.columns.fields.role")} />
                              </div>
                              <Dropdown
                                id="role"
                                name="role"
                                value={selectedRole}
                                placeholder={t("appUsers.columns.fields.role")}
                                options={listRole}
                                optionLabel="name"
                                onChange={(e: DropdownChangeEvent) => { handleDropdownChange(e, "role"); setSelectedRole(e.value) }}
                                filter
                                className="dropdowndark text-sm w-full lg:w-20rem flex items-center h-[40px]  bg-[var(--color-white)] text-[var(--color-dark)] "
                                required
                                checkmark={true}
                                highlightOnSelect={false}
                                appendTo="self"
                              />
                              {errors.role && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.role}
                                </p>
                              )}
                            </div>
                          )}

                          {!isFieldHidden("publish") && (
                            <div className="flex flex-col">
                              <div className=" flex items-center">
                                <label
                                  htmlFor="publish"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]  "
                                >
                                  {t("appUsers.columns.fields.publish")}
                                </label>
                                <span className=" text-[var(--color-danger)] pl-2">*</span>
                                <TooltipWithText text={t("appUsers.columns.fields.publish")} />
                              </div>
                              <Dropdown
                                id="publish"
                                name="publish"
                                value={selectedPublish}
                                placeholder={t("appUsers.columns.fields.publish")}
                                options={listPublish}
                                optionLabel="name"
                                onChange={(e: DropdownChangeEvent) => { handleDropdownChange(e, "publish"); setSelectedPublish(e.value) }}
                                filter
                                checkmark={true}
                                highlightOnSelect={false}
                                className="dropdowndark text-sm w-full lg:w-20rem flex items-center h-[40px]  bg-[var(--color-white)] text-[var(--color-dark)] "
                                required
                                appendTo="self"
                              />
                              {errors.publish && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.publish}
                                </p>
                              )}
                            </div>
                          )}

                          {!isFieldHidden("lastLogin") && (
                            <div className="flex flex-col">
                              <div className=" flex items-center">
                                <label
                                  htmlFor="lastLogin"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)] "
                                >
                                  {t("appUsers.columns.fields.lastLogin")}
                                </label>
                                <TooltipWithText text={t("appUsers.columns.fields.lastLogin")} />
                              </div>
                              <Calendar
                                id="lastLogin"
                                dateFormat="dd-mm-yy"
                                value={item.lastLogin ? new Date(item.lastLogin) : null}
                                yearNavigator
                                monthNavigator
                                yearRange="1920:2040"
                                onChange={(e) => handleInputChange('lastLogin', e.value ? formatDate(e.value) : '')}
                                showIcon
                                placeholder={t("appUsers.columns.fields.lastLogin")}
                                className="calendardark text-sm rounded-md py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                              />
                              {/* <Calendar
                                id="lastLogin"
                                dateFormat="mm-dd-yy"
                                value={calendarLastLogin}
                                yearNavigator
                                monthNavigator
                                yearRange="1920:2040"
                                onChange={(e) => {
                                  const value = e.value;
                                  handleInputChange('lastLogin', value ? formatDate(value) : '');
                                  setCalendarLastLogin(value ? new Date(value) : null);
                                }}
                                onClearButtonClick={onClearDate}
                                showIcon
                                showButtonBar
                                placeholder={t("appUsers.columns.fields.lastLogin")}
                                className="calendardark text-sm rounded-md py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                              /> */}
                              {errors.lastLogin && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.lastLogin}
                                </p>
                              )}
                            </div>
                          )}

                          {!isFieldHidden("defaultLanguage") && (
                            <div className="flex flex-col">
                              <div className=" flex items-center">
                                <label
                                  htmlFor="defaultLanguage"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)] "
                                >
                                  {t("appUsers.columns.fields.defaultLanguage")}
                                </label>
                                <TooltipWithText text={t("appUsers.columns.fields.defaultLanguage")} />
                              </div>
                              <InputText
                                type="text"
                                id="defaultLanguage"
                                name="defaultLanguage"
                                value={item.defaultLanguage}
                                placeholder={t("appUsers.columns.fields.defaultLanguage")}
                                className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                maxLength={10}
                                onChange={(e) => handleInputChange('defaultLanguage', e.target.value)}
                              />
                              {errors.defaultLanguage && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.defaultLanguage}
                                </p>
                              )}
                            </div>
                          )}

                          {!isFieldHidden("isPremiumUser") && (
                            <div className="flex flex-col">
                              <div className=" flex items-center">
                                <label
                                  htmlFor="isPremiumUser"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)] "
                                >
                                  {t("appUsers.columns.fields.isPremiumUser")}
                                </label>
                                <TooltipWithText text="IsPremiumUser" />
                              </div>
                              <div className="">
                                <Checkbox
                                  inputId="isPremiumUser"
                                  name="isPremiumUser"
                                  value="isPremiumUser"
                                  checked={item.isPremiumUser ?? false}
                                  onChange={(e) =>
                                    handleCheckboxChange(e, "isPremiumUser")
                                  }
                                  className="bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                />
                              </div>
                            </div>
                          )}

                          {!isFieldHidden("totalPlot") && (
                            <div className="flex flex-col">
                              <div className=" flex items-center">
                                <label
                                  htmlFor="totalPlot"
                                  className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)] "
                                >
                                  {t("appUsers.columns.fields.totalPlot")}
                                </label>
                                <TooltipWithText text={t("appUsers.columns.fields.totalPlot")} />
                              </div>
                              <InputText
                                type="text"
                                id="totalPlot"
                                name="totalPlot"
                                value={item.totalPlot?.toString() ?? ''}
                                placeholder={t("appUsers.columns.fields.totalPlot")}
                                className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"
                                onChange={(e) => handleInputChange('totalPlot', e.target.value)}
                              />
                              {errors.totalPlot && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.totalPlot}
                                </p>
                              )}
                            </div>
                          )}

                          {!isFieldHidden("reportedTo") && (
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <label htmlFor={t("appUsers.columns.fields.reportedTo")} className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]">
                                  {t("appUsers.columns.fields.reportedTo")}
                                </label>
                                <span className=" text-[var(--color-danger)] pl-2">*</span>
                                <TooltipWithText text={t("appUsers.columns.fields.reportedTo")} />
                              </div>
                              <MultiSelect
                                name="reportedTo"
                                id="reportedTo"
                                value={selectedReportedTo}
                                options={reportedToList}
                                onChange={(e) => handleMultiSelectChange(e, 'reportedTo', setSelectedReportedTo)}
                                optionLabel="name"
                                filter
                                placeholder={t("appUsers.columns.fields.reportedTo")}
                                className="p-multiselect text-sm w-full lg:w-20rem flex items-center h-[40px] border bg-[var(--color-white)] text-[var(--color-dark)] border-[var(--color-gray)] rounded-md shadow-sm"
                                data-name="reportedTo"
                                data-required="true"
                              />
                              {errors.reportedTo && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.reportedTo}
                                </p>
                              )}
                            </div>
                          )}

                          {!isFieldHidden("reportedBy") && (
                            <div className="flex flex-col">
                              <div className="flex items-center">
                                <label htmlFor={t("appUsers.columns.fields.reportedBy")} className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]">
                                  {t("appUsers.columns.fields.reportedBy")}
                                </label>
                                <span className="text-[var(--color-danger)] pl-2">*</span>
                                <TooltipWithText text={t("appUsers.columns.fields.reportedBy")} />
                              </div>
                              <Dropdown
                                id="reportedBy"
                                name="reportedBy"
                                value={selectedReportedBy}
                                placeholder={t("appUsers.columns.fields.reportedBy")}
                                options={reportedByList}
                                optionLabel="name"
                                optionValue="id"
                                onChange={(e: DropdownChangeEvent) => { handleDropdownChange(e, "reportedBy"); setSelectedReportedBy(e.value); }}
                                filter
                                className="dropdowndark text-sm w-full lg:w-20rem flex items-center h-[40px] bg-[var(--color-white)] text-[var(--color-dark)]"
                                checkmark={true}
                                highlightOnSelect={false}
                                appendTo="self"
                                required
                              />
                              {errors.reportedBy && (
                                <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                  {errors.reportedBy}
                                </p>
                              )}
                            </div>
                          )}

                          <div className="flex flex-col">
                            <div className="flex items-center">
                              <label
                                htmlFor="gender"
                                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
                              >
                                Gender
                              </label>
                              <span className="text-[var(--color-danger)] pl-2">*</span>
                              <TooltipWithText text="Gender" />
                            </div>
                            <div className='flex'>
                              <div className="flex items-center px-2">
                                <RadioButton
                                  inputId="genderMale"
                                  name="gender"
                                  value="Male"
                                  onChange={(e) => handleRadioChange(e, "gender")}
                                  checked={item.gender === "Male"}
                                />
                                <label htmlFor="genderMale" className="ml-2 text-gray-700 text-sm">Male</label>
                              </div>
                              <div className="flex items-center py-2">
                                <RadioButton
                                  inputId="genderFemale"
                                  name="gender"
                                  value="Female"
                                  onChange={(e) => handleRadioChange(e, "gender")}
                                  checked={item.gender === "Female"}
                                />
                                <label htmlFor="genderFemale" className="ml-2 text-gray-700 text-sm">Female</label>
                              </div>
                            </div>
                            {errors.gender && (
                              <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                                {errors.gender}
                              </p>
                            )}

                          </div>
                        </div>
                      </div>
                    </StepperPanel>
                  </Stepper>
                </div>
              </form>
            </div>

            <div className="fixed bottom-0 z-auto  shadow-lg border-t border-[var(--color-border)] bg-[var(--color-white)] available-width">
              <div className="flex gap-2 px-3 button-container">
                {stepNo > 0 && (
                  <Button
                    type="button"
                    className="bg-[#f9fafb] rounded-md p-2 w-[100px] text-[var(--color-primary)] bg-[var(--color-white)]  border-2 border-[var(--color-primary)] font-medium text-[13px] flex items-center justify-center space-x-2"
                    onClick={previous}
                  >
                    <IoIosArrowBack size={15} className="text-[var(--color-primary)]" />
                    <span>{t("globals.previous")}</span>
                  </Button>
                )}

                {stepNo !== headers.length - 1 && (
                  <Button
                    type="button"
                    className="bg-[var(--color-primary)] rounded-md p-2 w-[100px] text-[var(--color-white)] font-medium text-[13px] flex items-center justify-center space-x-2"
                    onClick={next}
                  >
                    <span>{t("globals.next")}</span>
                    <IoIosArrowForward size={15} className="text-[var(--color-white)]" />
                  </Button>
                )}

                {stepNo === headers.length - 1 && (
                  <Button
                    type="button"
                    className={`p-2 w-[100px] rounded-md font-medium text-[13px] flex items-center justify-center 
                      bg-[var(--color-primary)] text-white disabled:bg-[#9ca3af] disabled:text-black disabled:cursor-not-allowed`}
                    onClick={handleSubmitClick}
                  >
                    <span>{t("globals.save")}</span> <FaSave size={15} />
                  </Button>
                )}
              </div>
            </div>

            <Toast ref={toast} />
            <Dialog
              visible={showDialog}
              onHide={handleCloseDialog}
              className="w-[350px] rounded-xl shadow-lg"
            >
              <div className="flex flex-col items-center p-2 space-y-4">
                <Image
                  src={successImg}
                  alt="Record Deleted Successfully"
                  className="h-[100px] w-[100px] lg:h-[150px] lg:w-[150px] object-cover rounded-full border-4 border-emerald-500 shadow-md"
                />
                <div className="text-center">
                  <p className="text-lg font-semibold text-gray-800">{dialogMessage}</p>
                </div>
              </div>
            </Dialog>
          </>
        )}
      </div>
    </div>
  )
}
