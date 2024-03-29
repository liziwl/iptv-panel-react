import './App.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import TVLayout from "./component/TVLayout";
import Error from "./component/Error";
import LiveLayout from "./component/LiveLayout";
// import CustomLayout from "./component/CustomLayout";


const App = () => {
    return (<div className="App">
        {/* HashRouter哈希路由 还是 Browser路由随需求选择 */}
        <BrowserRouter>
            <Routes>
                {/* 默认初始化入口 */}
                <Route path="/" element={<Navigate to="/tv"/>}/>
                <Route path="/tv" element={<TVLayout/>}/>
                <Route path="/live" element={<LiveLayout/>}/>
                {/* 404页面 */}
                <Route path="*" element={<Error/>}/>
            </Routes>
        </BrowserRouter>
    </div>);
};

export default App;
