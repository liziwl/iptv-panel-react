import React from "react";
import {Button, Drawer, Input, Layout, List, Menu, Space, Typography} from 'antd';
import {VideoCameraOutlined} from '@ant-design/icons';
// import Video from "./Video";
import {default as Video} from "./NVideo";
import Logo from "./Logo";
import HeaderMenu from "./HeaderMenu";
import axios from "axios";
import PageFooter from "./PageFooter";
import './TVLayout.css';
import {Link, useNavigate, useSearchParams} from "react-router-dom";


const {Header, Content, Sider} = Layout;
const {Title} = Typography;
const {Search} = Input;

function tvLayoutWithRouter(TVLayout) {
    return (props) => {
        let [searchParams, setSearchParams] = useSearchParams();
        let navigate = useNavigate();
        const params = {
            vid: searchParams.get('vid'),
            category: searchParams.get('category'),
            query: searchParams.get('query'),
        };
        return (<TVLayout {...props} setSearchParams={setSearchParams} searchParams={searchParams}
                          navigateRouter={navigate} params={params}/>);
    };
}

class TVLayout extends React.Component {

    urlFormat = key => {
        // const url = 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8'; // for test
        // const url = `http://vm.liziwl.cn/hls/${key}/index.m3u8`; // use key to router
        const url = this.state.channels.allChannels.find(x => x.vid === key)['url'];
        this.setState({vid: key});
        return url;
    };

    state = {
        url: '',
        vid: '',
        liveTitle: '',
        channelListTitle: '',
        categoryActive: '',
        categories: [],
        channels: {},
        channelsActive: [],
        drawerVisible: false,
        placement: 'right',
        mobileMode: false,
        collapsed: true,
        collapsedType: '',
        online_uv: "NaN",
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
        if (this.props.searchParams.has("query")) {
            // 因为 vid 有可能不在当前 categoryActive 中，所以不设置。
            this.props.setSearchParams({
                vid: this.state.vid
            });
        }
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
            this.resetChannelsList();
            return;
        }

        let tmpParams = this.props.searchParams;
        tmpParams.delete("category");
        tmpParams.set("query", searchValue);
        this.props.setSearchParams(tmpParams);

        const matches = this.state.channels.allChannels.filter(x => x.name.toLowerCase().includes(searchValue.toLowerCase()));
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
            axios.post(`${process.env.REACT_APP_SERVER_URL}/status/online`, data)
                .then(response => {
                    let count = response.data['online_uv'];
                    this.setState({online_uv: count});
                });
        }
    }

    get_counter() {
        const vid_value = this.state.vid;
        if (vid_value) {
            axios.get(`${process.env.REACT_APP_SERVER_URL}/status/visitor?vid=${vid_value}`);
        }
    }


    init_channels() {
        axios.get('/channels_example.json')
            .then(response => {
                    let categories = response.data['categories'];
                    let channelData = response.data['data'];
                    let allChannels = [];
                    categories.forEach(element => {
                        allChannels = allChannels.concat(channelData[element]);
                    });
                    channelData['allChannels'] = allChannels;
                    this.setState({
                        'categories': categories,
                        'channels': channelData,
                    }, () => {
                        let initKey;
                        if (this.props.params.query) {
                            // 初始化存在搜索参数
                            initKey = '';
                            let initVid;
                            let initName;
                            if (this.props.params.vid) {
                                const matches = this.state.channels.allChannels.find(o => o.vid.toLowerCase() === this.props.params.vid.toLowerCase());
                                if (matches) {
                                    initVid = matches['vid'];
                                    initName = matches['name'];
                                    this.setState({
                                        url: this.urlFormat(initVid),
                                        liveTitle: initName,
                                        categoryActive: initKey,
                                    });
                                }
                            }
                            this.handleSearch(this.props.params.query);
                        } else {
                            // 初始化无搜索参数
                            if (this.props.params.category) {
                                const validCategory = Object.keys(this.state.channels).includes(this.props.params.category);
                                if (validCategory) {
                                    initKey = this.props.params.category;
                                } else {
                                    initKey = categories[0];
                                    this.props.navigateRouter("/404");
                                    return;
                                }
                            } else {
                                initKey = categories[0];
                            }
                            let initVid;
                            let initName;
                            if (this.props.params.vid) {
                                const matches = this.state.channels.allChannels.find(o => o.vid.toLowerCase() === this.props.params.vid.toLowerCase());
                                if (matches) {
                                    initVid = matches['vid'];
                                    initName = matches['name'];
                                } else {
                                    this.props.navigateRouter("/404");
                                    return;
                                }
                            }
                            if (initVid === undefined) {
                                const initIndex = 0;
                                initVid = this.state.channels[initKey][initIndex]['vid'];
                                initName = this.state.channels[initKey][initIndex]['name'];
                            }
                            this.setState({
                                url: this.urlFormat(initVid),
                                liveTitle: initName,
                                categoryActive: initKey,
                            }, () => {
                                this.resetChannelsList();
                            });
                        }
                    });
                    // console.log(this.state.channels);
                }
            );
    }


    componentWillUnmount() {
        clearTimeout(this.update_counter_init);
        clearTimeout(this.get_counter_init);
        clearInterval(this.update_counter_interval);
        clearInterval(this.get_counter_interval);
    }

    componentDidMount() {
        // Simple GET request using axios
        this.init_channels();
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
    };


    handleSelect = e => {
        this.setState({
            categoryActive: e.key,
            url: this.urlFormat(this.state.channels[e.key][0]['vid']),
            liveTitle: this.state.channels[e.key][0]['name']
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
        let videoHeight = "auto";
        let spanWidth = "100%";
        const {online_uv} = this.state;
        if (!this.state.mobileMode) {
            scrollableDiv = (
                <div
                    id="scrollableDiv"
                    style={{
                        width: 240,
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
                        renderItem={item => {
                            function itemWarp(child, onClickCallback) {
                                return (
                                    <List.Item>
                                        <Button type="text"
                                                style={{
                                                    width: '100%',
                                                    textAlign: 'left'
                                                }}
                                                onClick={onClickCallback}
                                        >{child}</Button>
                                    </List.Item>
                                );
                            }

                            const callback = () => {
                                this.setState({
                                    url: this.urlFormat(item.vid),
                                    liveTitle: item.name
                                });
                            };

                            if (this.props.searchParams.has("query")) {
                                const child = <Link
                                    to={`/tv?query=${this.props.searchParams.get("query")}&vid=${item.vid}`}>{item.name}</Link>;
                                return itemWarp(child, callback);
                            } else {
                                const child = <Link
                                    to={`/tv?category=${this.state.categoryActive}&vid=${item.vid}`}>{item.name}</Link>;
                                return itemWarp(child, callback);
                            }
                        }}
                    />
                </div>
            );
            videoHeight = 'calc(70vh - 60pt)';
            spanWidth = 'calc(100vw - 450pt)';
        } else {
            switchChannelBtn = (
                <Button type="primary" size="large"
                        style={{width: '100%'}}
                        onClick={this.showDrawer}>切换频道</Button>
            );
        }

        let leftMenuItems = [];
        this.state.categories.forEach(element => {
            leftMenuItems.push({
                label: (<Link to={'/tv?category=' + element}>{element}</Link>),
                key: element,
                icon: (<VideoCameraOutlined/>)
            });
        });


        return (
            <div>
                <Layout>
                    <Sider
                        breakpoint="lg"
                        collapsedWidth="0"
                        collapsed={this.state.collapsed}
                        onBreakpoint={broken => {
                            this.setState({mobileMode: broken});
                            // console.log('broken', broken);
                        }}
                        onCollapse={(collapsed, type) => {
                            this.setState({
                                collapsed: collapsed,
                                collapsedType: type
                            });
                            // console.log(collapsed, type);
                        }}
                    >
                        <Logo/>
                        <Menu
                            mode="inline"
                            theme="dark"
                            selectedKeys={[this.state.categoryActive]}
                            onClick={this.handleSelect}
                            style={{height: '100%', borderRight: 0}}
                            items={leftMenuItems}
                        />
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
                                    defaultValue={this.props.params.query}
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
                                    open={this.state.drawerVisible}
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
                                                                url: this.urlFormat(item.vid),
                                                                liveTitle: item.name
                                                            });
                                                            this.onCloseDrawer();
                                                        }}
                                                ><Link
                                                    to={`/tv?category=${this.state.categoryActive}&vid=${item.vid}`}>{item.name}</Link></Button>
                                            </List.Item>
                                        )}
                                    />
                                </Drawer>
                                <Space size="large"
                                       direction="horizontal" style={{
                                    width: '100%', justifyContent: 'center'
                                }}>
                                    {scrollableDiv}
                                    <Space direction="vertical" size="small" style={{
                                        width: spanWidth
                                    }}>
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
        );
    }
}

export default tvLayoutWithRouter(TVLayout);
