import React, {useEffect, useRef, useState} from 'react';
import Hls from 'hls.js';
import Artplayer from 'artplayer';

ArtVideo.defaultProps = {
    width: 800,
    height: 450
};

export default function ArtVideo(props) {

    const container = useRef();

    const [url, setUrl] = useState('');

    useEffect(() => {
        setUrl(props.url);
    }, [props.url]);

    useEffect(() => {
        if (typeof document === 'undefined') return;

        if (url) {
            let hls = new Hls();
            const player = new Artplayer({
                container: '.VideoContainer',
                url: url,
                customType: {
                    m3u8: function (video, url) {
                        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
                            hls.loadSource(url);
                        });
                        hls.attachMedia(video);
                    },
                },
                volume: 0.5,
                isLive: true,
                muted: false,
                autoplay: true,
                pip: true,
                autoSize: false,
                autoMini: true,
                screenshot: true,
                setting: true,
                loop: false,
                flip: false,
                playbackRate: false,
                aspectRatio: true,
                fullscreen: true,
                fullscreenWeb: true,
                subtitleOffset: false,
                miniProgressBar: true,
                mutex: true,
                backdrop: true,
                playsInline: true,
                autoPlayback: true,
                autoOrientation: true,
                theme: '#23ade5',
                lang: navigator.language.toLowerCase(),
                whitelist: ['*'],
                moreVideoAttr: {
                    crossOrigin: 'anonymous',
                },
            });
            return () => {
                hls.destroy();
                player.destroy();
            };
        }
    }, [url]);

    return (
        <div>
            <div className="VideoContainer" ref={container}
                 style={{width: props.width, height: props.height}}/>
        </div>
    );
}
