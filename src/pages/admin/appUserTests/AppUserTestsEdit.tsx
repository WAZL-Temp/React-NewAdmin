import { useEffect, useRef, useState } from 'react'
import successImg from '../../../assets/images/success.gif'
import { BsArrowLeft, Button, Calendar, Checkbox, Dialog, Dropdown, DropdownChangeEvent, FaSave, Image, InputText, InputTextarea, IoIosArrowBack, IoIosArrowForward, Stepper, StepperPanel, StepperRefAttributes, Toast } from '../../../sharedBase/globalImports';
import { useNavigate, useParams, useTranslation } from '../../../sharedBase/globalUtils';
import { useEditPage } from '../../../hooks/useEditPage';
import { AppUserTest } from '../../../core/model/appUserTest';
import { selectDropdownEnum } from '../../../sharedBase/dropdownUtils';
import { getGlobalSchema } from '../../../globalschema';
import TooltipWithText from '../../../components/TooltipWithText';
import FileUploadMain from '../../../components/FileUploadMain';
import { EnumDetail } from '../../../core/model/enumdetail';
import { CustomFile } from '../../../core/model/customfile';
import { useItemQuery } from '../../../store/useItemQuery';
import { AppUserTestsService } from '../../../core/service/appUserTests.service';
import { useListQuery } from '../../../store/useListQuery';
import { useFetchDataEnum } from '../../../sharedBase/lookupService';

export default function AppUserTestsEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const globalschema = getGlobalSchema(t);
  const toast = useRef<Toast>(null);
  const baseModelName = "appUserTests";
  const userService = AppUserTestsService();
  const itemQuery = useItemQuery<AppUserTest>(userService);
  const listQuery = useListQuery<AppUserTest>(userService);
  const isEditMode = Boolean(id);
  const stepperRef = useRef<StepperRefAttributes | null>(null);
  const [item, setItem] = useState<AppUserTest>(initData());
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [stepNo, setStepNo] = useState(0);

  
 const stepsData = [t("appUserTests.form_detail.fields.accessDeatails"), t("appUserTests.form_detail.fields.shopDetails"), t("appUserTests.form_detail.fields.shopAddress"), t("appUserTests.form_detail.fields.verifyShop"),];
 
const [listVerifyShop, setListVerifyShop] = useState<EnumDetail[]>([]);
 const [listRole, setListRole] = useState<EnumDetail[]>([]);
 const [listPublish, setListPublish] = useState<EnumDetail[]>([]);

    
const [selectedVerifyShop, setSelectedVerifyShop] = useState<String | undefined>(undefined);
 const [selectedRole, setSelectedRole] = useState<String | undefined>(undefined);
 const [selectedPublish, setSelectedPublish] = useState<String | undefined>(undefined);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [itemData, setItemData] = useState<AppUserTest>(initData());

    
const VerifyShopData = useFetchDataEnum("VerifyShopType");
const RoleData = useFetchDataEnum("RoleType");
const PublishData = useFetchDataEnum("PublishType");


  

function initData(): AppUserTest {
	return {
		id: undefined,
		name: "",
		firstName: "",
		lastName: "",
		mobile: "",
		mobileVerified: false,
		emailId: "",
		emailVerified: false,
		shopName: "",
		password: "",
		pincode: "",
		state: "",
		district: "",
		address: "",
		addressLine: "",
		verifyShop: "",
		verifyShopLabel: "",
		gst: "",
		gstCertificate: "",
		photoShopFront: "",
		visitingCard: "",
		cheque: "",
		gstOtp: "",
		isActive: false,
		isAdmin: false,
		hasImpersonateAccess: false,
		photoAttachment: "",
		role: "",
		roleLabel: "",
		publish: "",
		publishLabel: "",
		importDataId: undefined,
		lastLogin: undefined,
		defaultLanguage: "",
		isPremiumUser: false,
		totalPlot: undefined,
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

  
this.lookupService.getDataEnum('VerifyType').subscribe(list => {
      this.listVerifyShop = list;
      if (this.item && this.item.verifyShop) {
        const selectedList = list.filter(a => a.value === this.item.verifyShop);
        if (selectedList.length) {
            this.selectedVerifyShop = selectedList[0];
        }
      }
    });
 this.lookupService.getDataEnum('RoleType').subscribe(list => {
      this.listRole = list;
      if (this.item && this.item.role) {
        const selectedList = list.filter(a => a.value === this.item.role);
        if (selectedList.length) {
            this.selectedRole = selectedList[0];
        }
      }
    });
 this.lookupService.getDataEnum('PublishType').subscribe(list => {
      this.listPublish = list;
      if (this.item && this.item.publish) {
        const selectedList = list.filter(a => a.value === this.item.publish);
        if (selectedList.length) {
            this.selectedPublish = selectedList[0];
        }
      }
    });
 
  const handleInputChange = (field: string, value: string) => {
    setItem((prev) => ({ ...prev, [field]: value }));
    const schema = globalschema[field as keyof typeof globalschema];

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

  const handleFileUpload = (files: CustomFile[], inputName: string) => {
    setItem(prevData => ({
      ...prevData,
      [inputName]: JSON.stringify(files)
    }));
  };

  const handleBack = () => {
    navigate("/appUserTests");
  };

  const handleCheckboxChange = (e: { checked?: boolean }, key: string) => {
    const value = e.checked ?? false;

    setItem((prev) => ({
      ...prev,
      [key]: value,
    }));

    const schema = globalschema[key as keyof typeof globalschema];
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
    if (!container) return true;

    const inputs = container.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>(
      'input, select, textarea'
    );

    let hasError = false;
    const newErrors: Record<string, string> = { ...errors };

    inputs.forEach((input) => {
      const fieldName = input.name;
      const value = item[fieldName as keyof typeof item];
      const schema = globalschema[fieldName as keyof typeof globalschema];
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
        } else {
          if (isEmpty) {
            newErrors[fieldName] = 'This field is required';
            hasError = true;
          } else {
            newErrors[fieldName] = '';
          }
        }
      }

      else if (schema) {
        if (isEmpty) {
          newErrors[fieldName] = '';
        } else {
          const result = schema.safeParse(value);
          if (!result.success) {
            newErrors[fieldName] = result.error.errors[0].message;
            hasError = true;
          } else {
            newErrors[fieldName] = '';
          }
        }
      }

    });

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
      const schema = globalschema[controlName as keyof typeof globalschema];

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
        ...item,
        state: item.state || 0,
        district: item.district || 0,
        verifyShopLabel: item.verifyShop,
        roleLabel: item.role,
        publishLabel: item.publish,
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

        <div className="flex flex-col  border-none bg-[var(--color-white)] text-[var(--color-dark)] mb-10 sm:mb-20">
          <form id="myForm" onSubmit={handleSubmit} noValidate>
            <div className="w-full bg-[var(--color-white)] text-[var(--color-dark)]">
              <Stepper ref={stepperRef} headerPosition="top">
                <StepperPanel header={stepsData[1-1]}>
    <div ref={(el) => { stepRefs.current[1-1] = el; }} className="p-2 mt-3 lg:mt-10 mb-12 md:mb-0 lg:mb-0 bg-[var(--color-white)] text-[var(--color-dark)]">
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

            <InputText id='name' name='name'  onChange={(e) => handleInputChange('name', e.target.value)} required minLength={2} maxLength={100} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"  type='text'  value={item.name} placeholder={t("appUserTests.columns.fields.name")}/>
            {errors.name && (
              <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                {errors.name}
              </p>
            )}
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

            <InputText id='firstName' name='firstName'  onChange={(e) => handleInputChange('firstName', e.target.value)} minLength={2} maxLength={100} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"  type='text'  value={item.firstName} placeholder={t("appUserTests.columns.fields.firstName")}/>
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
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.lastName")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.lastName")} />
            </div>

            <InputText id='lastName' name='lastName'  onChange={(e) => handleInputChange('lastName', e.target.value)} minLength={2} maxLength={100} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"  type='text'  value={item.lastName} placeholder={t("appUserTests.columns.fields.lastName")}/>
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
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.mobile")}
              </label>
              <span className=" text-[var(--color-danger)] pl-2 ">*</span>
              <TooltipWithText text={t("appUserTests.columns.fields.mobile")} />
            </div>

            <InputText id='mobile' name='mobile'  onChange={(e) => handleInputChange('mobile', e.target.value)} required minLength={2} maxLength={100} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"  type='text'  value={item.mobile} placeholder={t("appUserTests.columns.fields.mobile")}/>
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
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.mobileVerified")}
              </label>
              <span className=" text-[var(--color-danger)] pl-2 ">*</span>
              <TooltipWithText text={t("appUserTests.columns.fields.mobileVerified")} />
            </div>

            <Checkbox inputId='mobileVerified' name='mobileVerified' value='mobileVerified' checked={item.mobileVerified ?? false} onChange={(e) => handleCheckboxChange(e, 'mobileVerified')} className="bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"/>
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
  <StepperPanel header={stepsData[2-1]}>
    <div ref={(el) => { stepRefs.current[2-1] = el; }} className="p-2 mt-3 lg:mt-10 mb-12 md:mb-0 lg:mb-0 bg-[var(--color-white)] text-[var(--color-dark)]">
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

            <InputText id='emailId' name='emailId'  onChange={(e) => handleInputChange('emailId', e.target.value)} maxLength={100} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"  type='text'  value={item.emailId} placeholder={t("appUserTests.columns.fields.emailId")}/>
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
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.emailVerified")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.emailVerified")} />
            </div>

            <Checkbox inputId='emailVerified' name='emailVerified' value='emailVerified' checked={item.emailVerified ?? false} onChange={(e) => handleCheckboxChange(e, 'emailVerified')} className="bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"/>
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
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.shopName")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.shopName")} />
            </div>

            <InputText id='shopName' name='shopName'  onChange={(e) => handleInputChange('shopName', e.target.value)} minLength={2} maxLength={200} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"  type='text'  value={item.shopName} placeholder={t("appUserTests.columns.fields.shopName")}/>
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
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.password")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.password")} />
            </div>

            <InputText id='password' name='password'  onChange={(e) => handleInputChange('password', e.target.value)} minLength={2} maxLength={100} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"  type='text'  value={item.password} placeholder={t("appUserTests.columns.fields.password")}/>
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
  <StepperPanel header={stepsData[3-1]}>
    <div ref={(el) => { stepRefs.current[3-1] = el; }} className="p-2 mt-3 lg:mt-10 mb-12 md:mb-0 lg:mb-0 bg-[var(--color-white)] text-[var(--color-dark)]">
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

            <InputText id='pincode' name='pincode'  onChange={(e) => handleInputChange('pincode', e.target.value)} maxLength={6} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"  type='text'  value={item.pincode} placeholder={t("appUserTests.columns.fields.pincode")}/>
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
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.state")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.state")} />
            </div>

            <InputText id='state' name='state'  onChange={(e) => handleInputChange('state', e.target.value)} maxLength={100} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"  type='text'  value={item.state} placeholder={t("appUserTests.columns.fields.state")}/>
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
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.district")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.district")} />
            </div>

            <InputText id='district' name='district'  onChange={(e) => handleInputChange('district', e.target.value)} maxLength={100} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"  type='text'  value={item.district} placeholder={t("appUserTests.columns.fields.district")}/>
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
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.address")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.address")} />
            </div>

            <InputTextarea id='address' name='address'  onChange={(e) => handleInputChange('address', e.target.value)} minLength={2} maxLength={10000}className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)]  border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"  value={item.address} placeholder={t("appUserTests.columns.fields.address")}/>
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
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.addressLine")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.addressLine")} />
            </div>

            <InputTextarea id='addressLine' name='addressLine'  onChange={(e) => handleInputChange('addressLine', e.target.value)} minLength={2} maxLength={10000}className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)]  border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"  value={item.addressLine} placeholder={t("appUserTests.columns.fields.addressLine")}/>
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
  <StepperPanel header={stepsData[4-1]}>
    <div ref={(el) => { stepRefs.current[4-1] = el; }} className="p-2 mt-3 lg:mt-10 mb-12 md:mb-0 lg:mb-0 bg-[var(--color-white)] text-[var(--color-dark)]">
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

            <Dropdown id='verifyShop' name='verifyShop' value={selectedVerifyShop} onChange={(e: DropdownChangeEvent) => { handleDropdownChange(e, "verifyShop"); setSelectedVerifyShop(e.value) }}  className="dropdowndark text-sm w-full lg:w-20rem flex items-center h-[40px]  bg-[var(--color-white)] text-[var(--color-dark)] dropdowndark"  />
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
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.gst")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.gst")} />
            </div>

            <InputText id='gst' name='gst'  onChange={(e) => handleInputChange('gst', e.target.value)} minLength={2} maxLength={100} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"  type='text'  value={item.gst} placeholder={t("appUserTests.columns.fields.gst")}/>
            {errors.gst && (
              <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                {errors.gst}
              </p>
            )}
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

            <FileUploadMain modelName='AppUserTest' propName="gstCertificate" onFileUpload={(files) => handleFileUpload(files, 'gstCertificate')} accept=".jpg,.jpeg,.png,.pdf" initialData={item.gstCertificate ?? null} maxFileNumber={1}/>
            {errors.gstCertificate && (
              <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                {errors.gstCertificate}
              </p>
            )}
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

            <FileUploadMain modelName='AppUserTest' propName="photoShopFront" onFileUpload={(files) => handleFileUpload(files, 'photoShopFront')} accept=".jpg,.jpeg,.png,.pdf" initialData={item.photoShopFront ?? null} maxFileNumber={1}/>
            {errors.photoShopFront && (
              <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                {errors.photoShopFront}
              </p>
            )}
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

            <FileUploadMain modelName='AppUserTest' propName="visitingCard" onFileUpload={(files) => handleFileUpload(files, 'visitingCard')} accept=".jpg,.jpeg,.png,.pdf" initialData={item.visitingCard ?? null} maxFileNumber={1}/>
            {errors.visitingCard && (
              <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                {errors.visitingCard}
              </p>
            )}
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

            <FileUploadMain modelName='AppUserTest' propName="cheque" onFileUpload={(files) => handleFileUpload(files, 'cheque')} accept=".jpg,.jpeg,.png,.pdf" initialData={item.cheque ?? null} maxFileNumber={1}/>
            {errors.cheque && (
              <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                {errors.cheque}
              </p>
            )}
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

            <InputText id='gstOtp' name='gstOtp'  onChange={(e) => handleInputChange('gstOtp', e.target.value)} maxLength={100} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"  type='text'  value={item.gstOtp} placeholder={t("appUserTests.columns.fields.gstOtp")}/>
            {errors.gstOtp && (
              <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                {errors.gstOtp}
              </p>
            )}
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

            <Checkbox inputId='isActive' name='isActive' value='isActive' checked={item.isActive ?? false} onChange={(e) => handleCheckboxChange(e, 'isActive')} className="bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"/>
            {errors.isActive && (
              <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                {errors.isActive}
              </p>
            )}
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

            <Checkbox inputId='isAdmin' name='isAdmin' value='isAdmin' checked={item.isAdmin ?? false} onChange={(e) => handleCheckboxChange(e, 'isAdmin')} className="bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"/>
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
              {t("appUserTests.columns.fields.hasImpersonateAccess")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.hasImpersonateAccess")} />
            </div>

            <Checkbox inputId='hasImpersonateAccess' name='hasImpersonateAccess' value='hasImpersonateAccess' checked={item.hasImpersonateAccess ?? false} onChange={(e) => handleCheckboxChange(e, 'hasImpersonateAccess')} className="bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"/>
            {errors.hasImpersonateAccess && (
              <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                {errors.hasImpersonateAccess}
              </p>
            )}
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

            <FileUploadMain modelName='AppUserTest' propName="photoAttachment" onFileUpload={(files) => handleFileUpload(files, 'photoAttachment')} accept=".jpg,.jpeg,.png,.pdf" initialData={item.photoAttachment ?? null} maxFileNumber={1}/>
            {errors.photoAttachment && (
              <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                {errors.photoAttachment}
              </p>
            )}
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

            <Dropdown id='role' name='role' value={selectedRole} onChange={(e: DropdownChangeEvent) => { handleDropdownChange(e, "role"); setSelectedRole(e.value) }}  className="dropdowndark text-sm w-full lg:w-20rem flex items-center h-[40px]  bg-[var(--color-white)] text-[var(--color-dark)] dropdowndark"  />
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
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.publish")}
              </label>
              <span className=" text-[var(--color-danger)] pl-2 ">*</span>
              <TooltipWithText text={t("appUserTests.columns.fields.publish")} />
            </div>

            <Dropdown id='publish' name='publish' value={selectedPublish} onChange={(e: DropdownChangeEvent) => { handleDropdownChange(e, "publish"); setSelectedPublish(e.value) }}  className="dropdowndark text-sm w-full lg:w-20rem flex items-center h-[40px]  bg-[var(--color-white)] text-[var(--color-dark)] dropdowndark"  />
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
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.lastLogin")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.lastLogin")} />
            </div>

             <Calendar id='lastLogin' name='lastLogin' dateFormat="mm-dd-yy" value={item.lastLogin? new Date(item.lastLogin) : null } yearNavigator monthNavigator yearRange="1920:2040" onChange={(e) => handleInputChange('lastLogin', e.value ? formatDate(e.value) : '')}  placeholder={t("appUserTests.columns.fields.lastLogin")} showIcon className="calendardark text-sm rounded-md py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]" />
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
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.defaultLanguage")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.defaultLanguage")} />
            </div>

            <InputText id='defaultLanguage' name='defaultLanguage'  onChange={(e) => handleInputChange('defaultLanguage', e.target.value)} maxLength={10} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"  type='text'  value={item.defaultLanguage} placeholder={t("appUserTests.columns.fields.defaultLanguage")}/>
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
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("appUserTests.columns.fields.isPremiumUser")}
              </label>
              
              <TooltipWithText text={t("appUserTests.columns.fields.isPremiumUser")} />
            </div>

            <Checkbox inputId='isPremiumUser' name='isPremiumUser' value='isPremiumUser' checked={item.isPremiumUser ?? false} onChange={(e) => handleCheckboxChange(e, 'isPremiumUser')} className="bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"/>
            {errors.isPremiumUser && (
              <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                {errors.isPremiumUser}
              </p>
            )}
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

            <InputText id='totalPlot' name='totalPlot'  onChange={(e) => handleInputChange('totalPlot', e.target.value)}  className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"  type='text'  value={item.totalPlot} placeholder={t("appUserTests.columns.fields.totalPlot")}/>
            {errors.totalPlot && (
              <p className="text-[var(--color-danger)] text-xs py-2 pl-2">
                {errors.totalPlot}
              </p>
            )}
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
    </div>
  )
}

