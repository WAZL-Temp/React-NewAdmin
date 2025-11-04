import { Navigate, Route, Routes } from './sharedBase/globalUtils';
import Layout from './components/Layout';
import LoginPage from './pages/auth/LoginPage';
import NotAuthorized from './pages/NotAuthorize';
import AppUsersList from './pages/admin/appuser/AppUsersList';
import AppUsersHome from "./pages/admin/appuser/AppUsersHome";
import ProductsList from "./pages/admin/product/ProductsList";
import AppUsersView from "./pages/admin/appuser/AppUsersView";
import AppUsersEdit from "./pages/admin/appuser/AppUsersEdit";
import AppUsersImport from "./pages/admin/appuser/AppUsersImport";
import FormControls from './pages/admin/role/FormControls';

import AppUserTestsList from './pages/admin/appUserTests/AppUserTestsList';
import AppUserTestsHome from './pages/admin/appUserTests/AppUserTestsHome';
import AppUserTestsView from './pages/admin/appUserTests/AppUserTestsView';
import AppUserTestsEdit from './pages/admin/appUserTests/AppUserTestsEdit';
import AppUserTestsImport from './pages/admin/appUserTests/AppUserTestsImport';


import CategoriesList from './pages/admin/categories/CategoriesList';
import CategoriesHome from './pages/admin/categories/CategoriesHome';
import CategoriesView from './pages/admin/categories/CategoriesView';
import CategoriesEdit from './pages/admin/categories/CategoriesEdit';
import CategoriesImport from './pages/admin/categories/CategoriesImport';
import RoleDetailsForm from './pages/admin/role/RoleDetailsForm';
import SeosList from './pages/admin/seos/SeosList';
import SeosHome from './pages/admin/seos/SeosHome';
import SeosEdit from './pages/admin/seos/SeosEdit';
import SeosView from './pages/admin/seos/SeosView';
import SeosImport from './pages/admin/seos/SeosImport';
import AppUserListGrid from './pages/admin/appuser/AppUserListGrid';
import AppUserTestsListGrid from './pages/admin/appUserTests/AppUserTestsListGrid';

{/* <!--router-link-admin-Import--> */ }
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/appUsers" element={<Layout><AppUsersList /></Layout>} />
      <Route path="/appUsers/home" element={<Layout><AppUsersHome /></Layout>} />
      <Route path="/appUsers/:id" element={<Layout><AppUsersView /></Layout>} />
      <Route path="/appUsers/add" element={<Layout><AppUsersEdit /></Layout>} />
      <Route path="/appUsers/edit/:id" element={<Layout><AppUsersEdit /></Layout>} />
      <Route path="/appUsers/import" element={<Layout><AppUsersImport /></Layout>} />
      <Route path="/appUsers/grid" element={<Layout><AppUserListGrid /></Layout>} />

      <Route path="/role" element={<Layout><RoleDetailsForm /></Layout>} />

      <Route path="/appUserTests" element={<Layout><AppUserTestsList /></Layout>} />
      <Route path="/appUserTests/home" element={<Layout><AppUserTestsHome /></Layout>} />
      <Route path="/appUserTests/:id" element={<Layout><AppUserTestsView /></Layout>} />
      <Route path="/appUserTests/add" element={<Layout><AppUserTestsEdit /></Layout>} />
      <Route path="/appUserTests/edit/:id" element={<Layout><AppUserTestsEdit /></Layout>} />
      <Route path="/appUserTests/import" element={<Layout><AppUserTestsImport /></Layout>} />
      <Route path="/appUserTests/grid" element={<Layout><AppUserTestsListGrid /></Layout>} />

      <Route path="/categories" element={<Layout><CategoriesList /></Layout>} />
      <Route path="/categories/home" element={<Layout><CategoriesHome /></Layout>} />
      <Route path="/categories/:id" element={<Layout><CategoriesView /></Layout>} />
      <Route path="/categories/add" element={<Layout><CategoriesEdit /></Layout>} />
      <Route path="/categories/edit/:id" element={<Layout><CategoriesEdit /></Layout>} />
      <Route path="/categories/import" element={<Layout><CategoriesImport /></Layout>} />

      <Route path="/seos" element={<Layout><SeosList /></Layout>} />
      <Route path="/seos/home" element={<Layout><SeosHome /></Layout>} />
      <Route path="/seos/:id" element={<Layout><SeosView /></Layout>} />
      <Route path="/seos/add" element={<Layout><SeosEdit /></Layout>} />
      <Route path="/seos/edit/:id" element={<Layout><SeosEdit /></Layout>} />
      <Route path="/seos/import" element={<Layout><SeosImport /></Layout>} />

      {/* <!--router-link-admin--> */}

      <Route path="/product" element={<Layout><ProductsList /></Layout>} />

      <Route path="/formcontrols" element={<Layout><FormControls /></Layout>} />

      <Route path="/404" element={<Layout><NotAuthorized /></Layout>} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
