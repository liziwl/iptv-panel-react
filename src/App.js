import React from 'react';
import {Button, Drawer, Input, Layout, List, Menu, Space} from 'antd';
import {VideoCameraOutlined} from '@ant-design/icons';
import './App.css';
import Video from "./Video";
import axios from "axios";

const {Header, Content, Footer, Sider} = Layout;

const {Search} = Input;

const onSearch = searchValue => {
    console.log('use value', searchValue);
};

class App extends React.Component {

    urlFormat = key => {
        return `//iptv.liziwl.cn/hls/${key}.m3u8`
    };

    state = {
        url: this.urlFormat('cctv1hd'),
        openKey: '高清频道',
        channels: {},
        drawerVisible: false,
        placement: 'right',
        showDesktop: true,
        showMobile: false
    };

    showDrawer = () => {
        this.setState({
            drawerVisible: true,
        });
    };

    onCloseDrawer = () => {
        this.setState({
            drawerVisible: false,
        });
    };

    handleMobileMode = mode => {
        if (mode) {
            this.setState({
                showDesktop: 'none',
                showMobile: true
            });
        } else {
            this.setState({
                showDesktop: true,
                showMobile: 'none'
            });
        }
    };


    componentDidMount() {
        // Simple GET request using axios
        axios.get('/channels_sustech.json')
            .then(response => {
                    let tmp_data = response.data['Categories'];
                    let cat1 = tmp_data.find(o => o.Name === '高清频道')['Channels'];
                    let cat2 = tmp_data.find(o => o.Name === '特色频道')['Channels'];
                    let cat3 = tmp_data.find(o => o.Name === '央视标清')['Channels'];
                    let cat4 = tmp_data.find(o => o.Name === '其他标清')['Channels'];
                    this.setState({
                        channels: {
                            '高清频道': cat1,
                            '特色频道': cat2,
                            '央视标清': cat3,
                            '其他标清': cat4,
                        }
                    });
                    // console.log(this.state.channels);
                }
            );
    };

    handleSelect = e => {
        this.setState({
            openKey: e.key,
            url: this.urlFormat(this.state.channels[e.key][0]['Vid'])
        });
    };

    render() {
        const {placement, drawerVisible} = this.state;
        return (
            <div className="App">
                <div>
                    <Layout>
                        <Sider
                            breakpoint="lg"
                            collapsedWidth="0"
                            onBreakpoint={broken => {
                                console.log('broken', broken);
                                this.handleMobileMode(broken);
                            }}
                            onCollapse={(collapsed, type) => {
                                console.log(collapsed, type);
                            }}
                        >
                            <div className="logo"/>
                            <Menu
                                mode="inline"
                                theme="dark"
                                defaultSelectedKeys={['高清频道']}
                                onSelect={this.handleSelect}
                                style={{height: '100%', borderRight: 0}}
                            >
                                <Menu.Item icon={<VideoCameraOutlined/>} key="高清频道">高清频道</Menu.Item>
                                <Menu.Item icon={<VideoCameraOutlined/>} key="特色频道">特色频道</Menu.Item>
                                <Menu.Item icon={<VideoCameraOutlined/>} key="央视标清">央视标清</Menu.Item>
                                <Menu.Item icon={<VideoCameraOutlined/>} key="其他标清">其他标清</Menu.Item>
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
                                    <Drawer
                                        title={`频道切换 - ${this.state.openKey}`}
                                        placement={placement}
                                        onClose={this.onCloseDrawer}
                                        visible={drawerVisible}
                                        bodyStyle={{paddingTop: 0}}
                                        width={'75vw'}
                                    >
                                        <List
                                            dataSource={this.state.channels[this.state.openKey]}
                                            renderItem={item => (
                                                <List.Item>
                                                    <Button type="text"
                                                            style={{
                                                                width: '100%',
                                                                textAlign: 'left'
                                                            }}
                                                            onClick={() => {
                                                                this.setState({url: this.urlFormat(item.Vid)});
                                                                this.onCloseDrawer();
                                                            }}
                                                    >{item.Name}</Button>
                                                </List.Item>
                                            )}
                                        />
                                    </Drawer>
                                    <Space size="large"
                                           direction="horizontal" style={{
                                        width: '100%', justifyContent: 'center', display: this.state.showDesktop
                                    }}>
                                        <div
                                            id="scrollableDiv"
                                            style={{
                                                height: '70vh',
                                                overflow: 'auto',
                                                // padding: '0 16px',
                                                // border: '1px solid rgba(140, 140, 140, 0.35)',
                                            }}
                                        >
                                            <List
                                                header={<div style={{
                                                    fontWeight: 'bold',
                                                    fontSize: 'larger',
                                                    minWidth: '180px'
                                                }}>{this.state.openKey}</div>}
                                                bordered
                                                dataSource={this.state.channels[this.state.openKey]}
                                                renderItem={item => (
                                                    <List.Item>
                                                        <Button type="text"
                                                                style={{
                                                                    width: '100%',
                                                                    textAlign: 'left'
                                                                }}
                                                                onClick={() => {
                                                                    this.setState({url: this.urlFormat(item.Vid)});
                                                                }}
                                                        >{item.Name}</Button>
                                                    </List.Item>
                                                )}
                                            />
                                        </div>
                                        <Video
                                            url={this.state.url}
                                            width={'auto'}
                                            height={'70vh'}
                                        />
                                    </Space>
                                    <Space size="small"
                                           direction="vertical" style={{
                                        width: '100%', justifyContent: 'center', display: this.state.showMobile
                                    }}>
                                        <Video
                                            url={this.state.url}
                                            width={'auto'}
                                        />
                                        <Button type="primary" size="large"
                                                style={{width: '100%'}}
                                                onClick={this.showDrawer}>切换频道</Button>
                                    </Space>

                                </div>
                            </Content>
                            <Footer style={{textAlign: 'center'}}>
                                © 2022 Created by <a href="https://github.com/liziwl/" target="_blank">liziwl</a>,
                                Powered by <a
                                href="https://ant.design/docs/react/introduce-cn" target="_blank">Ant Design</a>
                            </Footer>

                        </Layout>
                    </Layout>

                </div>
            </div>
        );
    }
}


export default App;
