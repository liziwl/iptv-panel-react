import React from 'react';
import {Layout, Menu} from 'antd';
import {Input} from 'antd';
import {VideoCameraOutlined} from '@ant-design/icons';
import './App.css';
import Video from "./Video";
import {List} from 'antd';
import {Button, Space} from 'antd';
import axios from "axios";

const {Header, Content, Footer, Sider} = Layout;

const {Search} = Input;

const onSearch = searchValue => {
    console.log('use value', searchValue);
};

class App extends React.Component {
    state = {
        url: '//iptv.liziwl.cn/hls/cctv1hd.m3u8',
        openKey: '高清频道',
        channels: {},
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
                    console.log(this.state.channels);
                }
            );
    }

    handleSelect = e => {
        this.setState({openKey: e.key});
    };

    render() {
        return (
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
                                    <Space>
                                        <div
                                            id="scrollableDiv"
                                            style={{
                                                height: 500,
                                                overflow: 'auto',
                                                // padding: '0 16px',
                                                // border: '1px solid rgba(140, 140, 140, 0.35)',
                                            }}
                                        >
                                            <List
                                                header={<div style={{
                                                    paddingLeft: '16px',
                                                    fontWeight: 'bold',
                                                    fontSize: 'larger'
                                                }}>{this.state.openKey}</div>}
                                                bordered
                                                dataSource={this.state.channels[this.state.openKey]}
                                                renderItem={item => (
                                                    <List.Item>
                                                        <Button type="text"
                                                                onClick={() => {
                                                                    this.setState({url: `//iptv.liziwl.cn/hls/${item.Vid}.m3u8`});
                                                                }}
                                                        >{item.Name}</Button>
                                                    </List.Item>
                                                )}
                                            />
                                        </div>
                                        <Video
                                            url={this.state.url}
                                            width={'auto'}
                                            height={500}
                                        />
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
