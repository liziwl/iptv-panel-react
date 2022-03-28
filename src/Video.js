import React, {PureComponent} from "react";
import ReactPlayer from "react-player";

class Video extends PureComponent {
    render() {
        return (
            <ReactPlayer
                width={this.props.width}
                height={this.props.height}
                pip
                controls
                config={{file: {forceHLS: true}}}
                url={this.props.url}
            />
        );
    }
}

Video.defaultProps = {
    width: '500px',
    height: 'auto'
};

export default Video;
