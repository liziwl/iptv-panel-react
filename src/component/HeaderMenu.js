import React, {PureComponent} from "react";
import {Menu} from "antd";
import {Link} from "react-router-dom";

class HeaderMenu extends PureComponent {
    render() {
        return (
            <Menu
                theme="dark"
                mode="horizontal"
                defaultSelectedKeys={[this.props.initKey]}
            >
                <Menu.Item key="电视频道"><Link to="/tv">电视频道</Link></Menu.Item>
                <Menu.Item key="直播频道"><Link to="/live">直播频道</Link></Menu.Item>
            </Menu>
        )
    }
}

HeaderMenu.defaultProps = {
    initKey: '电视频道',
};

export default HeaderMenu;
