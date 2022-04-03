import React from "react";
import "./Logo.css"

class Logo extends React.Component {
    render() {
        return (
            <div className="logo">
                <img src="/logo.svg" style={{height: '40px', paddingTop: '5px', paddingRight: '5px'}}/>
                <span style={{
                    marginTop: '20px', display: 'table-cell',
                    verticalAlign: 'middle'
                }}>IPTV</span>
            </div>
        )
    }
}

export default Logo;
