import React, {PureComponent} from "react";
import ReactPlayer from "react-player";

class Video extends PureComponent {
    render() {
        return (
            <div style={{width: this.props.width, maxWidth: '100%'}}>
                <ReactPlayer
                    width='100%'
                    height={this.props.height}
                    pip
                    controls
                    config={{file: {forceHLS: true}}}
                    url={this.props.url}
                />
            </div>
        );
    }
}

Video.defaultProps = {
    width: '500px',
    height: 'auto'
};

export default Video;
