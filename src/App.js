import React from 'react';
import './App.css';
import {BrowserRouter, Navigate, Route, Routes} from "react-router-dom";
import TVLayout from "./component/TVLayout";


class App extends React.Component {

    render() {
        return (
            <div className="App">
                {/* HashRouter哈希路由 还是 Browser路由随需求选择 */}
                <BrowserRouter>
                    <Routes>
                        {/* 默认初始化入口 */}
                        <Route path="/" element={<Navigate to="/TV"/>}/>
                        <Route path="TV/*" element={<TVLayout/>}/>
                        {/* 404页面 */}
                        <Route path="*" element={<Error/>}/>
                    </Routes>
                </BrowserRouter>
                {/*<TVLayout/>*/}
            </div>
        );
    }
}

function TV() {
    return <h2>TV</h2>;
}

function Error() {
    return <h2>Error</h2>;
}

export default App;
