import React from "react";
import {Layout} from 'antd';
import PageFooter from "./PageFooter";
import Logo from "./Logo";
import "./Error.css"
import {Link} from "react-router-dom";

const {Header, Content} = Layout;

class Error extends React.Component {
    render() {
        return (
            <Layout className="layout">
                <Header style={{alignItems: "center"}}>
                    <Logo/>
                </Header>
                <Content style={{margin: '16px 16px 0'}}>
                    <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                        {/* link跳转 */}
                        <Link to="/">回到首页</Link>
                    </div>
                </Content>
                <PageFooter/>
            </Layout>
        )
    }
}

export default Error;
