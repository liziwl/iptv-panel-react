import React from "react";
import {Layout} from 'antd';
import PageFooter from "./PageFooter";
import Logo from "./Logo";
import {Link} from "react-router-dom";
import "./Error.css"

const {Header, Content} = Layout;

class Error extends React.Component {
    render() {
        return (
            <Layout className="error-layout">
                <Header style={{alignItems: "center", lineHeight: '50px', height: '50px', padding: 0}}>
                    <Logo/>
                </Header>
                <Content style={{margin: '16px 16px 0'}}>
                    <div className="site-layout-background" style={{padding: 24, minHeight: 360, textAlign: "center"}}>
                        {/* link跳转 */}
                        <h1>
                            404 找不到页面<br/>
                            <Link to="/">回到首页</Link>
                        </h1>
                    </div>
                </Content>
                <PageFooter/>
            </Layout>
        )
    }
}

export default Error;
