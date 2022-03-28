import React from 'react';
import {Button} from 'antd';
import './App.css';
import Video from "./Video";

// Render a YouTube video player
const App = () => (
    <div className="App">
        <Button type="primary">Button</Button>
        <Video url={"//iptv.tsinghua.edu.cn/hls/cctv13hd.m3u8"}/>
    </div>
);

export default App;
