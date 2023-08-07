/*import logo from './logo.svg';*/
import './App.css';
import Header from './components/Header';
// import SignUp from './pages/Signup';
import { Routes, Route } from 'react-router-dom';

import Home from './pages/Home'; 
import DestinationList from './pages/DestinationList';
import DestinationDetails from './pages/DestinationDetails';

function App() {
  return (
    <div>
      <>
        <Header />
				<Routes>
					<Route path="/" element={<Home />} />
					<Route path="/destination" element={<DestinationList />} />
					<Route path="/destination/details" element={<DestinationDetails />} />
					{/* <Route path="*" element={<NoMatch />} /> */}
				</Routes>
		</>
    </div>
  );
}

export default App;
