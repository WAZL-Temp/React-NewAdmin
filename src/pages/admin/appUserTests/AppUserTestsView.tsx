import { useEffect, useRef, useState } from "react";
import TooltipWithText from "../../../components/TooltipWithText";
import ImgViewer from "../../../components/ImgViewer";
import { BsArrowLeft, Button, FaEdit, IoIosArrowBack, IoIosArrowForward, Stepper, StepperPanel, StepperRefAttributes } from "../../../sharedBase/globalImports";
import { useTranslation, useParams, format } from '../../../sharedBase/globalUtils';
import { AppUserTest } from "../../../core/model/appUserTest";
import { useViewPage } from "../../../hooks/useViewPage";
import { AppUserTestsService } from "../../../core/service/appUserTests.service";
import { useItemQuery } from "../../../store/useItemQuery";


export default function AppUserTestsView() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const stepperRef = useRef<StepperRefAttributes | null>(null);
  const [stepNo, setStepNo] = useState(0);
        
 const stepsData = [ t("appUserTests.form_detail.fields.accessDeatails"), t("appUserTests.form_detail.fields.shopDetails"), t("appUserTests.form_detail.fields.shopAddress"), t("appUserTests.form_detail.fields.verifyShop")];
  const baseModelName = "appUserTests";
  const appUserTestsService = AppUserTestsService();
  const query = useItemQuery<AppUserTest>(appUserTestsService);
   const stepRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [item, setItemData] = useState<AppUserTest | undefined>(initData() || {});

  

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
		reportedTo: "",
		reportedBy: "",
		appUserTestName: "",
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
        setItemData(query?.data as AppUserTest);
      }
    }
  }, [query?.data]);

  const { isFieldHidden, handleEdit, handleBack } = useViewPage({
    props: {
      id: id,
      baseModelName: baseModelName,
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
        <h1 className="capitalize text-[14px] font-semibold ">{t("globals.backto")} {t("appUserTests.form_detail.fields.modelname")}</h1>
      </div>

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
                      {t("appUserTests.columns.fields.name")}
                      </label>
                      <span className="text-red-600">*</span>
                      <TooltipWithText text={t("appUserTests.columns.fields.name")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.name}</span>
                  </div>
                )}{!isFieldHidden("firstName") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="firstName"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("appUserTests.columns.fields.firstName")}
                      </label>
                      
                      <TooltipWithText text={t("appUserTests.columns.fields.firstName")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.firstName}</span>
                  </div>
                )}{!isFieldHidden("lastName") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="lastName"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("appUserTests.columns.fields.lastName")}
                      </label>
                      
                      <TooltipWithText text={t("appUserTests.columns.fields.lastName")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.lastName}</span>
                  </div>
                )}{!isFieldHidden("mobile") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="mobile"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("appUserTests.columns.fields.mobile")}
                      </label>
                      <span className="text-red-600">*</span>
                      <TooltipWithText text={t("appUserTests.columns.fields.mobile")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.mobile}</span>
                  </div>
                )}{!isFieldHidden("mobileVerified") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="mobileVerified"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("appUserTests.columns.fields.mobileVerified")}
                      </label>
                      <span className="text-red-600">*</span>
                      <TooltipWithText text={t("appUserTests.columns.fields.mobileVerified")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.mobileVerified ?  'Yes': 'No'}</span>
                  </div>
                )}
      </div>
    </div>
  </StepperPanel>
  <StepperPanel header={stepsData[1]}>
    <div ref={(el) => { stepRefs.current[1] = el; }} className="p-2 mt-3 lg:mt-10 mb-12 md:mb-0 lg:mb-0 bg-[var(--color-white)] text-[var(--color-dark)]">
      <div className="user-grid pb-4">
        {!isFieldHidden("emailId") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="emailId"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("appUserTests.columns.fields.emailId")}
                      </label>
                      
                      <TooltipWithText text={t("appUserTests.columns.fields.emailId")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.emailId}</span>
                  </div>
                )}{!isFieldHidden("emailVerified") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="emailVerified"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("appUserTests.columns.fields.emailVerified")}
                      </label>
                      
                      <TooltipWithText text={t("appUserTests.columns.fields.emailVerified")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.emailVerified ?  'Yes': 'No'}</span>
                  </div>
                )}{!isFieldHidden("shopName") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="shopName"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("appUserTests.columns.fields.shopName")}
                      </label>
                      
                      <TooltipWithText text={t("appUserTests.columns.fields.shopName")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.shopName}</span>
                  </div>
                )}{!isFieldHidden("password") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="password"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("appUserTests.columns.fields.password")}
                      </label>
                      
                      <TooltipWithText text={t("appUserTests.columns.fields.password")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.password}</span>
                  </div>
                )}
      </div>
    </div>
  </StepperPanel>
  <StepperPanel header={stepsData[2]}>
    <div ref={(el) => { stepRefs.current[2] = el; }} className="p-2 mt-3 lg:mt-10 mb-12 md:mb-0 lg:mb-0 bg-[var(--color-white)] text-[var(--color-dark)]">
      <div className="user-grid pb-4">
        {!isFieldHidden("pincode") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="pincode"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("appUserTests.columns.fields.pincode")}
                      </label>
                      
                      <TooltipWithText text={t("appUserTests.columns.fields.pincode")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.pincode}</span>
                  </div>
                )}{!isFieldHidden("state") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="state"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("appUserTests.columns.fields.state")}
                      </label>
                      
                      <TooltipWithText text={t("appUserTests.columns.fields.state")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.state}</span>
                  </div>
                )}{!isFieldHidden("district") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="district"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("appUserTests.columns.fields.district")}
                      </label>
                      
                      <TooltipWithText text={t("appUserTests.columns.fields.district")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.district}</span>
                  </div>
                )}{!isFieldHidden("address") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="address"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("appUserTests.columns.fields.address")}
                      </label>
                      
                      <TooltipWithText text={t("appUserTests.columns.fields.address")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.address}</span>
                  </div>
                )}{!isFieldHidden("addressLine") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="addressLine"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("appUserTests.columns.fields.addressLine")}
                      </label>
                      
                      <TooltipWithText text={t("appUserTests.columns.fields.addressLine")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.addressLine}</span>
                  </div>
                )}
      </div>
    </div>
  </StepperPanel>
  <StepperPanel header={stepsData[3]}>
    <div ref={(el) => { stepRefs.current[3] = el; }} className="p-2 mt-3 lg:mt-10 mb-12 md:mb-0 lg:mb-0 bg-[var(--color-white)] text-[var(--color-dark)]">
      <div className="user-grid pb-4">
        {!isFieldHidden("gst") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="gst"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("appUserTests.columns.fields.gst")}
                      </label>
                      
                      <TooltipWithText text={t("appUserTests.columns.fields.gst")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.gst}</span>
                  </div>
                )}{!isFieldHidden("gstCertificate") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)]  bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md overflow-auto">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="gstCertificate"
                        className="text-sm font-bold py-2  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                       {t("appUserTests.columns.fields.gstCertificate")}  
                      </label>
                     <TooltipWithText text={t("appUserTests.columns.fields.gstCertificate")} />
                    </div>

                    <div className="flex flex-col gap-2 mt-3">
                      <ImgViewer files={item?.gstCertificate || null} modelName="AppUserTest" />
                    </div>
                  </div>
                )}{!isFieldHidden("photoShopFront") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)]  bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md overflow-auto">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="gstCertificate"
                        className="text-sm font-bold py-2  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                       {t("appUserTests.columns.fields.photoShopFront")}  
                      </label>
                     <TooltipWithText text={t("appUserTests.columns.fields.photoShopFront")} />
                    </div>

                    <div className="flex flex-col gap-2 mt-3">
                      <ImgViewer files={item?.photoShopFront || null} modelName="AppUserTest" />
                    </div>
                  </div>
                )}{!isFieldHidden("visitingCard") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)]  bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md overflow-auto">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="gstCertificate"
                        className="text-sm font-bold py-2  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                       {t("appUserTests.columns.fields.visitingCard")}  
                      </label>
                     <TooltipWithText text={t("appUserTests.columns.fields.visitingCard")} />
                    </div>

                    <div className="flex flex-col gap-2 mt-3">
                      <ImgViewer files={item?.visitingCard || null} modelName="AppUserTest" />
                    </div>
                  </div>
                )}{!isFieldHidden("cheque") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)]  bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md overflow-auto">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="gstCertificate"
                        className="text-sm font-bold py-2  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                       {t("appUserTests.columns.fields.cheque")}  
                      </label>
                     <TooltipWithText text={t("appUserTests.columns.fields.cheque")} />
                    </div>

                    <div className="flex flex-col gap-2 mt-3">
                      <ImgViewer files={item?.cheque || null} modelName="AppUserTest" />
                    </div>
                  </div>
                )}{!isFieldHidden("gstOtp") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="gstOtp"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("appUserTests.columns.fields.gstOtp")}
                      </label>
                      
                      <TooltipWithText text={t("appUserTests.columns.fields.gstOtp")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.gstOtp}</span>
                  </div>
                )}{!isFieldHidden("isActive") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="isActive"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("appUserTests.columns.fields.isActive")}
                      </label>
                      <span className="text-red-600">*</span>
                      <TooltipWithText text={t("appUserTests.columns.fields.isActive")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.isActive ?  'Yes': 'No'}</span>
                  </div>
                )}{!isFieldHidden("isAdmin") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="isAdmin"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("appUserTests.columns.fields.isAdmin")}
                      </label>
                      <span className="text-red-600">*</span>
                      <TooltipWithText text={t("appUserTests.columns.fields.isAdmin")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.isAdmin ?  'Yes': 'No'}</span>
                  </div>
                )}{!isFieldHidden("hasImpersonateAccess") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="hasImpersonateAccess"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("appUserTests.columns.fields.hasImpersonateAccess")}
                      </label>
                      
                      <TooltipWithText text={t("appUserTests.columns.fields.hasImpersonateAccess")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.hasImpersonateAccess ?  'Yes': 'No'}</span>
                  </div>
                )}{!isFieldHidden("photoAttachment") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)]  bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md overflow-auto">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="gstCertificate"
                        className="text-sm font-bold py-2  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                       {t("appUserTests.columns.fields.photoAttachment")}  
                      </label>
                     <TooltipWithText text={t("appUserTests.columns.fields.photoAttachment")} />
                    </div>

                    <div className="flex flex-col gap-2 mt-3">
                      <ImgViewer files={item?.photoAttachment || null} modelName="AppUserTest" />
                    </div>
                  </div>
                )}{!isFieldHidden("lastLogin") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="lastLogin"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("appUserTests.columns.fields.lastLogin")}
                      </label>
                      
                      <TooltipWithText text={t("appUserTests.columns.fields.lastLogin")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.lastLogin ? format(new Date(item?.lastLogin), "dd/MM/yyyy") : ""}</span>
                  </div>
                )}{!isFieldHidden("defaultLanguage") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="defaultLanguage"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("appUserTests.columns.fields.defaultLanguage")}
                      </label>
                      
                      <TooltipWithText text={t("appUserTests.columns.fields.defaultLanguage")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.defaultLanguage}</span>
                  </div>
                )}{!isFieldHidden("isPremiumUser") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="isPremiumUser"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("appUserTests.columns.fields.isPremiumUser")}
                      </label>
                      
                      <TooltipWithText text={t("appUserTests.columns.fields.isPremiumUser")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.isPremiumUser ?  'Yes': 'No'}</span>
                  </div>
                )}{!isFieldHidden("totalPlot") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="totalPlot"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("appUserTests.columns.fields.totalPlot")}
                      </label>
                      
                      <TooltipWithText text={t("appUserTests.columns.fields.totalPlot")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.totalPlot}</span>
                  </div>
                )}{!isFieldHidden("reportedTo") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="reportedTo"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("appUserTests.columns.fields.reportedTo")}
                      </label>
                      <span className="text-red-600">*</span>
                      <TooltipWithText text={t("appUserTests.columns.fields.reportedTo")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.reportedTo}</span>
                  </div>
                )}{!isFieldHidden("reportedBy") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="reportedBy"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                      {t("appUserTests.columns.fields.reportedBy")}
                      </label>
                      <span className="text-red-600">*</span>
                      <TooltipWithText text={t("appUserTests.columns.fields.reportedBy")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{item?.reportedBy}</span>
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
    </div>
  );
}

