import ReactPlayer from "react-player";

const Video = ({width, height, url}) => {
    return (
        <div style={{width: width, maxWidth: '100%'}}>
            <ReactPlayer
                width='100%'
                height={height}
                pip
                controls
                playsinline
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
                url={url}
            />
        </div>
    );
};

Video.defaultProps = {
    width: '500px',
    height: 'auto'
};

export default Video;
