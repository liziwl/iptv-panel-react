import React from "react";
import {Layout, Space, Typography} from 'antd';
import PageFooter from "./PageFooter";
import HeaderMenu from "./HeaderMenu";
import {default as Video} from "./player/NVideo";
import Logo from "./Logo";
import "./LiveLayout.css";
import axios from "axios";

const {Header, Content} = Layout;
const {Title} = Typography;

class LiveLayout extends React.Component {
    state = {
        online_uv: "NaN",
    };

    update_counter() {
        const vid_value = 'covid-test';
        axios.get(`${process.env.REACT_APP_SERVER_URL}/status/visitor?vid=${vid_value}`);
    }

    get_counter() {
        const vid_value = 'covid-test';
        let data = new FormData();
        data.append('vid', vid_value);
        axios.post(`${process.env.REACT_APP_SERVER_URL}/status/online`, data)
            .then(response => {
                let count = response.data['online_uv'];
                this.setState({online_uv: count});
            });
    }


    componentDidMount() {
        if (`${process.env.VISITOR_COUNTER_ENABLE}` > 0) {
            this.update_counter_init = setTimeout(() => {
                this.update_counter();
            }, 500);
            this.get_counter_init = setTimeout(() => {
                this.get_counter();
            }, 500);
            this.update_counter_interval = setInterval(() => {
                this.update_counter();
            }, 1000 * 10);// 10秒统计一次
            this.get_counter_interval = setInterval(() => {
                this.get_counter();
            }, 1000 * 5);// 5秒统计一次
        }
    }

    componentWillUnmount() {
        clearTimeout(this.update_counter_init);
        clearTimeout(this.get_counter_init);
        clearInterval(this.update_counter_interval);
        clearInterval(this.get_counter_interval);
    }


    render() {
        const url = "https://test-streams.mux.dev/test_001/stream.m3u8";
        const {online_uv} = this.state;
        return (
            <Layout className="live-layout">
                <Header style={{alignItems: "center", lineHeight: '50px', height: '50px', padding: 0}}>
                    <Logo/>
                    <HeaderMenu initKey='直播频道'/>
                </Header>

                <Content style={{margin: '16px 16px 0'}}>
                    <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                        <Title level={3}>直播频道（独占）</Title>
                        <Space direction="vertical" size="small">
                            <div style={{maxWidth: '800px'}}>
                                <Video
                                    url={url}
                                    width={'auto'}
                                />
                            </div>
                            <Title level={5}>此页不提供频道选择</Title>
                            <Title level={5}>FIND ME ON <a
                                href="https://github.com/liziwl"
                                target="_blank" rel="noreferrer">liziwl@Github</a></Title>
                            <span>直播在线人数：{online_uv}</span>
                            <span>如果对本项目感兴趣欢迎 Star。</span>
                        </Space>
                    </div>
                </Content>
                <PageFooter/>
            </Layout>
        );
    }
}

export default LiveLayout;
