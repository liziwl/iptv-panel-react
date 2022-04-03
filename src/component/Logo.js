import React from "react";
import "./Logo.css"

class Logo extends React.Component {
    render() {
        return (
            <div className="logo">
                <img src="/logo.svg"/>
                <span>IPTV</span>
            </div>
        )
    }
}

export default Logo;
