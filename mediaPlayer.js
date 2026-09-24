import Gio from 'gi://Gio';
//import GLib from 'gi://GLib';

const path = '/org/mpris/MediaPlayer2';
const playerInterface = `
<node>
<interface name="org.mpris.MediaPlayer2.Player">
    <property name="PlaybackStatus" type="s" access="read" />
    <method name="Next" />
    <method name="Previous" />
    <method name="PlayPause" />
</interface>
</node>
`;

const PlayerProxy = Gio.DBusProxy.makeProxyWrapper(playerInterface);

export default class DeezerController {
   
    constructor() {
        this.proxy = null;
    }

    setupProxy(dest = 'org.mpris.MediaPlayer2.deezer') {
        if (this.proxy)
            return;

        try {
            // Get the MediaPlayer instance from the bus
            this.proxy = new PlayerProxy(Gio.DBus.session, dest, path);
            this.proxy.connect('g-properties-changed', () => {
                if (this._callback) this._callback();   // c'est ICI que ça s'exécute, à chaque changement
            });

        } catch (e) {
            logError(e);
            return;
        }
    }

    get musicStatus() {
        const meta = this.proxy.get_cached_property('PlaybackStatus')
        if (!meta) return null;
        return meta.recursiveUnpack();   // -> objet JS normal
    }

    currentTitle(){
        const meta = this.proxy.get_cached_property('Metadata');
        if (!meta) return "Aucun Media";
        const dict = meta.recursiveUnpack();   // -> objet JS normal
        return String(dict['xesam:title']);
    }

    currentAlbum() {
        const meta = this.proxy.get_cached_property('Metadata');
        if (!meta) return "Aucun Album";
        const dict = meta.recursiveUnpack();   // -> objet JS normal
        return String(dict['xesam:album']);
    }

    
    pause() {
        this.proxy.PlayPauseRemote();
    }
    
    previous() {
        this.proxy.PreviousRemote();
    }

    next() {
        this.proxy.NextRemote();
    }

    isPlaying() {
        return this.proxy.PlaybackStatus === 'Playing';
    }


    onChange(callback) {
        this._callback = callback;
    }


}
    

/*
const deezer = new DeezerController();


deezer.proxyConnected();
// Boucle d'événements : garde le programme en vie pour écouter les signaux
const loop = new GLib.MainLoop(null, false);
loop.run();
*/