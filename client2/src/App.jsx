
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import SignIn from './components/SignIn';
import CheckContributions from './components/CheckContributions';
import Dashboard from './components/Dashboard';
// import Scheduler from './components/Scheduler';
import PushCreateEvent from './components/PushCreate';

import SetReminder from './components/SetReminder';

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/check-contributions" element={<CheckContributions />} />
        <Route path="/events" element={<PushCreateEvent/>}/>
       
        <Route path='/set-reminder' element={<SetReminder/>}/>
      </Routes>
    

  );
}

export default App;

