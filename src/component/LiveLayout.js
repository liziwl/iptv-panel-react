import React from "react";
import {Layout, Space, Typography} from 'antd';
import PageFooter from "./PageFooter";
import HeaderMenu from "./HeaderMenu"
import {default as Video} from "./NVideo";
import Logo from "./Logo";
import "./LiveLayout.css"
import axios from "axios";

const {Header, Content} = Layout;
const {Title} = Typography;

class LiveLayout extends React.Component {
    state = {
        online_uv: 0,
    };

    update_counter() {
        axios.get('https://iptv.liziwl.cn/status/visitor?vid=covid-test');
        let data = new FormData();
        data.append('vid', 'covid-test');
        axios.post('https://iptv.liziwl.cn/status/online', data)
            .then(response => {
                let count = response.data['online_uv'];
                this.setState({'online_uv': count});
            });
    }


    componentDidMount() {
        this.update_counter();
        this.interval = setInterval(() => {
            this.update_counter();
            // 10秒统计一次
        }, 1000 * 10);

    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }


    render() {
        const url = "https://live.cra.moe/hls/0/stream.m3u8";
        const {online_uv} = this.state;
        return (
            <Layout className="live-layout">
                <Header style={{alignItems: "center", lineHeight: '50px', height: '50px', padding: 0}}>
                    <Logo/>
                    <HeaderMenu initKey='直播频道'/>
                </Header>

                <Content style={{margin: '16px 16px 0'}}>
                    <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                        <Title level={3}>CRA Live 核酸检测队伍实况</Title>
                        <Space direction="vertical" size="small">
                            <div style={{maxWidth: '800px'}}>
                                <Video
                                    url={url}
                                    width={'auto'}
                                />
                            </div>
                            <Title level={5}>CRA提供的直播服务，直播时间为每日 10:00-20:00</Title>
                            <Title level={5}>FIND ME ON <a
                                href="https://sustech.online/"
                                target="_blank" rel="noreferrer">📚南科手册</a></Title>
                            <span>当前在线人数：{online_uv}</span>
                            <span>请大家根据现场排队情况选择人员较少时前往。</span>
                            <span>本站仅提供实况直播，不会对画面进行录制和存储，也不会使用程序对直播的画面进行任何分析。</span>
                        </Space>
                    </div>
                </Content>
                <PageFooter/>
            </Layout>
        )
    }
}

export default LiveLayout;
