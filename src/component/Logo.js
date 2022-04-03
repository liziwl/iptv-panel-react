import React from "react";
import "./Logo.css"

class Logo extends React.Component {
    render() {
        return (
            <div className="logo">
                <img src="/logo.svg" alt="logo"/>
                <span>IPTV</span>
            </div>
        )
    }
}

export default Logo;
