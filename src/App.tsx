import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from './sharedBase/globalImports';
import Layout from './components/Layout';
import LoginPage from './pages/auth/LoginPage';
import AuthGuard from '../src/components/AuthGuard';
import NotAuthorized from './pages/NotAuthorize';
import AppUsersList from './pages/admin/appuser/AppUsersList';
import { enumDetailStore } from "./store/enumDetailsStore";


const App = () => {
  const { loadList, data } = enumDetailStore();
  const [pageLoad, setPageLoad] = useState(false);

  useEffect(() => {
    if (data.length) {
      setPageLoad(true);
    }

    const EnumDataCall = async () => {
      await loadList();
    };

    EnumDataCall();
  }, [data]);

  return (
    pageLoad ? (
      <div className="font-custom">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/appuser" element={<AuthGuard requiredAction="List" page="appUser"><Layout><AppUsersList /></Layout></AuthGuard>} />

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
