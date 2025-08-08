import { useEffect, useRef, useState } from "react";
import TooltipWithText from "../../../components/TooltipWithText";
import { BsArrowLeft, Button, FaEdit, IoIosArrowBack, IoIosArrowForward, Stepper, StepperPanel } from "../../../sharedBase/globalImports";
import { useTranslation, useParams } from '../../../sharedBase/globalUtils';
import { Seo } from "../../../core/model/seo";
import { useViewPage } from "../../../hooks/useViewPage";
import { SeosService } from "../../../core/service/seos.service";
import { useItemQuery } from "../../../store/useItemQuery";
import Loader from "../../../components/Loader";

export default function SeosView() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const stepperRef = useRef<Stepper | null>(null);
  const [stepNo, setStepNo] = useState(0);
        
 const stepsData = [ t("seos.form_detail.fields.Step1")];
  const baseModelName = "seos";
const typeName= "seo";
  const seosService = SeosService();
  const query = useItemQuery<Seo>(seosService);
   const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [item, setItemData] = useState<Seo | undefined>(initData() || {});

  

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

 

  useEffect(() => {
    const fetchData = async () => {
      const data = await query.getItem(parseInt(id as string, 10));
      setItemData(data);
    };
    fetchData();

  }, [id]);

  useEffect(() => {
    if (query?.data) {
      if (Array.isArray(query?.data) && query?.data.length === 0) {
        setItemData(undefined);
      } else {
        setItemData(query?.data as Seo);
      }
    }
  }, [query?.data]);

  const { isFieldHidden, handleEdit, handleBack } = useViewPage({
    props: {
      id: id,
      baseModelName: baseModelName,
      typeName: typeName,
    }
  });

  const next = () => {
    if (stepNo <= stepsData?.length) {
      setStepNo((prev) => prev + 1);
      stepperRef?.current?.nextCallback();
    }
  };

  const prev = () => {
    setStepNo((prev) => (prev > 0 ? prev - 1 : 0));
    stepperRef?.current?.prevCallback();
  };

  return (
    <div className="relative flex flex-col h-screen overflow-y-auto overflow-x-hidden">
      <div className="flex items-center p-1 shadow-md   bg-[var(--color-white)] text-[var(--color-dark)] topbar w-full fixed  top-30 z-20">
        <Button
          className="backBtn cursor-pointer flex items-center"
          onClick={handleBack}
        >
          <BsArrowLeft className="h-6 w-6 cursor-pointer mx-3" />
        </Button>
        <h1 className="capitalize text-[14px] font-semibold ">{t("globals.backto")} {t("seos.form_detail.fields.modelname")}</h1>
      </div>
{query.isLoading ? (
        <Loader />
      ) : (
        <>
      <div className="flex flex-col border-none mb-10 sm:mb-20">
        <Stepper ref={stepperRef} headerPosition="bottom">
          <StepperPanel header={stepsData[0]}>
    <div ref={(el) => { stepRefs.current[0] = el; }} className="p-2 mt-3 lg:mt-10 mb-12 md:mb-0 lg:mb-0 bg-[var(--color-white)] text-[var(--color-dark)]">
      <div className="user-grid pb-4">
        {!isFieldHidden("name") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="name"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("seos.columns.fields.name")}
                      </label>
                      
                      <TooltipWithText text={t("seos.columns.fields.name")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.name}</span>
                  </div>
                )}{!isFieldHidden("title") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="title"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("seos.columns.fields.title")}
                      </label>
                      <span className="text-red-600">*</span>
                      <TooltipWithText text={t("seos.columns.fields.title")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.title}</span>
                  </div>
                )}{!isFieldHidden("description") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="description"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("seos.columns.fields.description")}
                      </label>
                      
                      <TooltipWithText text={t("seos.columns.fields.description")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.description}</span>
                  </div>
                )}{!isFieldHidden("keyWords") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="keyWords"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("seos.columns.fields.keyWords")}
                      </label>
                      
                      <TooltipWithText text={t("seos.columns.fields.keyWords")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.keyWords}</span>
                  </div>
                )}{!isFieldHidden("imageUrl") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="imageUrl"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("seos.columns.fields.imageUrl")}
                      </label>
                      
                      <TooltipWithText text={t("seos.columns.fields.imageUrl")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.imageUrl}</span>
                  </div>
                )}{!isFieldHidden("url") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="url"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("seos.columns.fields.url")}
                      </label>
                      
                      <TooltipWithText text={t("seos.columns.fields.url")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.url}</span>
                  </div>
                )}{!isFieldHidden("mainUrl") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="mainUrl"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("seos.columns.fields.mainUrl")}
                      </label>
                      
                      <TooltipWithText text={t("seos.columns.fields.mainUrl")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.mainUrl}</span>
                  </div>
                )}
      </div>
    </div>
  </StepperPanel>

        </Stepper>
      </div>

      <div className="fixed bottom-0 z-auto  shadow-lg border-t border-[var(--color-border)] bg-[var(--color-white)] available-width">
        <div className="flex gap-2 px-3 button-container">
          {stepNo > 0 && (
            <Button
              type="button"
              className="bg-[#f9fafb] rounded-md p-2 w-[120px] text-[var(--color-primary)] bg-[var(--color-white)]  border-2 border-[var(--color-primary)] font-medium text-[13px] flex items-center justify-center space-x-2"
              onClick={prev}
            >
              <IoIosArrowBack size={15} className="text-[var(--color-primary)]" />
              <span>{t("globals.previous")}</span>
            </Button>
          )}
          {stepNo !== stepsData.length - 1 && (
            <Button
              type="button"
              className="bg-[var(--color-primary)] rounded-md p-2 w-[120px]  text-[var(--color-white)] font-medium text-[13px] flex items-center justify-center space-x-2"
              onClick={next}
            >
              <span>{t("globals.next")}</span>
              <IoIosArrowForward size={15} className=" text-[var(--color-white)]" />
            </Button>
          )}

          {stepNo === stepsData.length - 1 && (
            <Button
              type="button"
              className="bg-[var(--color-primary)] rounded-md p-2 w-[120px]  text-[var(--color-white)] font-medium text-[13px] flex items-center justify-center"
              onClick={() => handleEdit(item?.id ?? "")}
            >
              <FaEdit size={15} className=" text-[var(--color-white)]" />
              <span>{t("globals.edit")}</span>
            </Button>
          )}
        </div>
      </div>
       </>
      )}
    </div>
  );
}

