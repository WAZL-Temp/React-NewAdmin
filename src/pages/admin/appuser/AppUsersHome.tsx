import React, { useEffect, useState } from 'react';
import { AppUser } from '../../../core/model/appUser';
import teambanner from '../../../assets/images/team-banner.png';
import prodilimg from '../../../assets/images/prodil.jpg';
import avatar from '../../../assets/images/avatar.svg';
import { Button, Card, Carousel, CgEye, CiShoppingCart, FaRegComment, GoInbox, Image, MdOutlineLocationOn, RiFileEditLine } from '../../../sharedBase/globalImports';
import { useNavigate, useTranslation } from '../../../sharedBase/globalUtils';
import { HomeUserData, SummaryData, UserData } from '../../../types/homepage';
import { useHomePage } from '../../../hooks/useHomePage';
import { AppUserService } from '../../../core/service/appUsers.service';
import { useHomeQuery } from '../../../store/useHomeQuery';
import Loader from '../../../components/Loader';

export default function AppUsersHome() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const userService = AppUserService();
  const query = useHomeQuery(userService);
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
      {query.isLoading ? (
        <Loader />
      ) : (
        <div className="flex flex-col p-4">
          <div className="flex flex-col border-none mb-10">
            <div className="py-2">
              {query?.homeHtmlData && Array.isArray(query.homeHtmlData.htmlData) && query.homeHtmlData.htmlData[0] && (
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
                  label={t('globals.viewAll')}
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
                showIndicators={false}
                itemTemplate={(user) => <ItemSlider user={user} />}
              />
            ) : (
              <p className="text-center text-[var(--color-dark)]">No users available</p>
            )}

            <section>
              <ItemList title={t('globals.topUsers', { length: topData?.length })} users={listHomeUserData ?? []} />
            </section>

            {listHomeUserData && (
              <section className="py-10 flex items-center justify-center">
                <div className="container mx-auto px-4 sm:px-12">
                  <h2 className="text-xl sm:text-2xl font-bold text-[var(--color-dark)] text-center">{t('globals.createdByMe')}</h2>
                  <div className="relative overflow-hidden">
                    <div className="flex space-x-4 overflow-x-auto scrollbar-hide px-4 py-4 snap-x snap-proximity justify-start">
                      {listHomeUserData.map((item, index) => (
                        <div key={index} className="flex-none snap-center w-[140px] sm:w-[160px]">
                          <div className="bg-white shadow-xl rounded-2xl p-4 flex flex-col items-center h-[180px] sm:h-[200px]">
                            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden">
                              <Image
                                src={avatar}
                                alt={item.name || 'User avatar'}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <h3 className="mt-3 text-sm font-semibold text-black text-center min-h-[24px]">
                              {item.name}
                            </h3>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </section>
            )}

            {lastData && (
              <section className="item-card-grid">
                {(lastData ?? []).slice(0, 5).map((item: UserData, index: number) => (
                  <ItemCard key={index} user={item as UserData} />
                ))}
              </section>
            )}

            <div className="p-2 mt-5">
              {query?.homeHtmlData && Array.isArray(query.homeHtmlData.htmlData) && query.homeHtmlData.htmlData[1] && (
                <div
                  className="text-lg sm:text-xl lg:text-2xl font-bold text-[var(--color-black)] text-center leading-tight max-w-3xl mx-auto tracking-wide"
                  dangerouslySetInnerHTML={{ __html: query?.homeHtmlData.htmlData[1].html }}
                />
              )}
            </div>
          </div>
        </div>
      )}
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
  const baseModelName = 'appuser';

  return (
    <div className="flex justify-center h-full">
      <div className="shadow-md hover:shadow-lg transition-shadow duration-300 rounded-xl overflow-hidden w-full max-w-full min-w-0">
        <div className="p-2 sm:p-4 flex flex-col h-full justify-between">
          <div className="relative mb-4">
            <Image
              src={teambanner}
              alt={user.name || 'User image'}
              className="w-full h-40 sm:h-48 object-cover rounded-full transform transition-transform hover:scale-105"
            />
          </div>
          <div className="text-center">
            <h4 className="text-base sm:text-lg font-semibold text-gray-900">{user.name}</h4>
            <p className="text-xs sm:text-sm text-gray-600 mb-4">{user.emailId}</p>
          </div>
          <div className="flex items-center justify-center gap-3">
            <div
              onClick={() => navigate(`/${baseModelName}/${user.id}`)}
              className="flex p-[6px] items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white hover:bg-[var(--color-primary)] transition cursor-pointer"
            >
              <CgEye className="text-white w-7 h-7 " />
            </div>
            <div
              onClick={() => navigate(`/${baseModelName}/edit/${user.id}`)}
              className="p-[6px] flex items-center justify-center rounded-full bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white hover:bg-[var(--color-primary)] transition cursor-pointer"
            >
              <RiFileEditLine className="text-white w-7 h-7" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ItemList = ({ title, users }: { title: string; users: UserData[] }) => {
  const navigate = useNavigate();
  const baseModelName = 'appuser';

  return (
    <div className='mt-3'>
      <div className="container mx-auto px-2 sm:px-4">
        <h5 className="text-xl sm:text-2xl font-semibold text-center text-[var(--color-dark)] mb-3">{title}</h5>
        <Carousel
          value={users}
          numVisible={2}
          numScroll={1}
          showIndicators={false}
          showNavigators={true}
          responsiveOptions={[
            { breakpoint: '1280px', numVisible: 2, numScroll: 1 },
            { breakpoint: '1024px', numVisible: 1, numScroll: 1 },
            { breakpoint: '768px', numVisible: 1, numScroll: 1 },
            { breakpoint: '640px', numVisible: 1, numScroll: 1 },
          ]}
          itemTemplate={(user) => (
            <div className="p-2 sm:p-3">
              <div className="flex flex-col md:flex-row bg-white shadow-lg rounded-xl overflow-hidden w-full max-w-full min-w-0 min-h-[150px] sm:min-h-[200px]">
                <div className="w-full md:w-1/3 flex items-center justify-center bg-blue-100 h-auto">
                  <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-32 md:h-32 rounded-full overflow-hidden">
                    <Image
                      src={avatar}
                      alt={user.name || 'User avatar'}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="w-full md:w-2/3 p-3 sm:p-4 md:p-6 flex flex-col justify-between">
                  <p className="text-gray-900 font-semibold mt-2 text-center md:text-left text-sm sm:text-base">
                    {user.name}
                  </p>
                  <div className="flex justify-center md:justify-start gap-3 sm:gap-4 mt-3 sm:mt-4">
                    <Button
                      label="Edit"
                      icon="pi pi-file-edit"
                      className="flex items-center gap-2 text-white bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] hover:text-white p-2 border border-[var(--color-primary)] rounded-md text-xs sm:text-sm"
                      onClick={() => navigate(`/${baseModelName}/edit/${user.id}`)}
                    />
                    <Button
                      label="View"
                      icon="pi pi-eye"
                      className="flex items-center gap-2 text-[var(--color-primary)] bg-white hover:text-[var(--color-primary)] p-2 border border-[var(--color-primary)] rounded-md text-xs sm:text-sm"
                      onClick={() => navigate(`/${baseModelName}/${user.id}`)}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          circular
          className="w-full px-2 sm:px-4"
        />
      </div>
    </div>
  );
};

const ItemCard = ({ user }: { user: AppUser }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <Card className="rounded-lg shadow-lg p-2 text-center hover:shadow-xl transition duration-300">
      <div className="mb-4 w-20 h-20 sm:w-24 sm:h-24 rounded-full overflow-hidden border-2 border-gray-300 shadow-md mx-auto">
        <Image
          src={prodilimg}
          alt={user.name || ''}
          imageClassName="w-full h-full object-cover"
          preview={false}
        />
      </div>

      <h3 className="text-lg font-semibold text-black">{user.name}</h3>
      <p className="text-black text-xs leading-relaxed mt-2">
        Nunc mi ipsum faucibus vitae aliquet nec. Lacus sed viverra tellus in hac habitasse platea dictumst.
      </p>
      <div className="mt-4">
        <Button
          label={t('globals.view')}
          icon="pi pi-arrow-right"
          className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-secondary)] text-white py-2 px-5 rounded-full hover:bg-[var(--color-primary)] transition duration-300 text-sm"
          onClick={() => navigate(`/appuser/${user.id}`)}
        />
      </div>
    </Card>
  );
};