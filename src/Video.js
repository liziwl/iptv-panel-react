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
                    config={{
                        file: {
                            forceHLS: true,
                            // hlsOptions: {
                            //     maxMaxBufferLength: 5,
                            //     liveSyncDuration: 2,
                            //     liveMaxLatencyDuration: 3,
                            //     backBufferLength: 30,
                            //     nudgeMaxRetry: 10,
                            // },
                        },
                    }}
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
