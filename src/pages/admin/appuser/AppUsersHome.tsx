import React, { useEffect, useState } from 'react';
import { AppUser } from '../../../core/model/appuser';
import user1 from '../../../assets/images/user1.png';
import user2 from '../../../assets/images/user2.png';
import {  Button, Card, Carousel, CgEye, CiShoppingCart, FaArrowRight, FaRegComment, GoInbox, Image, MdOutlineLocationOn, RiFileEditLine } from '../../../sharedBase/globalImports';
import {useNavigate, useTranslation} from '../../../sharedBase/globalUtils';
import { HomeUserData, SummaryData, UserData } from '../../../types/homepage';
import { useHomePage } from '../../../hooks/useHomePage';
import { useAppUserService } from '../../../core/services/appUsers.service';
import { useHomeQuery } from '../../../store/useHomeQuery';

export default function AppUsersHome() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const userService = useAppUserService();
  const query = useHomeQuery<AppUser>(userService);
  const [summaryData, setSummaryData] = useState<SummaryData>();
  const [topData, setTopData] = useState<UserData[]>();
  const [lastData, setLastData] = useState<UserData[]>();
  const [listHomeUserData, setListHomeUserData] = useState<HomeUserData[]>();
  const { responsiveOptions } = useHomePage();

  useEffect(() => {
    const fetchHomeData = async () => {
      const homeCommonData = query?.homeCommonData;
      const homeUserData = query?.homeUserData;

      const summary = homeCommonData?.summaryData?.[0];
      const top = homeCommonData?.topData;
      const last = homeCommonData?.lastData;
      const topUsers = homeUserData?.topData;

      setSummaryData(summary);
      setTopData(top);
      setLastData(last);
      setListHomeUserData(topUsers);
    };

    fetchHomeData();
  }, [query?.homeCommonData, query?.homeUserData]);

  const handleListClick = () => {
    navigate('/appuser')
  }

  return (
    <div className='relative h-screen flex flex-col overflow-y-auto overflow-x-hidden'>
      <div className="flex flex-col p-4">
        <div className="flex flex-col border-none mb-10">
          <div className="py-2">
            {query?.homeHtmlData && (
              <div
                className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--color-black)] text-center leading-tight max-w-3xl mx-auto tracking-wide"
                dangerouslySetInnerHTML={{ __html: query?.homeHtmlData.htmlData[0].html }}
              />
            )}
          </div>

          <section className="p-2">
            <div className="summary-grid">
              <SummaryCard title={t("globals.total")} value={summaryData?.total ?? 0} icon={<CiShoppingCart className="text-blue-600 text-xl lg:text-3xl" />} bgColor="bg-blue-100" iconBgColor="bg-blue-200" />
              <SummaryCard title={t("globals.average")} value={summaryData?.avgNo ?? 0} icon={<MdOutlineLocationOn className="text-orange-600 text-xl lg:text-3xl" />} bgColor="bg-orange-100" iconBgColor="bg-orange-200" />
              <SummaryCard title={t("globals.maxNo")} value={summaryData?.maxNo ?? 0} icon={<GoInbox className="text-cyan-600 text-xl lg:text-3xl" />} bgColor="bg-cyan-100" iconBgColor="bg-cyan-200" />
              <SummaryCard title={t("globals.minNo")} value={summaryData?.minNo ?? 0} icon={<FaRegComment className="text-purple-600 text-xl lg:text-3xl" />} bgColor="bg-purple-100" iconBgColor="bg-purple-200" />
            </div>
          </section>

          <section className="p-2 flex items-center justify-center my-3">
            <div onClick={handleListClick}>
              <Button
                label={t("globals.viewAllAppUsers")}
                className="rounded-md bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white p-2 border-none text-sm"
              />
            </div>
          </section>

          {topData && topData.length > 0 ? (
            <Carousel
              value={topData}
              numVisible={3}
              numScroll={3}
              responsiveOptions={responsiveOptions}
              itemTemplate={(user) => <ItemSlider user={user} />}
            />
          ) : (
            <p className="text-center text-[var(--color-dark)]">No users available</p>
          )}

          <section className="px-3 sm:p-6 lg:p-6">
            <div className="itemList">
              <ItemList title={t('globals.createdByMe')} users={listHomeUserData ?? []} />
              <ItemList title={t('globals.topUsers', { length: topData?.length })} users={topData ?? []} />
            </div>
          </section>

          {lastData && (
            <section className="item-card-grid">
              {(lastData ?? []).slice(0, 4).map((item: UserData, index: number) => (
                <ItemCard key={index} user={item as UserData} />
              ))}
            </section>
          )}

          <div className="p-2 mt-5">
            {query?.homeHtmlData && (
              <div
                className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--color-black)] text-center leading-tight max-w-3xl mx-auto tracking-wide"
                dangerouslySetInnerHTML={{ __html:query?.homeHtmlData.htmlData[1].html }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

const SummaryCard = ({ title, value, icon, bgColor, iconBgColor }: { title: string; value: number; icon: React.ReactNode; bgColor: string; iconBgColor: string }) => (
  <div className={`${bgColor} shadow-xl p-3 lg:p-4 border border-[var(--color-border)] rounded-xl transition-transform transform hover:scale-105 hover:shadow-2xl`}>
    <div className="flex justify-between mb-3">
      <div>
        <span className="block text-black font-semibold text-sm mb-2">{title}</span>
        <div className="text-black font-bold text-xl lg:text-3xl">{value}</div>
      </div>
      <div className={`flex items-center justify-center ${iconBgColor} rounded-full w-14 h-14`}>
        {icon}
      </div>
    </div>
  </div>
);

const ItemSlider = ({ user }: { user: AppUser }) => {
  const navigate = useNavigate();
  const baseModelName = "appuser";

  return (
    <div className="h-full flex items-center justify-center">
      <div className="w-full gap-2 items-center justify-center px-2 py-4 lg:px-4 lg:py-4">
        <div className="flex flex-col overflow-hidden border  border-[var(--color-gray)] p-5 rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500">
          <div className="mb-4 flex justify-center">
            <Image
              src={user2}
              alt={user.name}
              className="h-[100px] w-[100px] lg:h-[130px] lg:w-[150px] object-cover"
            />
          </div>
          <div className="text-center">
            <h4 className="text-sm font-semibold text-[var(--color-dark)] mb-1">{user.name}</h4>
            {user.emailId && (<h6 className="text-[var(--color-dark)]] text-sm mb-3">{user.emailId}</h6>)}
            <div className="car-buttons flex justify-center gap-3 mt-3">
              <div
                onClick={() => navigate(`/${baseModelName}/${user.id}`)}
                className="flex items-center justify-center rounded-full cursor-pointer p-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"
              >
                <CgEye className="text-white h-7 w-7" />
              </div>
              <div
                onClick={() => navigate(`/${baseModelName}/edit/${user.id}`)}
                className="flex items-center justify-center rounded-full cursor-pointer p-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"
              >
                <RiFileEditLine className="text-white h-7 w-7" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ItemList = ({ title, users }: { title: string; users: UserData[] }) => {
  const navigate = useNavigate();
  const baseModelName = "appuser"
  const { handleUserView, handleUserEdit } = useHomePage();

  return (
    <div className="border border-[var(--color-gray)] shadow-md rounded p-2">
      <div className="flex flex-col justify-around items-center">
        <span className="text-lg sm:text-xl font-semibold ">{title}</span>
      </div>
      <ul className="space-y-6">
        {users?.map((user: UserData) => (
          <li
            key={user.id}
            className="flex flex-col sm:flex-row items-center sm:items-start gap-4 lg:gap-8"
          >
            <div className="flex-shrink-0">
              <Image
                src={user1}
                alt={user.name}
                className="mx-auto block mb-2 w-14 h-14 lg:w-20 lg:h-20 rounded-full object-cover"
              />
            </div>
            <div className="flex flex-col justify-between items-center sm:items-start flex-1 text-center sm:text-left">
              <div>
                <span className="font-semibold text-[var(--color-dark)] text-sm sm:text-base">
                  {user.name}
                </span>
                {user.emailId && (<h6 className="text-[var(--color-dark)]] text-sm mb-3">{user.emailId}</h6>)}
              </div>
              <div className="mt-3 flex space-x-3">
                <button
                  onClick={() => handleUserView(navigate, user.id, baseModelName)}
                  className="flex items-center justify-center rounded-full p-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"
                >
                  <CgEye className="text-white  h-6 w-6" />
                </button>
                <button
                  onClick={() => handleUserEdit(navigate, user.id, baseModelName)}
                  className="flex items-center justify-center rounded-full p-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)]"
                >
                  <RiFileEditLine className="text-white  h-6 w-6" />
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ItemCard = ({ user }: { user: AppUser }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleUserView = (userid: number) => {
    navigate(`/appuser/${userid}`)
  }

  return (
    <Card className="border  border-[var(--color-gray)] text-center rounded-md w-[230px]">
      <Image
        src={user2}
        alt="Image"
        className="mx-auto block h-[100px] w-[100px] lg:h-[130px] lg:w-[150px]"
      />
      <div className='mt-4'>
        <span className="text-[16px] font-semibold text-[var(--color-dark)]">
          {user.name}
        </span>
      </div>
      <p className="text-[var(--color-dark)] mb-4 text-xs px-2 mt-2">
        Nunc mi ipsum faucibus vitae aliquet nec. Lacus sed viverra tellus in hac habitasse platea dictumst.
      </p>
      <div className='flex space-x-2 justify-center'>
        <div
          onClick={() => handleUserView(user.id ?? 0)}
          className="flex items-center text-white rounded-full p-2 bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] space-x-2 cursor-pointer"
        >
          <FaArrowRight className="w-4 h-4" />
          <span className=' text-white text-sm'>{t("globals.view")}</span>
        </div>
      </div>
    </Card>
  );
}
