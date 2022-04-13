import React from "react";
import "./Logo.css";

class Logo extends React.Component {
    render() {
        return (
            <div className="logo">
                <a href="/"><img src="/logo.svg" alt="logo"/></a>
                <span><a href="/">IPTV</a></span>
            </div>
        );
    }
}

export default Logo;
