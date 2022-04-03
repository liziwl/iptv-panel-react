import React from "react";
import {Button, Drawer, Input, Layout, List, Menu, Space, Typography} from 'antd';
import {VideoCameraOutlined} from '@ant-design/icons';
import Logo from "./Logo"
import PageFooter from "./PageFooter";
import './CustomLayout.css';
import {Link} from "react-router-dom";


const {Header, Content, Sider} = Layout;


class CustomLayout extends React.Component {

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

    showDrawer = () => {
        this.setState({
            drawerVisible: true,
        });
    };

    onCloseDrawer = () => {
        this.setState({
            drawerVisible: false,
        }, () => {
            console.log("onCloseDrawer, callback")
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

    handleSelect = e => {
        console.log("handleSelect");
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
                            defaultSelectedKeys={['频道']}
                            // onClick={this.handleSelect}
                            style={{height: '100%', borderRight: 0}}
                        >
                            <Menu.Item icon={<VideoCameraOutlined/>} key="频道">频道</Menu.Item>
                        </Menu>
                    </Sider>
                    <Layout>
                        <Header className="site-layout-sub-header-background"
                                style={{lineHeight: '50px', height: '50px', padding: 0}}
                        >
                            <Menu
                                theme="dark"
                                mode="horizontal"
                                defaultSelectedKeys={['nav2']}
                            >
                                <Menu.Item key="nav1"><Link to="/TV">电视频道</Link></Menu.Item>
                                <Menu.Item key="nav2"><Link to="/Custom">自建频道</Link></Menu.Item>
                            </Menu>
                        </Header>

                        <Content style={{margin: '16px 16px 0'}}>
                            <div className="site-layout-background" style={{padding: 24, minHeight: 360}}>
                                暂无内容
                            </div>
                        </Content>
                        <PageFooter/>
                    </Layout>
                </Layout>

            </div>
        )
    }
}

export default CustomLayout;
