// import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
// import Register from "./components/Register";
// import Login from "./components/Login";
// function App(){
//   return (
//     <>
//      <Router>
//             <Routes>
//                 <Route path="/register" element={<Register />} />
//                 <Route path="/login" element={<Login />} />
//             </Routes>
//     </Router> 
    
//     </>
//   );
// }

// export default App;



import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Sessions from "./components/Sessions";
import CodeEditor from "./components/Editor";
import HomePage from "./components/HomePage"
// import { ToastContainer } from "react-toastify";
// import 'react-toastify/dist/ReactToastify.css';

const App = () => {
    return (
        <>
            {/* <ToastContainer /> */}
            <Router>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/sessions" element={<Sessions />} />
                    <Route path="/editor/:roomId/:userId" element={<CodeEditor />} />

                </Routes>
            </Router>
        </>
    );
};

export default App;


