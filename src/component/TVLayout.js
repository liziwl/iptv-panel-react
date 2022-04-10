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
        this.setState({vid: key});
        return url
    };

    state = {
        url: '',
        vid: '',
        liveTitle: '',
        channelListTitle: '',
        categoryActive: '',
        channels: {},
        channelsActive: [],
        drawerVisible: false,
        placement: 'right',
        mobileMode: false,
        collapsed: true,
        collapsedType: '',
        online_uv: 0,
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


    update_counter() {
        const vid_value = this.state.vid;
        if (vid_value) {
            let data = new FormData();
            data.append('vid', vid_value);
            axios.post('/status/online', data)
                .then(response => {
                    let count = response.data['online_uv'];
                    this.setState({'online_uv': count});
                });
        }
    }

    get_counter() {
        const vid_value = this.state.vid;
        if (vid_value) {
            axios.get(`/status/visitor?vid=${vid_value}`);
        }
    }


    init_channels() {
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
                        });
                    });
                    // console.log(this.state.channels);
                }
            );
    }


    componentWillUnmount() {
        clearInterval(this.update_counter_interval);
        clearInterval(this.get_counter_interval);
    }

    componentDidMount() {
        // Simple GET request using axios
        this.init_channels();
        this.update_counter();
        this.update_counter_interval = setInterval(this.update_counter, 1000 * 10);// 10秒统计一次
        this.get_counter_interval = setInterval(this.get_counter, 1000 * 5);// 5秒统计一次
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
        });
    };

    render() {
        let scrollableDiv = null;
        let switchChannelBtn = null;
        let videoHeight = "auto"
        const {online_uv} = this.state;
        if (!this.state.mobileMode) {
            scrollableDiv = (
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
                                            });
                                        }}
                                >{item.Name}</Button>
                            </List.Item>
                        )}
                    />
                </div>
            )
            videoHeight = 'calc(70vh - 60pt)'
        } else {
            switchChannelBtn = (
                <Button type="primary" size="large"
                        style={{width: '100%'}}
                        onClick={this.showDrawer}>切换频道</Button>
            )
        }

        return (
            <div>
                <Layout>
                    <Sider
                        breakpoint="lg"
                        collapsedWidth="0"
                        collapsed={this.state.collapsed}
                        onBreakpoint={broken => {
                            this.setState({mobileMode: broken});
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
                                                            });
                                                            this.onCloseDrawer();
                                                        }}
                                                >{item.Name}</Button>
                                            </List.Item>
                                        )}
                                    />
                                </Drawer>
                                <Space size="large"
                                       direction="horizontal" style={{
                                    width: '100%', justifyContent: 'center'
                                }}>
                                    {scrollableDiv}
                                    <Space direction="vertical" size="small">
                                        <Title level={3}>正在播放：{this.state.liveTitle}</Title>
                                        <Video
                                            url={this.state.url}
                                            width={'auto'}
                                            height={videoHeight}
                                        />
                                        {switchChannelBtn}
                                        <span>频道在线人数：{online_uv}</span>
                                    </Space>
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
