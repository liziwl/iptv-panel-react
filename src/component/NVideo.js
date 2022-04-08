import React, {useEffect, useRef, useState} from 'react';
import Player, {EVENT} from 'nplayer'
import Hls from 'hls.js'

export default function Video() {

    const container = useRef()

    useEffect(() => {

        if (typeof document === 'undefined') return;

        const player = new Player({
            thumbnail: {
                startSecond: 1,
            },
            // i18n: locale,
            volumeVertical: true,
            controls: [
                ['play', 'volume', 'spacer', 'airplay', 'web-fullscreen', 'fullscreen'],
            ],
        })

        player.on(EVENT.WEB_ENTER_FULLSCREEN, () => {
            document.body.style.overflow = 'hidden'
        })
        player.on(EVENT.WEB_EXIT_FULLSCREEN, () => {
            document.body.style.overflow = ''
        })

        const hls = new Hls();
        hls.on(Hls.Events.MEDIA_ATTACHED, function () {
            hls.loadSource("https://iptv.liziwl.cn/hls/cctv1hd.m3u8")
        })

        hls.attachMedia(player.video)
        player.mount(container.current);


        return () => {
            hls.destroy()
            player.dispose()
        }
    }, [])
    return (
        <div>
            <div className="VideoContainer" ref={container}></div>
        </div>
    );
}
