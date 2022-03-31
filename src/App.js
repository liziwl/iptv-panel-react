import React from 'react';
import {Button, Col, Drawer, Input, Layout, List, Menu, Row, Space, Typography} from 'antd';
import {VideoCameraOutlined} from '@ant-design/icons';
import './App.css';
import Video from "./Video";
import axios from "axios";

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faGithub} from '@fortawesome/free-brands-svg-icons'
import {faCopyright} from '@fortawesome/free-regular-svg-icons'
import {faGears, faHeart} from '@fortawesome/free-solid-svg-icons'

const {Header, Content, Footer, Sider} = Layout;
const {Title} = Typography;

const {Search} = Input;


class App extends React.Component {

    urlFormat = key => {
        return `//iptv.liziwl.cn/hls/${key}.m3u8`
    };

    state = {
        url: '',
        mobileUrl: '',
        desktopUrl: '',
        liveTitle: '',
        channelListTitle: '',
        categoryActive: '',
        channels: {},
        channelsActive: [],
        drawerVisible: false,
        placement: 'right',
        mobileMode: false,
        showDesktop: true,
        showMobile: false,
        collapsed: true,
        collapsedType: '',
    };

    resetChannelsList = () => {
        let prefix = "";
        if (this.state.mobileMode) {
            prefix = "频道切换 - ";
        }
        this.setState({
            channelListTitle: `${prefix}${this.state.categoryActive}`,
            channelsActive: this.state.channels[this.state.categoryActive]
        });
    };

    onLiveSearch = e => {
        if (e.type === 'click') {
            // console.log("click");
            this.resetChannelsList();
            return;
        }
        if (this.state.mobileMode) {
            return;
        }
        const searchValue = e.target.value;
        if (searchValue === '') {
            // console.log("null input");
            this.resetChannelsList();
        } else {
            this.handleSearch(searchValue);
        }
    };

    handleSearch = searchValue => {
        // console.log('use value', searchValue);
        if (searchValue === '') {
            return;
        }
        const matches = this.state.channels.allChannels.filter(x => x.Name.toLowerCase().includes(searchValue.toLowerCase()));
        this.setState({
            channelListTitle: `搜索结果 - ${searchValue}`,
            channelsActive: matches
        }, () => {
            if (this.state.mobileMode) {
                this.showDrawer();
            }
        });
        // console.log('matches', matches);
    };

    showDrawer = () => {
        this.setState({
            drawerVisible: true,
        });
    };

    onCloseDrawer = () => {
        this.setState({
            drawerVisible: false,
        }, () => {
            this.resetChannelsList();
        });
    };

    onChangeMobileMode = () => {
        if (this.state.mobileMode) {
            this.setState({
                showDesktop: 'none',
                desktopUrl: null,
                showMobile: true,
                mobileUrl: this.state.url,
            });
        } else {
            this.setState({
                showDesktop: true,
                desktopUrl: this.state.url,
                showMobile: 'none',
                mobileUrl: null,
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
                    let allChannels = cat1.concat(cat2, cat3, cat4);
                    this.setState({
                        channels: {
                            '高清频道': cat1,
                            '特色频道': cat2,
                            '央视标清': cat3,
                            '其他标清': cat4,
                            'allChannels': allChannels
                        }
                    }, () => {
                        const initIndex = 0;
                        const initKey = '高清频道';
                        this.setState({
                            url: this.urlFormat(this.state.channels[initKey][initIndex]['Vid']),
                            liveTitle: this.state.channels[initKey][initIndex]['Name'],
                            categoryActive: initKey,
                        }, () => {
                            this.resetChannelsList();
                            this.onChangeMobileMode();
                        });
                    });
                    // console.log(this.state.channels);
                }
            );
    };


    handleSelect = e => {
        this.setState({
            categoryActive: e.key,
            url: this.urlFormat(this.state.channels[e.key][0]['Vid']),
            liveTitle: this.state.channels[e.key][0]['Name']
        }, () => {
            this.resetChannelsList();
            if (this.state.collapsedType === 'clickTrigger') {
                this.setState({collapsed: true});
            }
            this.onChangeMobileMode();
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
                            collapsed={this.state.collapsed}
                            onBreakpoint={broken => {
                                this.setState({mobileMode: broken}, this.onChangeMobileMode);
                                console.log('broken', broken);
                            }}
                            onCollapse={(collapsed, type) => {
                                this.setState({
                                    collapsed: collapsed,
                                    collapsedType: type
                                })
                                console.log(collapsed, type);
                            }}
                        >
                            <div className="logo">
                                <img src="/logo.svg" style={{height: '40px', paddingTop: '5px', paddingRight: '5px'}}/>
                                <span style={{
                                    marginTop: '20px', display: 'table-cell',
                                    verticalAlign: 'middle'
                                }}>IPTV</span>
                            </div>
                            <Menu
                                mode="inline"
                                theme="dark"
                                defaultSelectedKeys={['高清频道']}
                                onClick={this.handleSelect}
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
                                    {/*<Menu.Item key="nav2">自建频道</Menu.Item>*/}
                                </Menu>
                            </Header>
                            <div className="iptv-search left-search">
                                <Search placeholder="频道搜索"
                                        size="large"
                                        allowClear
                                        onChange={this.onLiveSearch}
                                        onSearch={this.handleSearch}
                                        style={{width: 200}}
                                />
                            </div>

                            <Content style={{margin: '16px 16px 0'}}>
                                <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                                    <Drawer
                                        title={this.state.channelListTitle}
                                        placement={placement}
                                        onClose={this.onCloseDrawer}
                                        visible={drawerVisible}
                                        bodyStyle={{paddingTop: 0}}
                                        width={'75vw'}
                                    >
                                        <List
                                            id={"mobile-channel-list"}
                                            dataSource={this.state.channelsActive}
                                            renderItem={item => (
                                                <List.Item>
                                                    <Button type="text"
                                                            style={{
                                                                width: '100%',
                                                                textAlign: 'left'
                                                            }}
                                                            onClick={() => {
                                                                this.setState({
                                                                    url: this.urlFormat(item.Vid),
                                                                    liveTitle: item.Name
                                                                }, this.onChangeMobileMode);
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
                                                id={"desktop-channel-list"}
                                                header={<div style={{
                                                    fontWeight: 'bold',
                                                    fontSize: 'larger',
                                                    minWidth: '180px'
                                                }}>{this.state.channelListTitle}</div>}
                                                bordered
                                                dataSource={this.state.channelsActive}
                                                renderItem={item => (
                                                    <List.Item>
                                                        <Button type="text"
                                                                style={{
                                                                    width: '100%',
                                                                    textAlign: 'left'
                                                                }}
                                                                onClick={() => {
                                                                    this.setState({
                                                                        url: this.urlFormat(item.Vid),
                                                                        liveTitle: item.Name
                                                                    }, this.onChangeMobileMode);
                                                                }}
                                                        >{item.Name}</Button>
                                                    </List.Item>
                                                )}
                                            />
                                        </div>
                                        <Space direction="vertical" size="small">
                                            <Title level={3}>正在播放：{this.state.liveTitle}</Title>
                                            <Video
                                                url={this.state.desktopUrl}
                                                width={'auto'}
                                                height={'calc(70vh - 36pt)'}
                                            />
                                        </Space>
                                    </Space>
                                    <Space size="small"
                                           direction="vertical" style={{
                                        width: '100%', justifyContent: 'center', display: this.state.showMobile
                                    }}>
                                        <Title level={3}>正在播放：{this.state.liveTitle}</Title>
                                        <Video
                                            url={this.state.mobileUrl}
                                            width={'auto'}
                                        />
                                        <Button type="primary" size="large"
                                                style={{width: '100%'}}
                                                onClick={this.showDrawer}>切换频道</Button>
                                    </Space>

                                </div>
                            </Content>
                            <Footer style={{textAlign: 'center'}}>
                                <Row justify="center">
                                    <Col lg={4} sm={12} xs={24}>
                                        <FontAwesomeIcon icon={faHeart}/> 感谢清华IPTV提供视频源
                                    </Col>
                                    <Col lg={4} sm={12} xs={24}>
                                        <FontAwesomeIcon icon={faGithub}/> <a
                                        href="https://github.com/liziwl/iptv-panel-react"
                                        target="_blank">GitHub</a>
                                    </Col>
                                    <Col lg={4} sm={12} xs={24}>
                                        <FontAwesomeIcon icon={faCopyright}/> 2022 Created by <a
                                        href="https://github.com/liziwl/" target="_blank">liziwl</a>
                                    </Col>
                                    <Col lg={4} sm={12} xs={24}>
                                        <FontAwesomeIcon icon={faGears}/> Powered by <a
                                        href="https://ant.design/docs/react/introduce-cn" target="_blank">Ant Design</a>
                                    </Col>
                                </Row>
                            </Footer>

                        </Layout>
                    </Layout>

                </div>
            </div>
        );
    }
}


export default App;
