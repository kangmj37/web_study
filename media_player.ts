enum MediaType{
    MEDIA_TYPE_UNKNOWN,
    MEDIA_TYPE_MUSIC,
    MEDIA_TYPE_PHOTO,
    MEDIA_TYPE_VIDEO
}

abstract class commonMedia {
    mediaName: string;
    mediaSize: number;
    mediaPermission: number;
    mediaType: MediaType;
    decoder(): void {}
    constructor() {};
}

enum MusicType{
    MUSIC_TYPE_UNKNOWN,
    MUSIC_TYPE_MP3,
    MUSIC_TYPE_WMV
}

abstract class Music extends commonMedia {
    musicAlbum: string;
    musicSinger: string;
    musicTitle: string;
    musicLyric: string;
    musicType: MusicType;
    constructor() { super() };
}

class Mp3 extends Music {
    constructor() { super() };
}

class Wmv extends Music {
    constructor() { super() };
}

enum PhotoType{
    PHOTO_TYPE_UNKNOWN,
    PHOTO_TYPE_JPEG,
    PHOTO_TYPE_PNG
}

abstract class Photo extends commonMedia {
    protected photoDate: Date;
    photoLocation: string;
    photoResolution: [number, number];
    photoType: PhotoType;
    constructor() { super() };
}

class Jpeg extends Photo {
    constructor() { super() };
}

class Png extends Photo {
    constructor() { super() };
}

enum VideoType{
    VIDEO_TYPE_UNKNOWN,
    VIDEO_TYPE_MP4,
    VIDEO_TYPE_MKV
}

abstract class Video extends commonMedia {
    videoFps: number;
    videoRate: number;
    videoAcodec: string;
    videoVcodec: string;
    videoType: VideoType;
    constructor() { super() };
}

class Mp4 extends Video {
    constructor() { super() };
}

class Mkv extends Video {
    constructor() { super() };
}

interface Buttons {
    play(): void;
    stop(): void;
    pause(): void;
    seek(): void;
}

interface Viewer {
    view(): void;
}

class Player implements Buttons, Viewer {
    media: commonMedia;
    offset: number;
    public play(): void {};
    public stop(): void {};
    public pause(): void {};
    public seek(): void {};
    public view(): void {};
    private _decode_photo_type(file: string): PhotoType {
        return PhotoType.PHOTO_TYPE_UNKNOWN;
    }
    private _decode_video_type(file: string): VideoType {
        return VideoType.VIDEO_TYPE_UNKNOWN;
    }
    private _decode_music_type(file: string): MusicType {
        return MusicType.MUSIC_TYPE_UNKNOWN;
    }
    private _decode_media_type(file: string): MediaType {
        return MediaType.MEDIA_TYPE_UNKNOWN;
    }
    public load(file: string): void {
        let media_type: MediaType = this._decode_media_type(file);
        this.offset = 0;
        this.media = undefined;
        if (media_type == MediaType.MEDIA_TYPE_MUSIC) {
            let music_type: MusicType = this._decode_music_type(file);
            if (music_type == MusicType.MUSIC_TYPE_MP3) {
                this.media = new Mp3();
            } else if (music_type == MusicType.MUSIC_TYPE_WMV) {
                this.media = new Wmv();
            }
        } else if (media_type == MediaType.MEDIA_TYPE_VIDEO) {
        } else if (media_type == MediaType.MEDIA_TYPE_PHOTO) {
        }
    }
}

let media_player = new Player();

media_player.load("c:\\video.mkv");
media_player.play();
media_player.stop();

media_player.load("c:\\music.mp3");
media_player.play();
media_player.stop();

media_player.load("c:\\photo.jpeg");
media_player.view();