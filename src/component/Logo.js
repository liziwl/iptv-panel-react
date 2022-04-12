import React from "react";
import "./Logo.css"

class Logo extends React.Component {
    render() {
        return (
            <a href="/">
                <div className="logo">
                    <img src="/logo.svg" alt="logo"/>
                    <span>IPTV</span>
                </div>
            </a>
        )
    }
}

export default Logo;
