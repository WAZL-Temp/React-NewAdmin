import { BrowserRouter} from './sharedBase/globalUtils';
import AppRoutes from './AppRoutes';

const App = () => {

  return (
    <div className="font-custom">
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </div>
  )
};

export default App;
