import { Player, BigPlayButton, ControlBar, PlaybackRateMenuButton } from "video-react";
import { useRef } from "react";

export function VideoPlayer({ url }: { url: string }) {
    const playerRef = useRef(null);
    return (
        <Player
            ref={playerRef}
            autoPlay
            fluid
            src={`${url}?quality=480`}
        >
            <BigPlayButton position="center" />
            <ControlBar autoHide={false}>
                <PlaybackRateMenuButton rates={[0.5, 1, 1.5, 2]} />
            </ControlBar>
        </Player>
    )
}