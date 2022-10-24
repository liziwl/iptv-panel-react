import {Menu} from "antd";
import {Link} from "react-router-dom";

const items = [
    {
        label: (<Link to="/tv">电视频道</Link>),
        key: '电视频道',
    },
    {
        label: (<Link to="/live">直播频道</Link>),
        key: '直播频道',
    },
];


const HeaderMenu = ({initKey}) => {
    return (<Menu
        theme="dark"
        mode="horizontal"
        items={items}
        defaultSelectedKeys={[initKey]}
    />);
};
HeaderMenu.defaultProps = {
    initKey: items[0].key,
};

export default HeaderMenu;
