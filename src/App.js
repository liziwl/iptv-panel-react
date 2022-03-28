import React from 'react';
import {Layout, Menu} from 'antd';
import {Input} from 'antd';
import {VideoCameraOutlined} from '@ant-design/icons';
import './App.css';
import Video from "./Video";

const {Header, Content, Footer, Sider} = Layout;

const {Search} = Input;

const onSearch = searchValue => {
    console.log('use value', searchValue);
};

const App = () => (
    <div className="App">
        <div>
            <Layout>
                <Sider
                    breakpoint="lg"
                    collapsedWidth="0"
                    onBreakpoint={broken => {
                        console.log(broken);
                    }}
                    onCollapse={(collapsed, type) => {
                        console.log(collapsed, type);
                    }}
                >
                    <div className="logo"/>
                    <Menu
                        mode="inline"
                        theme="dark"
                        defaultSelectedKeys={['cat1']}
                        style={{height: '100%', borderRight: 0}}
                    >
                        <Menu.Item icon={<VideoCameraOutlined/>} key="cat1">高清频道</Menu.Item>
                        <Menu.Item icon={<VideoCameraOutlined/>} key="cat2">特色频道</Menu.Item>
                        <Menu.Item icon={<VideoCameraOutlined/>} key="cat3">央视标清</Menu.Item>
                        <Menu.Item icon={<VideoCameraOutlined/>} key="cat4">其他标清</Menu.Item>
                    </Menu>
                </Sider>
                <Layout>
                    <Header className="site-layout-sub-header-background"
                            style={{lineHeight: '50px', height: '50px', padding: 0}}
                    >
                        <Menu
                            theme="dark"
                            mode="horizontal"
                            defaultSelectedKeys={['nav1']}
                        >
                            <Menu.Item key="nav1">电视频道</Menu.Item>
                            <Menu.Item key="nav2">自建频道</Menu.Item>
                        </Menu>
                    </Header>
                    <div className="iptv-search left-search">
                        <Search placeholder="频道搜索"
                                size="large"
                                allowClear
                                onSearch={onSearch}
                                style={{width: 200}}
                        />
                    </div>

                    <Content style={{margin: '16px 16px 0'}}>
                        <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                            <Video
                                url={"//iptv.liziwl.cn/hls/cctv13hd.m3u8"}
                                width={720}
                            />
                        </div>
                    </Content>
                    <Footer style={{textAlign: 'center'}}>
                        © 2022 Created by <a href="https://github.com/liziwl/" target="_blank">liziwl</a>, Powered by <a
                        href="https://ant.design/docs/react/introduce-cn" target="_blank">Ant Design</a>
                    </Footer>

                </Layout>
            </Layout>

        </div>
    </div>
);

export default App;
