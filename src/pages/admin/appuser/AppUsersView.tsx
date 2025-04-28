import { useEffect, useRef, useState } from "react";
import TooltipWithText from "../../../components/TooltipWithText";
import ImgViewer from "../../../components/ImgViewer";
import { BsArrowLeft, Button, FaEdit, IoIosArrowBack, IoIosArrowForward, Stepper, StepperPanel, StepperRefAttributes } from "../../../sharedBase/globalImports";
import { useTranslation, useParams, format } from '../../../sharedBase/globalUtils';
import { AppUser } from "../../../core/model/appuser";
import { useViewPage } from "../../../hooks/useViewPage";
import { useAppUserService } from "../../../core/services/appUsers.service";
import { useItemQuery } from "../../../store/useItemQuery";


export default function AppUsersView() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const stepperRef = useRef<StepperRefAttributes | null>(null);
  const [stepNo, setStepNo] = useState(0);
  const stepsData = [
    t("appUsers.form_detail.fields.accessDetails"),
    t("appUsers.form_detail.fields.shopDetails"),
    t("appUsers.form_detail.fields.shopAddress"),
    t("appUsers.form_detail.fields.verifyShop"),
  ];
  const baseModelName = "appuser";
  const userService = useAppUserService();
  const query = useItemQuery<AppUser>(userService);
  const [userData, setUserData] = useState<AppUser | undefined>(initialData() || {});

  function initialData(): AppUser {
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
      gst: '',
      gstCertificate: null,
      photoShopFront: null,
      visitingCard: null,
      cheque: null,
      gstOtp: '',
      isActive: false,
      isAdmin: false,
      hasImpersonateAccess: false,
      photoAttachment: null,
      role: '',
      publish: '',
      lastLogin: undefined,
      defaultLanguage: '',
      isPremiumUser: false,
      totalPlot: undefined,
    };
  }

  useEffect(() => {
    const fetchData = async () => {
      const data = await query.getItem(parseInt(id as string, 10));
      setUserData(data);
    };
    fetchData();

  }, [id]);

  useEffect(() => {
    if (query?.data) {
      if (Array.isArray(query?.data) && query?.data.length === 0) {
        setUserData(undefined);
      } else {
        setUserData(query?.data as AppUser);
      }
    }
  }, [query?.data]);

  const { isFieldHidden, handleEdit, handleBackToUser } = useViewPage<AppUser>({
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
          onClick={handleBackToUser}
        >
          <BsArrowLeft className="h-6 w-6 cursor-pointer mx-3" />
        </Button>
        <h1 className="capitalize text-[14px] font-semibold ">{t("globals.backto")} {t("appUsers.form_detail.fields.modelname")}</h1>
      </div>

      <div className="flex flex-col border-none mb-10 sm:mb-20">
        <Stepper ref={stepperRef} headerPosition="bottom">
          <StepperPanel header={stepsData[0]}>
            <div className="mb-12 md:mb-0 lg:mb-0 bg-[var(--color-white)] text-[var(--color-dark)] mt-3 lg:mt-10">
              <input type="hidden" name="id" value={userData?.id} />
              <div className="user-grid pb-5">
                {!isFieldHidden("name") && (
                  <div className="flex flex-col   bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-1 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="name"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                        {t("appUsers.columns.fields.name")}
                      </label>
                      <span className="text-red-600">*</span>
                      <TooltipWithText text={t("appUsers.columns.fields.name")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)] ">{userData?.name}</span>
                  </div>
                )}

                {!isFieldHidden("firstName") && (
                  <div className="flex flex-col  bg-opacity-80 p-2 h-full bg-[var(--color-white)] text-[var(--color-dark)] border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-2 bg-[var(--color-white)] text-[var(--color-dark)]">
                      <label
                        htmlFor="firstName"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                        {t("appUsers.columns.fields.firstName")}
                      </label>
                      <TooltipWithText text={t("appUsers.columns.fields.firstName")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)]">
                      {userData?.firstName}
                    </span>
                  </div>
                )}

                {!isFieldHidden("lastName") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)]  bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="lastName"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                        {t("appUsers.columns.fields.lastName")}
                      </label>
                      <TooltipWithText text={t("appUsers.columns.fields.lastName")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)]">
                      {userData?.lastName}
                    </span>
                  </div>
                )}

                {!isFieldHidden("mobile") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)]  bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="mobile"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                        {t("appUsers.columns.fields.mobile")}
                      </label>
                      <span className="text-red-600">*</span>
                      <TooltipWithText text={t("appUsers.columns.fields.mobile")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)]">
                      {userData?.mobile}
                    </span>
                  </div>
                )}

                {!isFieldHidden("mobileVerified") && (
                  <div className="flex flex-col  bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="mobileVerified"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                        {t("appUsers.columns.fields.mobileVerified")}
                      </label>
                      <span className="text-red-600">*</span>
                      <TooltipWithText text={t("appUsers.columns.fields.mobileVerified")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)]">
                      {userData?.mobileVerified ? "Yes" : "No"}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </StepperPanel>

          <StepperPanel header={stepsData[1]}>
            <div className="p-2 mb-12 md:mb-0 lg:mb-0 bg-[var(--color-white)] text-[var(--color-dark)] mt-3 lg:mt-10">
              <div className="user-grid   bg-[var(--color-white)] text-[var(--color-dark)] pb-5">
                {!isFieldHidden("emailId") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)]  bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="emailId"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                        {t("appUsers.columns.fields.emailId")}
                      </label>
                      <TooltipWithText text={t("appUsers.columns.fields.emailId")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)]">
                      {userData?.emailId}
                    </span>
                  </div>
                )}

                {!isFieldHidden("emailVerified") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)]  bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="emailVerified"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                        {t("appUsers.columns.fields.emailVerified")}
                      </label>
                      <TooltipWithText text={t("appUsers.columns.fields.emailVerified")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)]">
                      {userData?.emailVerified ? "Yes" : "No"}
                    </span>
                  </div>
                )}

                {!isFieldHidden("shopName") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)]  bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="shopName"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                        {t("appUsers.columns.fields.shopName")}
                      </label>
                      <TooltipWithText text={t("appUsers.columns.fields.shopName")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)]">
                      {userData?.shopName}
                    </span>
                  </div>
                )}

                {!isFieldHidden("password") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)]  bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="password"
                        className="text-sm font-bold  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                        {t("appUsers.columns.fields.password")}
                      </label>
                      <TooltipWithText text={t("appUsers.columns.fields.password")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)]">
                      {userData?.password}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </StepperPanel>

          <StepperPanel header={stepsData[2]}>
            <div className="p-2 mb-12 md:mb-0 lg:mb-0 bg-[var(--color-white)] text-[var(--color-dark)] mt-3 lg:mt-10">
              <div className="user-grid pb-5">
                {!isFieldHidden("pincode") && (
                  <div className="flex flex-col  bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-2">
                      <label htmlFor="pincode" className="text-sm font-bold py-2  bg-[var(--color-white)] text-[var(--color-dark)]">
                        {t("appUsers.columns.fields.pincode")}
                      </label>
                      <TooltipWithText text={t("appUsers.columns.fields.pincode")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)]">{userData?.pincode}</span>
                  </div>
                )}

                {!isFieldHidden("state") && (
                  <div className="flex flex-col  bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-2">
                      <label htmlFor="state" className="text-sm font-bold py-2  bg-[var(--color-white)] text-[var(--color-dark)]">
                        {t("appUsers.columns.fields.state")}
                      </label>
                      <TooltipWithText text={t("appUsers.columns.fields.state")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)]">{userData?.state}</span>
                  </div>
                )}

                {!isFieldHidden("district") && (
                  <div className="flex flex-col  bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-2">
                      <label htmlFor="district" className="text-sm font-bold py-2  bg-[var(--color-white)] text-[var(--color-dark)]">
                        {t("appUsers.columns.fields.district")}
                      </label>
                      <TooltipWithText text={t("appUsers.columns.fields.district")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)]">{userData?.district}</span>
                  </div>
                )}

                {!isFieldHidden("address") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)]  bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-2">
                      <label htmlFor="address" className="text-sm font-bold py-2  bg-[var(--color-white)] text-[var(--color-dark)]">
                        {t("appUsers.columns.fields.address")}
                      </label>
                      <TooltipWithText text={t("appUsers.columns.fields.address")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)]">{userData?.address}</span>
                  </div>
                )}

                {!isFieldHidden("addressLine") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)]  bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-2">
                      <label htmlFor="addressLine" className="text-sm font-bold py-2  bg-[var(--color-white)] text-[var(--color-dark)]">
                        {t("appUsers.columns.fields.addressLine")}
                      </label>
                      <TooltipWithText text={t("appUsers.columns.fields.addressLine")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)]">{userData?.addressLine}</span>
                  </div>
                )}
              </div>
            </div>
          </StepperPanel>

          <StepperPanel header={stepsData[3]}>
            <div className="p-2 bg-[var(--color-white)] text-[var(--color-dark)] mt-3 lg:mt-10 mb-12 md:mb-0 lg:mb-0">
              <div className="user-grid">
                {!isFieldHidden("gst") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)]  bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="gst"
                        className="text-sm font-bold py-2  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                        {t("appUsers.columns.fields.gst")}
                      </label>
                      <TooltipWithText text={t("appUsers.columns.fields.gst")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)]">{userData?.gst}</span>
                  </div>
                )}

                {!isFieldHidden("gstCertificate") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)]  bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md overflow-auto">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="gstCertificate"
                        className="text-sm font-bold py-2  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                        {t("appUsers.columns.fields.gstCertificate")}
                      </label>
                      <TooltipWithText text={t("appUsers.columns.fields.gstCertificate")} />
                    </div>

                    <div className="flex flex-col gap-2 mt-3">
                      <ImgViewer files={userData?.gstCertificate || null} modelName="AppUser" />
                    </div>
                  </div>
                )}

                {!isFieldHidden("photoShopFront") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)]  bg-opacity-80 p-2  border border-dark border-opacity-5 rounded-md overflow-auto">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="photoShopFront"
                        className="text-sm font-bold py-2  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                        {t("appUsers.columns.fields.photoShopFront")}
                      </label>
                      <TooltipWithText text={t("appUsers.columns.fields.photoShopFront")} />
                    </div>
                    <div className="flex flex-col gap-1 mt-3">
                      <div className="flex flex-col gap-4">
                        <ImgViewer files={userData?.photoShopFront || null} modelName="AppUser" />
                      </div>
                    </div>
                  </div>
                )}

                {!isFieldHidden("visitingCard") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)]  bg-opacity-80 p-2  h-full border border-dark border-opacity-5 rounded-md overflow-auto">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="visitingCard"
                        className="text-sm font-bold py-2  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                        {t("appUsers.columns.fields.visitingCard")}
                      </label>
                      <TooltipWithText text={t("appUsers.columns.fields.visitingCard")} />
                    </div>
                    <div className="flex flex-col gap-1 mt-3">
                      <ImgViewer files={userData?.visitingCard || null} modelName="AppUser" />
                    </div>
                  </div>
                )}

                {!isFieldHidden("cheque") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)]  bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md overflow-auto">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="cheque"
                        className="text-sm font-bold py-2  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                        {t("appUsers.columns.fields.cheque")}
                      </label>
                      <TooltipWithText text={t("appUsers.columns.fields.cheque")} />
                    </div>
                    <div className="flex flex-col gap-1 mt-3">
                      <ImgViewer files={userData?.cheque || null} modelName="AppUser" />
                    </div>
                  </div>
                )}

                {!isFieldHidden("gstOtp") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)]  bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="gstOtp"
                        className="text-sm font-bold py-2  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                        {t("appUsers.columns.fields.gstOtp")}
                      </label>
                      <TooltipWithText text={t("appUsers.columns.fields.gstOtp")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)]">
                      {userData?.gstOtp}
                    </span>
                  </div>
                )}

                {!isFieldHidden("isActive") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)]  bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="isActive"
                        className="text-sm font-bold py-2  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                        {t("appUsers.columns.fields.isActive")}
                      </label>
                      <span className=" text-red-600">*</span>
                      <TooltipWithText text={t("appUsers.columns.fields.isActive")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)]">
                      {userData?.isActive ? "true" : "false"}
                    </span>
                  </div>
                )}

                {!isFieldHidden("isAdmin") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)]  bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="isAdmin"
                        className="text-sm font-bold py-2  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                        {t("appUsers.columns.fields.isAdmin")}
                      </label>
                      <span className=" text-red-600">*</span>
                      <TooltipWithText text={t("appUsers.columns.fields.isAdmin")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)]">
                      {userData?.isAdmin ? "true" : "false"}
                    </span>
                  </div>
                )}

                {!isFieldHidden("hasImpersonateAccess") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="hasImpersonateAccess"
                        className="text-sm font-bold py-2  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                        {t("appUsers.columns.fields.hasImpersonateAccess")}
                      </label>
                      <TooltipWithText text={t("appUsers.columns.fields.hasImpersonateAccess")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)]">
                      {userData?.hasImpersonateAccess ? "true" : "false"}
                    </span>
                  </div>
                )}

                {!isFieldHidden("photoAttachment") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md overflow-auto">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="photoAttachment"
                        className="text-sm font-bold py-2  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                        {t("appUsers.columns.fields.photoAttachment")}
                      </label>
                      <TooltipWithText text={t("appUsers.columns.fields.photoAttachment")} />
                    </div>
                    <div className="flex flex-col gap-1 mt-3">
                      <ImgViewer files={userData?.photoAttachment || null} modelName="AppUser" />
                    </div>
                  </div>
                )}

                {!isFieldHidden("lastLogin") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)]  bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="lastLogin"
                        className="text-sm font-bold py-2  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                        {t("appUsers.columns.fields.lastLogin")}
                      </label>
                      <TooltipWithText text={t("appUsers.columns.fields.lastLogin")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)]">
                      {userData?.lastLogin
                        ? format(new Date(userData?.lastLogin), "dd/MM/yyyy")
                        : ""}
                    </span>
                  </div>
                )}

                {!isFieldHidden("defaultLanguage") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="defaultLanguage"
                        className="text-sm font-bold py-2  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                        {t("appUsers.columns.fields.defaultLanguage")}
                      </label>
                      <TooltipWithText text={t("appUsers.columns.fields.defaultLanguage")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)]">
                      {userData?.defaultLanguage}
                    </span>
                  </div>
                )}

                {!isFieldHidden("isPremiumUser") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="isPremiumUser"
                        className="text-sm font-bold py-2  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                        {t("appUsers.columns.fields.isPremiumUser")}
                      </label>
                      <TooltipWithText text={t("appUsers.columns.fields.isPremiumUser")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)]">
                      {userData?.isPremiumUser ? "true" : "false"}
                    </span>
                  </div>
                )}

                {!isFieldHidden("totalPlot") && (
                  <div className="flex flex-col bg-[var(--color-white)] text-[var(--color-dark)] bg-opacity-80 p-2 h-full border border-dark border-opacity-5 rounded-md">
                    <div className="flex items-center space-x-2">
                      <label
                        htmlFor="totalPlot"
                        className="text-sm font-bold py-2  bg-[var(--color-white)] text-[var(--color-dark)]"
                      >
                        {t("appUsers.columns.fields.totalPlot")}
                      </label>
                      <TooltipWithText text={t("appUsers.columns.fields.totalPlot")} />
                    </div>
                    <span className="text-sm font-medium  bg-[var(--color-white)] text-[var(--color-dark)]">
                      {userData?.totalPlot}
                    </span>
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
              className="bg-[#f9fafb] rounded-md p-2 w-[100px] text-[var(--color-primary)] bg-[var(--color-white)]  border-2 border-[var(--color-primary)] font-medium text-[13px] flex items-center justify-center space-x-2"
              onClick={prev}
            >
              <IoIosArrowBack size={15} className="text-[var(--color-primary)]" />
              <span>{t("globals.previous")}</span>
            </Button>
          )}
          {stepNo !== stepsData.length - 1 && (
            <Button
              type="button"
              className="bg-[var(--color-primary)] rounded-md p-2 w-[100px]  text-[var(--color-white)] font-medium text-[13px] flex items-center justify-center space-x-2"
              onClick={next}
            >
              <span>{t("globals.next")}</span>
              <IoIosArrowForward size={15} className=" text-[var(--color-white)]" />
            </Button>
          )}

          {stepNo === stepsData.length - 1 && (
            <Button
              type="button"
              className="bg-[var(--color-primary)] rounded-md p-2 w-[100px]  text-[var(--color-white)] font-medium text-[13px] flex items-center justify-center"
              onClick={() => handleEdit(userData?.id ?? "")}
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

