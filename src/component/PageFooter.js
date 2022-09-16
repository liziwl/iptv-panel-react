import React, {PureComponent} from "react";
import {Col, Layout, Row} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGears, faHeart, faUser} from "@fortawesome/free-solid-svg-icons";
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {faCopyright} from "@fortawesome/free-regular-svg-icons";
import axios from "axios";

const {Footer} = Layout;

class PageFooter extends PureComponent {

    state = {
        online_uv: 0,
    };

    get_counter() {
        axios.get(`${process.env.REACT_APP_SERVER_URL}/status/onlineall`).then(response => {
            let count = response.data['online_uv'];
            this.setState({online_uv: count});
        });
    }


    componentDidMount() {
        this.get_counter_init = setTimeout(() => {
            this.get_counter();
        }, 500);
        this.get_counter_interval = setInterval(() => {
            this.get_counter();
        }, 1000 * 5);// 5秒统计一次
    }

    componentWillUnmount() {
        clearTimeout(this.get_counter_init);
        clearInterval(this.get_counter_interval);
    }


    render() {
        const {online_uv} = this.state;
        return (
            <Footer style={{textAlign: 'center'}}>
                <Row justify="center">
                    <Col lg={4} sm={12} xs={24}>
                        <FontAwesomeIcon icon={faUser}/> 当前在线人数：{online_uv}
                    </Col>
                    <Col lg={4} sm={12} xs={24}>
                        <FontAwesomeIcon icon={faHeart}/> 感谢热心网友提供电视频道源
                    </Col>
                    <Col lg={4} sm={12} xs={24}>
                        <FontAwesomeIcon icon={faGithub}/> <a
                        href="https://github.com/liziwl/iptv-panel-react"
                        target="_blank" rel="noreferrer">GitHub</a>
                    </Col>
                    <Col lg={4} sm={12} xs={24}>
                        <FontAwesomeIcon icon={faCopyright}/> 2022 Created by <a
                        href="https://github.com/liziwl/" target="_blank" rel="noreferrer">liziwl</a>
                    </Col>
                    <Col lg={4} sm={12} xs={24}>
                        <FontAwesomeIcon icon={faGears}/> Powered by <a
                        href="https://ant.design/docs/react/introduce-cn" target="_blank" rel="noreferrer">Ant
                        Design</a>
                    </Col>
                </Row>
            </Footer>
        );
    }
}

export default PageFooter;
