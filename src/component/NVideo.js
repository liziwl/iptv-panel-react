import React, {useEffect, useRef, useState} from 'react';
import Player, {EVENT} from 'nplayer'
import Hls from 'hls.js'

NVideo.defaultProps = {
    width: '500px',
    height: 'auto'
};

export default function NVideo(props) {

    const container = useRef()

    const [url, setUrl] = useState('');

    useEffect(() => {
        setUrl(props.url);
    }, [props.url])

    useEffect(() => {
        if (typeof document === 'undefined') return;

        if (url) {
            const player = new Player({
                thumbnail: {
                    startSecond: 1,
                },
                volumeVertical: false,
                // controls: [
                //     ['play', 'volume', 'spacer', 'airplay', 'web-fullscreen', 'fullscreen'],
                // ],
                live: true
            })

            player.on(EVENT.WEB_ENTER_FULLSCREEN, () => {
                document.body.style.overflow = 'hidden'
            })
            player.on(EVENT.WEB_EXIT_FULLSCREEN, () => {
                document.body.style.overflow = ''
            })

            const hls = new Hls();
            hls.on(Hls.Events.MEDIA_ATTACHED, function () {
                hls.loadSource(url)
            })

            hls.attachMedia(player.video)
            player.mount(container.current);

            return () => {
                hls.destroy()
                player.dispose()
            }
        }
    }, [url])

    return (
        <div>
            <div className="VideoContainer" ref={container}
                 style={{width: props.width, maxWidth: '100%', height: props.height}}/>
        </div>
    );
}
