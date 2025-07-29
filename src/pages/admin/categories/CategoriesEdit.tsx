import { useEffect, useRef, useState } from 'react'
import successImg from '../../../assets/images/success.gif'
import { BsArrowLeft, Button, Calendar, Checkbox, Dialog, DropdownChangeEvent, FaSave, Image, InputText, InputTextarea, IoIosArrowBack, IoIosArrowForward, MultiSelectChangeEvent, RadioButton, RadioButtonChangeEvent, Stepper, StepperPanel,Toast } from '../../../sharedBase/globalImports';
import { useNavigate, useParams, useTranslation } from '../../../sharedBase/globalUtils';
import { useEditPage } from '../../../hooks/useEditPage';
import { Category } from '../../../core/model/category';
import { selectDropdownEnum, selectMultiData, selectRadioEnum } from '../../../sharedBase/dropdownUtils';
import TooltipWithText from '../../../components/TooltipWithText';
import FileUploadMain from '../../../components/FileUploadMain';
import { EnumDetail } from '../../../core/model/enumdetail';
import { CustomFile } from '../../../core/model/customfile';
import { useItemQuery } from '../../../store/useItemQuery';
import { CategoriesService } from '../../../core/service/categories.service';
import { useListQuery } from '../../../store/useListQuery';
import {getData, useFetchDataEnum } from '../../../sharedBase/lookupService';
import Loader from '../../../components/Loader';
import { DropdownWithAutoClose } from '../../../components/DropdownWithAutoClose';
import { MultiSelectWithAutoClose } from '../../../components/MultiSelectWithAutoClose';
import { categoryValidate } from '../../../schema/category';
import FormFieldError from '../../../components/FormFieldError';

//<<addModelData>>

//<<addServiceData>>
export default function CategoriesEdit() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const toast = useRef<Toast>(null);
  const categorySchema = categoryValidate(t);
  const baseModelName = "categories";
const typeName= "category";
  const categoryService = CategoriesService();

//<<app-service-Data>>
  const itemQuery = useItemQuery<Category>(categoryService);
  const listQuery = useListQuery<Category>(categoryService);
  const isEditMode = Boolean(id);
  const stepperRef = useRef<Stepper | null>(null);
  const [item, setItem] = useState<Category>(initData());
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [stepNo, setStepNo] = useState(0);
  const hasRun = useRef(false);

  
 const stepsData = [t("categories.form_detail.fields.Step1"),];
 

    


  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [itemData, setItemData] = useState<Category>(initData());

    


  

function initData(): Category {
	return {
		id: undefined,
		name: '',
		slug: '',
		icon: '',
		importDataId: undefined,
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
    = useEditPage<Category>({
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
        const preparedData = prepareObject<Category>(data, initData());
        setItem(preparedData);
      }
    };
    fetchData();
  }, [isEditMode, prepareObject, id]);

   useEffect(() => {
    const fetchData = async () => {
      if (hasRun.current) return;
      hasRun.current = true;

      try {
        

      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchData = async () => {
      try {
        


      } catch (err) {
        console.error('Error fetching data:', err);
      }
    };

    fetchData();
  }, [
    

    ]);

   useEffect(() => {
    const bindDropDownList = async () => {
    


      if (!itemData) return;

       
     
    };

    bindDropDownList();
  }, [itemData, 

  ]);

  const handleBack = () => {
    navigate("/categories");
  };
  const handleInputChange = (field: string, value: string) => {
    setItem((prev) => ({ ...prev, [field]: value }));
    const schema = categorySchema[field as keyof typeof categorySchema];

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

    const schema = categorySchema[key as keyof typeof categorySchema];
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
        const schema = categorySchema[fieldName as keyof typeof categorySchema];
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
        const schema = categorySchema[fieldName as keyof typeof categorySchema];

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
      const schema = categorySchema[controlName as keyof typeof categorySchema];

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
        setDialogMessage(t('globals.updateDialogMsg', { model: 'Category' }));
      } else {
        await itemQuery.addItem(cleanedPayload);
        setDialogMessage(t('globals.addDialogMsg', { model: 'Category' }));
      }

      setItem(initData());
      await listQuery?.load();
      setShowDialog(true);
    } catch (error) {
      console.error("Error:", error);
      if (itemData?.id) {
        alert("Failed to update Category. Please try again later.");
      } else {
        alert("Failed to add Category. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };
    const handleMultiSelectChange = (e: MultiSelectChangeEvent, fieldName: string, setFieldValue: React.Dispatch<React.SetStateAction<Category[]>>) => {
    const selectedValues = e.value as Category[];
    setFieldValue(selectedValues);

    const inputElement = document.querySelector(`[name="${fieldName}"]`) as HTMLElement;
    const isRequired = inputElement?.hasAttribute('required') || inputElement?.getAttribute('aria-required') === 'true';
    const selectedIds = selectedValues.map((user) => user.id).filter((id) => id !== undefined).join(',');

    if (isRequired) {
      const schema = categorySchema[fieldName as keyof typeof categorySchema];
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

    const schema = categorySchema[controlName as keyof typeof categorySchema];

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
          <h1 className=" capitalize text-[14px] font-semibold ">{t("globals.backto")} {t("categories.form_detail.fields.modelname")}</h1>
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
              {t("categories.columns.fields.name")}
              </label>
              <span className=" text-[var(--color-danger)] pl-2 ">*</span>
              <TooltipWithText text={t("categories.columns.fields.name")} />
            </div>

            <InputText type='text' id='name' name='name'  onChange={(e) => handleInputChange('name', e.target.value)} required minLength={1} maxLength={200} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"    value={item.name} placeholder={t("categories.columns.fields.name")}/>
            <FormFieldError field="name" errors={errors} />
          </div>
        )}
        {!isFieldHidden("slug") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="slug"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("categories.columns.fields.slug")}
              </label>
              
              <TooltipWithText text={t("categories.columns.fields.slug")} />
            </div>

            <InputText type='text' id='slug' name='slug'  onChange={(e) => handleInputChange('slug', e.target.value)} maxLength={200} className="rounded-md text-sm py-2 px-3 bg-[var(--color-white)] text-[var(--color-dark)] border border-[var(--color-border)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)]"    value={item.slug} placeholder={t("categories.columns.fields.slug")}/>
            <FormFieldError field="slug" errors={errors} />
          </div>
        )}
        {!isFieldHidden("icon") && (
          <div className="flex flex-col">
            <div className=" flex items-center">
              <label
                htmlFor="icon"
                className="text-sm font-bold py-2 bg-[var(--color-white)] text-[var(--color-dark)]"
              >
              {t("categories.columns.fields.icon")}
              </label>
              
              <TooltipWithText text={t("categories.columns.fields.icon")} />
            </div>

            <FileUploadMain modelName='Category' propName="icon" onFileUpload={(files) => handleFileUpload(files, 'icon')} accept=".jpg,.jpeg,.png,.pdf" initialData={item.icon ?? null}  error={errors.icon} maxFileNumber={1}/>
            <FormFieldError field="icon" errors={errors} />
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

