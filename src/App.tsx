import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from './sharedBase/globalImports';
import Layout from './components/Layout';
import LoginPage from './pages/auth/LoginPage';
// import AuthGuard from '../src/components/AuthGuard';
import NotAuthorized from './pages/NotAuthorize';
import AppUsersList from './pages/admin/appuser/AppUsersList';
import AppUsersHome from "./pages/admin/appuser/AppUsersHome";
import ProductsList from "./pages/admin/product/ProductsList";
import { EnumDetail } from "./core/model/enumdetail";
import { useListQuery } from "./store/createListStore";
import { useEnumDetailsService } from "./core/services/enumDetails.service";
import AppUsersView from "./pages/admin/appuser/AppUsersView";
import AppUsersEdit from "./pages/admin/appuser/AppUsersEdit";


const App = () => {
  const enumDetailQuery = useListQuery<EnumDetail>(useEnumDetailsService());
  const [pageLoad, setPageLoad] = useState(true);

  useEffect(() => {
    if (enumDetailQuery?.data?.length) {
      setPageLoad(true);
    }

    const EnumDataCall = async () => {
      await enumDetailQuery.load();
    };

    EnumDataCall();
  }, [enumDetailQuery?.data]);

  return (
    pageLoad ? (
      <div className="font-custom">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/appuser" element={<Layout><AppUsersList /></Layout>} />
            <Route path="/appuser/homes" element={<Layout><AppUsersHome /></Layout>} />
            <Route path="/appuser/:id" element={<Layout><AppUsersView /></Layout>} />
            <Route path="/appuser/add" element={<Layout><AppUsersEdit /></Layout>} />
            <Route path="/appuser/edit/:id" element={<Layout><AppUsersEdit /></Layout>} />

            <Route path="/product" element={<Layout><ProductsList /></Layout>} />

            <Route path="/404" element={<Layout><NotAuthorized /></Layout>} />
            <Route path="*" element={<Navigate to="/404" replace />} />
          </Routes>
        </BrowserRouter>
      </div>
    ) : (
      <div>Loading...</div>
    )
  )
};

export default App;
