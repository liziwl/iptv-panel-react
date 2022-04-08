import React from "react";
import {Layout, Typography} from 'antd';
import PageFooter from "./PageFooter";
import HeaderMenu from "./HeaderMenu"
import {default as Video} from "./NVideo";
import Logo from "./Logo";
import "./LiveLayout.css"

const {Header, Content} = Layout;
const {Title} = Typography;

class LiveLayout extends React.Component {
    render() {
        const url = "https://live.cra.moe/hls/0/stream.m3u8";
        return (
            <Layout className="live-layout">
                <Header style={{alignItems: "center", lineHeight: '50px', height: '50px', padding: 0}}>
                    <Logo/>
                    <HeaderMenu initKey='直播频道'/>
                </Header>

                <Content style={{margin: '16px 16px 0'}}>
                    <div className="site-layout-background" style={{padding: 24, minHeight: 360, textAlign: "center"}}>
                        <Title level={3}>核酸检测队伍实况</Title>
                        <Video
                            url={url}
                            width={'auto'}
                            height={'70vh'}
                        />
                    </div>
                </Content>
                <PageFooter/>
            </Layout>
        )
    }
}

export default LiveLayout;
