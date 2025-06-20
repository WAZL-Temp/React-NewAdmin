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
                    
{/* <!--router-link-admin-Import--> */}
const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/appuser" element={<Layout><AppUsersList /></Layout>} />
      <Route path="/appuser/home" element={<Layout><AppUsersHome /></Layout>} />
      <Route path="/appuser/:id" element={<Layout><AppUsersView /></Layout>} />
      <Route path="/appuser/add" element={<Layout><AppUsersEdit /></Layout>} />
      <Route path="/appuser/edit/:id" element={<Layout><AppUsersEdit /></Layout>} />
      <Route path="/appuser/import" element={<Layout><AppUsersImport /></Layout>} />




<Route path="/appUserTests" element={<Layout><AppUserTestsList /></Layout>} />
<Route path="/appUserTests/home" element={<Layout><AppUserTestsHome /></Layout>} />
<Route path="/appUserTests/:id" element={<Layout><AppUserTestsView /></Layout>} />
<Route path="/appUserTests/add" element={<Layout><AppUserTestsEdit /></Layout>} />
<Route path="/appUserTests/edit/:id" element={<Layout><AppUserTestsEdit /></Layout>} />
<Route path="/appUserTests/import" element={<Layout><AppUserTestsImport /></Layout>} />

<Route path="/categories" element={<Layout><CategoriesList /></Layout>} />
<Route path="/categories/home" element={<Layout><CategoriesHome /></Layout>} />
<Route path="/categories/:id" element={<Layout><CategoriesView /></Layout>} />
<Route path="/categories/add" element={<Layout><CategoriesEdit /></Layout>} />
<Route path="/categories/edit/:id" element={<Layout><CategoriesEdit /></Layout>} />
<Route path="/categories/import" element={<Layout><CategoriesImport /></Layout>} />

{/* <!--router-link-admin--> */}

      <Route path="/product" element={<Layout><ProductsList /></Layout>} />

      <Route path="/formcontrols" element={<Layout><FormControls /></Layout>} />

      <Route path="/404" element={<Layout><NotAuthorized /></Layout>} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
};

export default AppRoutes;
