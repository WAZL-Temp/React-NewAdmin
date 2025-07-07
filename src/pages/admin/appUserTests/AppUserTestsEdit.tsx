import { useEffect, useRef, useState } from 'react'
import successImg from '../../../assets/images/success.gif'
import { BsArrowLeft, Button, Calendar, Checkbox, Dialog, Dropdown, DropdownChangeEvent, FaSave, Image, InputText, InputTextarea, IoIosArrowBack, IoIosArrowForward, MultiSelect, MultiSelectChangeEvent, RadioButton, RadioButtonChangeEvent, Stepper, StepperPanel, StepperRefAttributes, Toast } from '../../../sharedBase/globalImports';
import { useNavigate, useParams, useTranslation } from '../../../sharedBase/globalUtils';
import { useEditPage } from '../../../hooks/useEditPage';
import { AppUserTest } from '../../../core/model/appUserTest';
import { selectDropdownEnum, selectMultiData, selectRadioEnum } from '../../../sharedBase/dropdownUtils';
import TooltipWithText from '../../../components/TooltipWithText';
import FileUploadMain from '../../../components/FileUploadMain';
import { EnumDetail } from '../../../core/model/enumdetail';
import { CustomFile } from '../../../core/model/customfile';
import { useItemQuery } from '../../../store/useItemQuery';
import { AppUserTestsService } from '../../../core/service/appUserTests.service';
import { useListQuery } from '../../../store/useListQuery';
import {getData, useFetchDataEnum } from '../../../sharedBase/lookupService';
import Loader from '../../../components/Loader';
import { appUserTestValidate } from '../../../schema/appUserTest';
import FormFieldError from '../../../components/FormFieldError';
import {AppUser} from "../../../core/model/appUser";
//<<addModelData>>
export default function AppUserTestsEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useRef<Toast>(null);
  const appUserTestSchema = appUserTestValidate(t);
  const baseModelName = "appUserTests";
const typeName= "appUserTest";
  const appUserTestService = AppUserTestsService();
  const itemQuery = useItemQuery<AppUserTest>(appUserTestService);
  const listQuery = useListQuery<AppUserTest>(appUserTestService);
  const isEditMode = Boolean(id);
  const stepperRef = useRef<StepperRefAttributes | null>(null);
  const [item, setItem] = useState<AppUserTest>(initData());
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [stepNo, setStepNo] = useState(0);

  
 const stepsData = [t("appUserTests.form_detail.fields.Step1"), t("appUserTests.form_detail.fields.Step2"), t("appUserTests.form_detail.fields.Step3"), t("appUserTests.form_detail.fields.Step4"),];
 
const [listVerifyShop, setListVerifyShop] = useState<EnumDetail[]>([]);
 const [listRole, setListRole] = useState<EnumDetail[]>([]);
 const [listPublish, setListPublish] = useState<EnumDetail[]>([]);
 const [reportedTolist, setReportedToList] = useState<AppUserTest[]>([]);
 const [reportedBylist, setReportedByList] = useState<AppUser[]>([]);
 const [listGender, setListGender] = useState<EnumDetail[]>([]);

    
const [selectedVerifyShop, setSelectedVerifyShop] = useState<string | undefined>(undefined);
 const [selectedRole, setSelectedRole] = useState<string | undefined>(undefined);
 const [selectedPublish, setSelectedPublish] = useState<string | undefined>(undefined);
 const [selectedReportedTo, setSelectedReportedTo] = useState<AppUserTest[]>([]);
 const [selectedReportedBy, setSelectedReportedBy] = useState<string | null>(null);
 const [selectedGender, setSelectedGender] = useState<string | undefined>(undefined);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [itemData, setItemData] = useState<AppUserTest>(initData());

    
const verifyShopData = useFetchDataEnum('VerifyType');
const roleData = useFetchDataEnum('RoleType');
const publishData = useFetchDataEnum('PublishType');
const genderData = useFetchDataEnum('Gender');


  

function initData(): AppUserTest {
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
		state: '',
		district: '',
		address: '',
		addressLine: '',
		verifyShop: '',
		verifyShopLabel: '',
		gst: '',
		gstCertificate: '',
		photoShopFront: '',
		visitingCard: '',
		cheque: '',
		gstOtp: '',
		isActive: false,
		isAdmin: false,
		hasImpersonateAccess: false,
		photoAttachment: '',
		role: '',
		roleLabel: '',
		publish: '',
		publishLabel: '',
		importDataId: undefined,
		lastLogin: undefined,
		defaultLanguage: '',
		isPremiumUser: false,
		totalPlot: undefined,
		reportedTo: '',
		reportedToName: '',
		reportedBy: '',
		reportedByName: '',
		gender: '',
		genderLabel: '',
		createDate: undefined,
		updateDate: undefined,
		deleteDate: undefined,
		createById: undefined,
		updateById: undefined,
		deleteById: undefined,
		isDelete: false,
	};
}


 const { showDialog, setShowDialog, isFieldHidden, handleCloseDialog, formatDate, removeEmptyFields, prepareObject }
    = useEditPage<AppUserTest>({
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
        const preparedData = prepareObject<AppUserTest>(data, initData());
        setItem(preparedData);
      }
    };
    fetchData();
  }, [isEditMode, prepareObject, id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        

 
 
     const listReportedTo = await getData(appUserTestService);
        setReportedToList(listReportedTo);
        if (itemData.reportedTo) {
          const arrList = itemData.reportedTo.split(",");
          const selectedList = listReportedTo.filter((a: AppUserTest) =>
            arrList.includes("" + a.id)
          );
          if (selectedList.length) {
            setSelectedReportedTo(selectedList);
          }
        }
     const listReportedBy = await getData(appUserTestService);
    const options = listReportedBy.map((item) => ({
          ...item, id: item.id?.toString()
        }));
        setReportedByList(options);
        if (itemData.reportedBy) {
          setSelectedReportedBy(itemData.reportedBy);
        }
 

      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [itemData]);

   useEffect(() => {
    const bindDropDownList = async () => {
    
setListVerifyShop(verifyShopData?.data);
 setListRole(roleData?.data);
 setListPublish(publishData?.data);
 setListGender(genderData?.data);

      if (!itemData) return;

       
    if (itemData?.verifyShop) {
        const selectedList = verifyShopData?.data.filter(
          (a) => a.value === itemData?.verifyShop
        );
        if (selectedList.length) {
          setSelectedVerifyShop(selectedList[0].value);
        }
      }
     if (itemData?.role) {
        const selectedList = roleData?.data.filter(
          (a) => a.value === itemData?.role
        );
        if (selectedList.length) {
          setSelectedRole(selectedList[0].value);
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
 
 
     if (itemData?.gender) {
        const selectedList = genderData?.data.filter(
          (a) => a.value === itemData?.gender
        );
        if (selectedList.length) {
          setSelectedGender(selectedList[0].value);
        }
      }     
    };

    bindDropDownList();
  }, [itemData, 
verifyShopData?.data, roleData?.data, publishData?.data, genderData?.data
  ]);

  const handleBack = () => {
    navigate("/appUserTests");
  };
  const handleInputChange = (field: string, value: string) => {
    setItem((prev) => ({ ...prev, [field]: value }));
    const schema = appUserTestSchema[field as keyof typeof appUserTestSchema];

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


   const handleCheckboxChange = (e: { checked?: boolean }, key: string) => {
    const value = e.checked ?? false;

    setItem((prev) => ({
      ...prev,
      [key]: value,
    }));

    const schema = appUserTestSchema[key as keyof typeof appUserTestSchema];
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

  const handleFileUpload = (files: CustomFile[], inputName: string) => {
    setItem(prevData => ({
      ...prevData,
      [inputName]: JSON.stringify(files)
    }));
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
        const schema = appUserTestSchema[fieldName as keyof typeof appUserTestSchema];
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
        const schema = appUserTestSchema[fieldName as keyof typeof appUserTestSchema];

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
    if (stepNo <= stepsData?.length) {
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
      const schema = appUserTestSchema[controlName as keyof typeof appUserTestSchema];

      if (schema) {
        const result = schema.safeParse(value);
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
        ...item
      };

      const cleanedPayload = removeEmptyFields(payload);
      let updatedItem;

      if (itemData?.id) {
        updatedItem = { ...cleanedPayload, id: parseInt(itemData?.id.toString(), 10) };
        await itemQuery.updateItem(updatedItem);
        setDialogMessage(t('globals.updateDialogMsg', { model: 'AppUserTest' }));
      } else {
        await itemQuery.addItem(cleanedPayload);
        setDialogMessage(t('globals.addDialogMsg', { model: 'AppUserTest' }));
      }

      setItem(initData());
      await listQuery?.load();
      setShowDialog(true);
    } catch (error) {
      console.error("Error:", error);
      if (itemData?.id) {
        alert("Failed to update AppUserTest. Please try again later.");
      } else {
        alert("Failed to add AppUserTest. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
    const handleMultiSelectChange = (e: MultiSelectChangeEvent, fieldName: string, setFieldValue: React.Dispatch<React.SetStateAction<AppUserTest[]>>) => {
    const selectedValues = e.value as AppUserTest[];
    setFieldValue(selectedValues);

    const inputElement = document.querySelector(`[name="${fieldName}"]`) as HTMLElement;
    const isRequired = inputElement?.hasAttribute('required') || inputElement?.getAttribute('aria-required') === 'true';
    const selectedIds = selectedValues.map((user) => user.id).filter((id) => id !== undefined).join(',');

    if (isRequired) {
      const schema = appUserTestSchema[fieldName as keyof typeof appUserTestSchema];
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
    const updatedValue = selectRadioEnum(e, controlName, item, setItem, isBoolean);

    setItem((prev) => ({
      ...prev,
      [controlName]: updatedValue,
    }));

    const schema = appUserTestSchema[controlName as keyof typeof appUserTestSchema];

    if (schema) {
      const result = schema.safeParse(updatedValue);

      if (result.success) {
        setErrors((prev) => ({ ...prev, [controlName]: '' }));
      } else {
        setErrors((prev) => ({
          ...prev,
          [controlName]: result.error.errors[0].message,
        }));
      }
    }
  };
  

  return (
    <div className='relative h-screen flex flex-col'>
      <div className="flex flex-col overflow-y-auto overflow-x-hidden">
        <div className="flex items-center  p-1 border-b topbar border-[var(--color-border)] shadow-md bg-[var(--color-white)] text-[var(--color-dark)] w-full fixed  top-30 z-20">
          <Button
            className="backBtn cursor-pointer flex items-center"
            onClick={handleBack}
          >
            <BsArrowLeft className="h-6 w-6 cursor-pointer mx-3" />
          </Button>
          <h1 className=" capitalize text-[14px] font-semibold ">{t("globals.backto")} {t("appUserTests.form_detail.fields.modelname")}</h1>
        </div>
{itemQuery.isLoading ? (
          <Loader />
        ) : (
          <>
        <div className="flex flex-col  border-none bg-[var(--color-white)] text-[var(--color-dark)] mb-10 sm:mb-20">
          <form id="myForm" onSubmit={handleSubmit} noValidate>
            <div className="w-full bg-[var(--color-white)] text-[var(--color-dark)]">
              <Stepper ref={stepperRef} headerPosition="top">
                <StepperPanel header={stepsData[0]}>
    <div ref={(el) => { stepRefs.current[0] = el; }} className="p-2 mt-3 lg:mt-10 mb-12 md:mb-0 lg:mb-0 bg-[var(--color-white)] text-[var(--color-dark)]">
      <div className="user-grid pb-4">
                {!isFieldHidden("name") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="name"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.name")}
              </label>
              <span className=" text-[var(--color-danger)] pl-2 ">*</span>
              <TooltipWithText text={t("appUserTests.columns.fields.name")} />
            </div>

            <InputText type='text' id='name' name='name'  onChange={(e) => handleInputChange('name', e.target.value)} required minLength={2} maxLength={100} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"    value={item.name} placeholder={t("appUserTests.columns.fields.name")}/>
            <FormFieldError field="name" errors={errors} />
          </div>
        )}
        {!isFieldHidden("firstName") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="firstName"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.firstName")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.firstName")} />
            </div>

            <InputText type='text' id='firstName' name='firstName'  onChange={(e) => handleInputChange('firstName', e.target.value)} minLength={2} maxLength={100} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"    value={item.firstName} placeholder={t("appUserTests.columns.fields.firstName")}/>
            <FormFieldError field="firstName" errors={errors} />
          </div>
        )}
        {!isFieldHidden("lastName") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="lastName"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.lastName")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.lastName")} />
            </div>

            <InputText type='text' id='lastName' name='lastName'  onChange={(e) => handleInputChange('lastName', e.target.value)} minLength={2} maxLength={100} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"    value={item.lastName} placeholder={t("appUserTests.columns.fields.lastName")}/>
            <FormFieldError field="lastName" errors={errors} />
          </div>
        )}
        {!isFieldHidden("mobile") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="mobile"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.mobile")}
              </label>
              <span className=" text-[var(--color-danger)] pl-2 ">*</span>
              <TooltipWithText text={t("appUserTests.columns.fields.mobile")} />
            </div>

            <InputText type='text' id='mobile' name='mobile'  onChange={(e) => handleInputChange('mobile', e.target.value)} required minLength={2} maxLength={100} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"    value={item.mobile} placeholder={t("appUserTests.columns.fields.mobile")}/>
            <FormFieldError field="mobile" errors={errors} />
          </div>
        )}
        {!isFieldHidden("mobileVerified") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="mobileVerified"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.mobileVerified")}
              </label>
              <span className=" text-[var(--color-danger)] pl-2 ">*</span>
              <TooltipWithText text={t("appUserTests.columns.fields.mobileVerified")} />
            </div>

            <Checkbox id='mobileVerified' required inputId='mobileVerified' name='mobileVerified' value='mobileVerified' checked={item.mobileVerified ?? false} onChange={(e) => handleCheckboxChange(e, 'mobileVerified')} className="bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"/>
            <FormFieldError field="mobileVerified" errors={errors} />
          </div>
        )}

      </div>
    </div>
  </StepperPanel>
  <StepperPanel header={stepsData[1]}>
    <div ref={(el) => { stepRefs.current[1] = el; }} className="p-2 mt-3 lg:mt-10 mb-12 md:mb-0 lg:mb-0 bg-[var(--color-white)] text-[var(--color-dark)]">
      <div className="user-grid pb-4">
                {!isFieldHidden("emailId") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="emailId"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.emailId")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.emailId")} />
            </div>

            <InputText type='text' id='emailId' name='emailId'  onChange={(e) => handleInputChange('emailId', e.target.value)} maxLength={100} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"    value={item.emailId} placeholder={t("appUserTests.columns.fields.emailId")}/>
            <FormFieldError field="emailId" errors={errors} />
          </div>
        )}
        {!isFieldHidden("emailVerified") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="emailVerified"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.emailVerified")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.emailVerified")} />
            </div>

            <Checkbox id='emailVerified'  inputId='emailVerified' name='emailVerified' value='emailVerified' checked={item.emailVerified ?? false} onChange={(e) => handleCheckboxChange(e, 'emailVerified')} className="bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"/>
            <FormFieldError field="emailVerified" errors={errors} />
          </div>
        )}
        {!isFieldHidden("shopName") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="shopName"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.shopName")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.shopName")} />
            </div>

            <InputText type='text' id='shopName' name='shopName'  onChange={(e) => handleInputChange('shopName', e.target.value)} minLength={2} maxLength={200} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"    value={item.shopName} placeholder={t("appUserTests.columns.fields.shopName")}/>
            <FormFieldError field="shopName" errors={errors} />
          </div>
        )}
        {!isFieldHidden("password") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="password"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.password")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.password")} />
            </div>

            <InputText type='text' id='password' name='password'  onChange={(e) => handleInputChange('password', e.target.value)} minLength={2} maxLength={100} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"    value={item.password} placeholder={t("appUserTests.columns.fields.password")}/>
            <FormFieldError field="password" errors={errors} />
          </div>
        )}

      </div>
    </div>
  </StepperPanel>
  <StepperPanel header={stepsData[2]}>
    <div ref={(el) => { stepRefs.current[2] = el; }} className="p-2 mt-3 lg:mt-10 mb-12 md:mb-0 lg:mb-0 bg-[var(--color-white)] text-[var(--color-dark)]">
      <div className="user-grid pb-4">
                {!isFieldHidden("pincode") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="pincode"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.pincode")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.pincode")} />
            </div>

            <InputText type='text' id='pincode' name='pincode'  onChange={(e) => handleInputChange('pincode', e.target.value)} maxLength={6} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"    value={item.pincode} placeholder={t("appUserTests.columns.fields.pincode")}/>
            <FormFieldError field="pincode" errors={errors} />
          </div>
        )}
        {!isFieldHidden("state") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="state"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.state")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.state")} />
            </div>

            <InputText type='text' id='state' name='state'  onChange={(e) => handleInputChange('state', e.target.value)} maxLength={100} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"    value={item.state} placeholder={t("appUserTests.columns.fields.state")}/>
            <FormFieldError field="state" errors={errors} />
          </div>
        )}
        {!isFieldHidden("district") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="district"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.district")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.district")} />
            </div>

            <InputText type='text' id='district' name='district'  onChange={(e) => handleInputChange('district', e.target.value)} maxLength={100} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"    value={item.district} placeholder={t("appUserTests.columns.fields.district")}/>
            <FormFieldError field="district" errors={errors} />
          </div>
        )}
        {!isFieldHidden("address") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="address"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.address")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.address")} />
            </div>

            <InputTextarea id='address' name='address'  onChange={(e) => handleInputChange('address', e.target.value)} minLength={2} maxLength={10000}className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)]  border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"  value={item.address} placeholder={t("appUserTests.columns.fields.address")}/>
            <FormFieldError field="address" errors={errors} />
          </div>
        )}
        {!isFieldHidden("addressLine") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="addressLine"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.addressLine")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.addressLine")} />
            </div>

            <InputTextarea id='addressLine' name='addressLine'  onChange={(e) => handleInputChange('addressLine', e.target.value)} minLength={2} maxLength={10000}className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)]  border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"  value={item.addressLine} placeholder={t("appUserTests.columns.fields.addressLine")}/>
            <FormFieldError field="addressLine" errors={errors} />
          </div>
        )}

      </div>
    </div>
  </StepperPanel>
  <StepperPanel header={stepsData[3]}>
    <div ref={(el) => { stepRefs.current[3] = el; }} className="p-2 mt-3 lg:mt-10 mb-12 md:mb-0 lg:mb-0 bg-[var(--color-white)] text-[var(--color-dark)]">
      <div className="user-grid pb-4">
                {!isFieldHidden("verifyShop") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="verifyShop"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.verifyShop")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.verifyShop")} />
            </div>

            <Dropdown id='verifyShop' name='verifyShop' value={selectedVerifyShop} minLength={2} maxLength={100} onChange={(e: DropdownChangeEvent) => { handleDropdownChange(e, "verifyShop"); setSelectedVerifyShop(e.value) }} options={listVerifyShop} filter optionLabel='name'  checkmark={true}  highlightOnSelect={false}  appendTo="self"  placeholder={t("appUserTests.columns.fields.verifyShop")}  className="dropdowndark text-sm w-full lg:w-20rem flex items-center h-[40px]  bg-[var(--color-white)] text-[var(--color-dark)]"  />
            <FormFieldError field="verifyShop" errors={errors} />
          </div>
        )}
        {!isFieldHidden("gst") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="gst"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.gst")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.gst")} />
            </div>

            <InputText type='text' id='gst' name='gst'  onChange={(e) => handleInputChange('gst', e.target.value)} minLength={2} maxLength={100} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"    value={item.gst} placeholder={t("appUserTests.columns.fields.gst")}/>
            <FormFieldError field="gst" errors={errors} />
          </div>
        )}
        {!isFieldHidden("gstCertificate") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="gstCertificate"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.gstCertificate")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.gstCertificate")} />
            </div>

            <FileUploadMain modelName='AppUserTest' propName="gstCertificate" onFileUpload={(files) => handleFileUpload(files, 'gstCertificate')} accept=".jpg,.jpeg,.png,.pdf" initialData={item.gstCertificate ?? null}  error={errors.gstCertificate} maxFileNumber={1}/>
            <FormFieldError field="gstCertificate" errors={errors} />
          </div>
        )}
        {!isFieldHidden("photoShopFront") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="photoShopFront"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.photoShopFront")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.photoShopFront")} />
            </div>

            <FileUploadMain modelName='AppUserTest' propName="photoShopFront" onFileUpload={(files) => handleFileUpload(files, 'photoShopFront')} accept=".jpg,.jpeg,.png,.pdf" initialData={item.photoShopFront ?? null}  error={errors.photoShopFront} maxFileNumber={1}/>
            <FormFieldError field="photoShopFront" errors={errors} />
          </div>
        )}
        {!isFieldHidden("visitingCard") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="visitingCard"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.visitingCard")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.visitingCard")} />
            </div>

            <FileUploadMain modelName='AppUserTest' propName="visitingCard" onFileUpload={(files) => handleFileUpload(files, 'visitingCard')} accept=".jpg,.jpeg,.png,.pdf" initialData={item.visitingCard ?? null}  error={errors.visitingCard} maxFileNumber={1}/>
            <FormFieldError field="visitingCard" errors={errors} />
          </div>
        )}
        {!isFieldHidden("cheque") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="cheque"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.cheque")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.cheque")} />
            </div>

            <FileUploadMain modelName='AppUserTest' propName="cheque" onFileUpload={(files) => handleFileUpload(files, 'cheque')} accept=".jpg,.jpeg,.png,.pdf" initialData={item.cheque ?? null}  error={errors.cheque} maxFileNumber={1}/>
            <FormFieldError field="cheque" errors={errors} />
          </div>
        )}
        {!isFieldHidden("gstOtp") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="gstOtp"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.gstOtp")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.gstOtp")} />
            </div>

            <InputText type='text' id='gstOtp' name='gstOtp'  onChange={(e) => handleInputChange('gstOtp', e.target.value)} maxLength={100} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"    value={item.gstOtp} placeholder={t("appUserTests.columns.fields.gstOtp")}/>
            <FormFieldError field="gstOtp" errors={errors} />
          </div>
        )}
        {!isFieldHidden("isActive") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="isActive"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.isActive")}
              </label>
              <span className=" text-[var(--color-danger)] pl-2 ">*</span>
              <TooltipWithText text={t("appUserTests.columns.fields.isActive")} />
            </div>

            <Checkbox id='isActive' required inputId='isActive' name='isActive' value='isActive' checked={item.isActive ?? false} onChange={(e) => handleCheckboxChange(e, 'isActive')} className="bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"/>
            <FormFieldError field="isActive" errors={errors} />
          </div>
        )}
        {!isFieldHidden("isAdmin") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="isAdmin"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.isAdmin")}
              </label>
              <span className=" text-[var(--color-danger)] pl-2 ">*</span>
              <TooltipWithText text={t("appUserTests.columns.fields.isAdmin")} />
            </div>

            <Checkbox id='isAdmin' required inputId='isAdmin' name='isAdmin' value='isAdmin' checked={item.isAdmin ?? false} onChange={(e) => handleCheckboxChange(e, 'isAdmin')} className="bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"/>
            <FormFieldError field="isAdmin" errors={errors} />
          </div>
        )}
        {!isFieldHidden("hasImpersonateAccess") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="hasImpersonateAccess"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.hasImpersonateAccess")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.hasImpersonateAccess")} />
            </div>

            <Checkbox id='hasImpersonateAccess'  inputId='hasImpersonateAccess' name='hasImpersonateAccess' value='hasImpersonateAccess' checked={item.hasImpersonateAccess ?? false} onChange={(e) => handleCheckboxChange(e, 'hasImpersonateAccess')} className="bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"/>
            <FormFieldError field="hasImpersonateAccess" errors={errors} />
          </div>
        )}
        {!isFieldHidden("photoAttachment") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="photoAttachment"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.photoAttachment")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.photoAttachment")} />
            </div>

            <FileUploadMain modelName='AppUserTest' propName="photoAttachment" onFileUpload={(files) => handleFileUpload(files, 'photoAttachment')} accept=".jpg,.jpeg,.png,.pdf" initialData={item.photoAttachment ?? null}  error={errors.photoAttachment} maxFileNumber={1}/>
            <FormFieldError field="photoAttachment" errors={errors} />
          </div>
        )}
        {!isFieldHidden("role") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="role"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.role")}
              </label>
              <span className=" text-[var(--color-danger)] pl-2 ">*</span>
              <TooltipWithText text={t("appUserTests.columns.fields.role")} />
            </div>

            <Dropdown id='role' name='role' value={selectedRole} required minLength={2} maxLength={100} onChange={(e: DropdownChangeEvent) => { handleDropdownChange(e, "role"); setSelectedRole(e.value) }} options={listRole} filter optionLabel='name'  checkmark={true}  highlightOnSelect={false}  appendTo="self"  placeholder={t("appUserTests.columns.fields.role")}  className="dropdowndark text-sm w-full lg:w-20rem flex items-center h-[40px]  bg-[var(--color-white)] text-[var(--color-dark)]"  />
            <FormFieldError field="role" errors={errors} />
          </div>
        )}
        {!isFieldHidden("publish") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="publish"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.publish")}
              </label>
              <span className=" text-[var(--color-danger)] pl-2 ">*</span>
              <TooltipWithText text={t("appUserTests.columns.fields.publish")} />
            </div>

            <Dropdown id='publish' name='publish' value={selectedPublish} required minLength={2} maxLength={100} onChange={(e: DropdownChangeEvent) => { handleDropdownChange(e, "publish"); setSelectedPublish(e.value) }} options={listPublish} filter optionLabel='name'  checkmark={true}  highlightOnSelect={false}  appendTo="self"  placeholder={t("appUserTests.columns.fields.publish")}  className="dropdowndark text-sm w-full lg:w-20rem flex items-center h-[40px]  bg-[var(--color-white)] text-[var(--color-dark)]"  />
            <FormFieldError field="publish" errors={errors} />
          </div>
        )}
        {!isFieldHidden("lastLogin") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="lastLogin"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.lastLogin")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.lastLogin")} />
            </div>

             <Calendar id='lastLogin' dateFormat="dd-mm-yy" value={item.lastLogin? new Date(item.lastLogin) : null } yearNavigator monthNavigator yearRange="1920:2040" onChange={(e) => handleInputChange('lastLogin', e.value ? formatDate(e.value) : '')}  placeholder={t("appUserTests.columns.fields.lastLogin")} showIcon className="calendardark text-sm rounded-md py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
            <FormFieldError field="lastLogin" errors={errors} />
          </div>
        )}
        {!isFieldHidden("defaultLanguage") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="defaultLanguage"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.defaultLanguage")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.defaultLanguage")} />
            </div>

            <InputText type='text' id='defaultLanguage' name='defaultLanguage'  onChange={(e) => handleInputChange('defaultLanguage', e.target.value)} maxLength={10} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"    value={item.defaultLanguage} placeholder={t("appUserTests.columns.fields.defaultLanguage")}/>
            <FormFieldError field="defaultLanguage" errors={errors} />
          </div>
        )}
        {!isFieldHidden("isPremiumUser") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="isPremiumUser"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.isPremiumUser")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.isPremiumUser")} />
            </div>

            <Checkbox id='isPremiumUser'  inputId='isPremiumUser' name='isPremiumUser' value='isPremiumUser' checked={item.isPremiumUser ?? false} onChange={(e) => handleCheckboxChange(e, 'isPremiumUser')} className="bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"/>
            <FormFieldError field="isPremiumUser" errors={errors} />
          </div>
        )}
        {!isFieldHidden("totalPlot") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="totalPlot"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.totalPlot")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.totalPlot")} />
            </div>

            <InputText type='text' id='totalPlot' name='totalPlot'  onChange={(e) => handleInputChange('totalPlot', e.target.value)}  className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"    value={item.totalPlot?.toString() ?? ''} placeholder={t("appUserTests.columns.fields.totalPlot")}/>
            <FormFieldError field="totalPlot" errors={errors} />
          </div>
        )}
        {!isFieldHidden("reportedTo") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="reportedTo"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.reportedTo")}
              </label>
              <span className=" text-[var(--color-danger)] pl-2 ">*</span>
              <TooltipWithText text={t("appUserTests.columns.fields.reportedTo")} />
            </div>

            <MultiSelect id='reportedTo' name='reportedTo' value={selectedReportedTo} options={reportedTolist} optionLabel='name' onChange={(e) => handleMultiSelectChange(e, 'reportedTo', setSelectedReportedTo)} filter placeholder={t("appUserTests.columns.fields.reportedTo")} className="p-multiselect text-sm w-full lg:w-20rem flex items-center h-[40px] border bg-[var(--color-white)] text-[var(--color-dark)] border-[var(--color-gray)] rounded-md shadow-sm"
                                data-name="reportedTo"
 data-required="true"/>
            <FormFieldError field="reportedTo" errors={errors} />
          </div>
        )}
        {!isFieldHidden("reportedBy") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="reportedBy"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.reportedBy")}
              </label>
              <span className=" text-[var(--color-danger)] pl-2 ">*</span>
              <TooltipWithText text={t("appUserTests.columns.fields.reportedBy")} />
            </div>

            <Dropdown id='reportedBy' name='reportedBy' value={selectedReportedBy} required maxLength={100} onChange={(e: DropdownChangeEvent) => { handleDropdownChange(e, "reportedBy"); setSelectedReportedBy(e.value) }} filter options={reportedBylist} optionLabel='name' optionValue="id" checkmark={true}  highlightOnSelect={false}  appendTo="self"  placeholder={t("appUserTests.columns.fields.reportedBy")} className="dropdowndark text-sm w-full lg:w-20rem flex items-center h-[40px]  bg-[var(--color-white)] text-[var(--color-dark)] " />
            <FormFieldError field="reportedBy" errors={errors} />
          </div>
        )}
        {!isFieldHidden("gender") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="gender"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.gender")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.gender")} />
            </div>

            <div className="flex flex-wrap gap-4 px-2">
                                {listGender.map((item) => (
                                  <div key={item.id} className="flex items-center space-x-2">
                                    <RadioButton
                                      inputId={`gender-${item.id}`}
                                      name="gender"
                                      value={item.value}
                                      onChange={(e) => {
                                        handleRadioChange(e, "gender");
                                        setSelectedGender(item.value);
                                      }}
                                      checked={selectedGender?.toUpperCase() === (item.value ?? '').toUpperCase()}
                                    />
                                    <label
                                      htmlFor={`gender-${item.id}`}
                                      className="text-sm text-[var(--color-dark)] capitalize"
                                    >
                                      {item.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
            <FormFieldError field="gender" errors={errors} />
          </div>
        )}

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

            {stepNo !== stepsData.length - 1 && (
              <Button
                type="button"
                className="bg-[var(--color-primary)] rounded-md p-2 w-[100px] text-[var(--color-white)] font-medium text-[13px] flex items-center justify-center space-x-2"
                onClick={next}
              >
                <span>{t("globals.next")}</span>
                <IoIosArrowForward size={15} className="text-[var(--color-white)]" />
              </Button>
            )}

            {stepNo === stepsData.length - 1 && (
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

