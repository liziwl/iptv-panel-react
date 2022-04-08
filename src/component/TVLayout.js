import React from "react";
import {Button, Drawer, Input, Layout, List, Menu, Space, Typography} from 'antd';
import {VideoCameraOutlined} from '@ant-design/icons';
// import Video from "./Video";
import {default as Video} from "./NVideo";
import Logo from "./Logo"
import HeaderMenu from "./HeaderMenu"
import axios from "axios";
import PageFooter from "./PageFooter";
import './TVLayout.css';


const {Header, Content, Sider} = Layout;
const {Title} = Typography;
const {Search} = Input;


class TVLayout extends React.Component {

    urlFormat = key => {
        const url = `/hls/${key}.m3u8`;
        return url
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
        return (
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
                        <Logo/>
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
                            <HeaderMenu initKey="电视频道"></HeaderMenu>
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
                                    placement={this.state.placement}
                                    onClose={this.onCloseDrawer}
                                    visible={this.state.drawerVisible}
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
                        <PageFooter/>
                    </Layout>
                </Layout>

            </div>
        )
    }
}

export default TVLayout;
