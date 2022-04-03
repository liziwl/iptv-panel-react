import React, {PureComponent} from "react";
import {Col, Layout, Row} from "antd";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faGears, faHeart} from "@fortawesome/free-solid-svg-icons";
import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {faCopyright} from "@fortawesome/free-regular-svg-icons";

const {Footer} = Layout;

class PageFooter extends PureComponent {

    render() {
        return (
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
        )
    }
}

export default PageFooter;