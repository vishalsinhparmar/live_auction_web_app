import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Navbar from './components/Navbar';
import SignUp from './pages/auth/SignUp';
import SignIn from './pages/auth/SignIn';
import LiveAuction from './pages/auction/LiveAuction';
import UserItem from './pages/user/UserItem';
import AddAuctionItem from './pages/auction/AddAuction';


const App = ()=>{
   return (
    <Router>
       <Navbar/>
       <Routes>
              <Route index  element = {<SignUp/>}/>
              <Route path='/signUp' element = {<SignUp/>}/>
              <Route path='/login' element = {<SignIn/>}/>
              <Route path='/' element = {<LiveAuction/>}/>
              <Route path='/user' element = {<UserItem/>}/>
              <Route path='/addAuction' element = {<AddAuctionItem/>}/>

       </Routes>
    </Router>
   )
};

export default App;
