import { useEffect, useRef, useState } from 'react'
import successImg from '../../../assets/images/success.gif'
import { BsArrowLeft, Button, Calendar, Checkbox, Dialog, Dropdown, DropdownChangeEvent, FaSave, Image, InputText, InputTextarea, IoIosArrowBack, IoIosArrowForward, MultiSelect, MultiSelectChangeEvent, RadioButton, RadioButtonChangeEvent, Stepper, StepperPanel, StepperRefAttributes, Toast } from '../../../sharedBase/globalImports';
import { useNavigate, useParams, useTranslation } from '../../../sharedBase/globalUtils';
import { useEditPage } from '../../../hooks/useEditPage';
import { Seo } from '../../../core/model/seo';
import { selectDropdownEnum, selectMultiData, selectRadioEnum } from '../../../sharedBase/dropdownUtils';
import TooltipWithText from '../../../components/TooltipWithText';
import FileUploadMain from '../../../components/FileUploadMain';
import { EnumDetail } from '../../../core/model/enumdetail';
import { CustomFile } from '../../../core/model/customfile';
import { useItemQuery } from '../../../store/useItemQuery';
import { SeosService } from '../../../core/service/seos.service';
import { useListQuery } from '../../../store/useListQuery';
import {getData, useFetchDataEnum } from '../../../sharedBase/lookupService';
import Loader from '../../../components/Loader';
import { seoValidate } from '../../../schema/seo';
import FormFieldError from '../../../components/FormFieldError';

//<<addModelData>>
export default function SeosEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useRef<Toast>(null);
  const seoSchema = seoValidate(t);
  const baseModelName = "seos";
const typeName= "seo";
  const seoService = SeosService();
  const itemQuery = useItemQuery<Seo>(seoService);
  const listQuery = useListQuery<Seo>(seoService);
  const isEditMode = Boolean(id);
  const stepperRef = useRef<StepperRefAttributes | null>(null);
  const [item, setItem] = useState<Seo>(initData());
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [stepNo, setStepNo] = useState(0);

  
 const stepsData = [t("seos.form_detail.fields.Step1"),];
 

    


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [itemData, setItemData] = useState<Seo>(initData());

    


  

function initData(): Seo {
	return {
		id: undefined,
		name: '',
		title: '',
		description: '',
		keyWords: '',
		imageUrl: '',
		url: '',
		mainUrl: '',
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
    = useEditPage<Seo>({
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
        const preparedData = prepareObject<Seo>(data, initData());
        setItem(preparedData);
      }
    };
    fetchData();
  }, [isEditMode, prepareObject, id]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        


      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [itemData]);

   useEffect(() => {
    const bindDropDownList = async () => {
    


      if (!itemData) return;

       
     
    };

    bindDropDownList();
  }, [itemData, 

  ]);

  const handleBack = () => {
    navigate("/seos");
  };
  const handleInputChange = (field: string, value: string) => {
    setItem((prev) => ({ ...prev, [field]: value }));
    const schema = seoSchema[field as keyof typeof seoSchema];

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

    const schema = seoSchema[key as keyof typeof seoSchema];
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
        const schema = seoSchema[fieldName as keyof typeof seoSchema];
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
        const schema = seoSchema[fieldName as keyof typeof seoSchema];

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
      const schema = seoSchema[controlName as keyof typeof seoSchema];

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
        setDialogMessage(t('globals.updateDialogMsg', { model: 'Seo' }));
      } else {
        await itemQuery.addItem(cleanedPayload);
        setDialogMessage(t('globals.addDialogMsg', { model: 'Seo' }));
      }

      setItem(initData());
      await listQuery?.load();
      setShowDialog(true);
    } catch (error) {
      console.error("Error:", error);
      if (itemData?.id) {
        alert("Failed to update Seo. Please try again later.");
      } else {
        alert("Failed to add Seo. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
    const handleMultiSelectChange = (e: MultiSelectChangeEvent, fieldName: string, setFieldValue: React.Dispatch<React.SetStateAction<Seo[]>>) => {
    const selectedValues = e.value as Seo[];
    setFieldValue(selectedValues);

    const inputElement = document.querySelector(`[name="${fieldName}"]`) as HTMLElement;
    const isRequired = inputElement?.hasAttribute('required') || inputElement?.getAttribute('aria-required') === 'true';
    const selectedIds = selectedValues.map((user) => user.id).filter((id) => id !== undefined).join(',');

    if (isRequired) {
      const schema = seoSchema[fieldName as keyof typeof seoSchema];
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

    const schema = seoSchema[controlName as keyof typeof seoSchema];

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
          <h1 className=" capitalize text-[14px] font-semibold ">{t("globals.backto")} {t("seos.form_detail.fields.modelname")}</h1>
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
              {t("seos.columns.fields.name")}
              </label>
              
              <TooltipWithText text={t("seos.columns.fields.name")} />
            </div>

            <InputText type='text' id='name' name='name'  onChange={(e) => handleInputChange('name', e.target.value)} maxLength={1000} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"    value={item.name} placeholder={t("seos.columns.fields.name")}/>
            <FormFieldError field="name" errors={errors} />
          </div>
        )}
        {!isFieldHidden("title") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="title"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("seos.columns.fields.title")}
              </label>
              <span className=" text-[var(--color-danger)] pl-2 ">*</span>
              <TooltipWithText text={t("seos.columns.fields.title")} />
            </div>

            <InputText type='text' id='title' name='title'  onChange={(e) => handleInputChange('title', e.target.value)} required maxLength={1000} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"    value={item.title} placeholder={t("seos.columns.fields.title")}/>
            <FormFieldError field="title" errors={errors} />
          </div>
        )}
        {!isFieldHidden("description") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="description"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("seos.columns.fields.description")}
              </label>
              
              <TooltipWithText text={t("seos.columns.fields.description")} />
            </div>

            <InputTextarea id='description' name='description'  onChange={(e) => handleInputChange('description', e.target.value)} maxLength={1000}className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)]  border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"  value={item.description} placeholder={t("seos.columns.fields.description")}/>
            <FormFieldError field="description" errors={errors} />
          </div>
        )}
        {!isFieldHidden("keyWords") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="keyWords"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("seos.columns.fields.keyWords")}
              </label>
              
              <TooltipWithText text={t("seos.columns.fields.keyWords")} />
            </div>

            <InputTextarea id='keyWords' name='keyWords'  onChange={(e) => handleInputChange('keyWords', e.target.value)} maxLength={1000}className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)]  border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"  value={item.keyWords} placeholder={t("seos.columns.fields.keyWords")}/>
            <FormFieldError field="keyWords" errors={errors} />
          </div>
        )}
        {!isFieldHidden("imageUrl") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="imageUrl"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("seos.columns.fields.imageUrl")}
              </label>
              
              <TooltipWithText text={t("seos.columns.fields.imageUrl")} />
            </div>

            <InputText type='text' id='imageUrl' name='imageUrl'  onChange={(e) => handleInputChange('imageUrl', e.target.value)} maxLength={1000} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"    value={item.imageUrl} placeholder={t("seos.columns.fields.imageUrl")}/>
            <FormFieldError field="imageUrl" errors={errors} />
          </div>
        )}
        {!isFieldHidden("url") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="url"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("seos.columns.fields.url")}
              </label>
              
              <TooltipWithText text={t("seos.columns.fields.url")} />
            </div>

            <InputText type='text' id='url' name='url'  onChange={(e) => handleInputChange('url', e.target.value)} maxLength={1000} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"    value={item.url} placeholder={t("seos.columns.fields.url")}/>
            <FormFieldError field="url" errors={errors} />
          </div>
        )}
        {!isFieldHidden("mainUrl") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="mainUrl"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("seos.columns.fields.mainUrl")}
              </label>
              
              <TooltipWithText text={t("seos.columns.fields.mainUrl")} />
            </div>

            <InputText type='text' id='mainUrl' name='mainUrl'  onChange={(e) => handleInputChange('mainUrl', e.target.value)} maxLength={1000} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"    value={item.mainUrl} placeholder={t("seos.columns.fields.mainUrl")}/>
            <FormFieldError field="mainUrl" errors={errors} />
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

