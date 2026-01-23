import { Outlet } from 'react-router-dom';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { useAuth } from './context/AuthContext';

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="appLoading">
        Loading application...
      </div>
    );
  }

  return (
    <div className="app">
      <Header />
      <main className="mainContent">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;