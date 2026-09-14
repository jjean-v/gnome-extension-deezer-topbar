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

    get currentTitle() {
        const meta = this.proxy.get_cached_property('Metadata');
        if (!meta) return null;
        const dict = meta.recursiveUnpack();   // -> objet JS normal
        return dict['xesam:title'];
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


    // method to keep the proxy connected, only used of testing
    proxyConnected() {

        // Affichage immédiat au lancement
        console.log('Titre courant : ' + this.currentTitle);


        // Mise à jour automatique à chaque changement
        this.proxy.connect('g-properties-changed', () => {
            console.log('Changement -> ' + this.currentTitle);
            console.log('The music is ->' + this.musicStatus)
        });
    }
}
    

/*
const deezer = new DeezerController();


deezer.proxyConnected();
// Boucle d'événements : garde le programme en vie pour écouter les signaux
const loop = new GLib.MainLoop(null, false);
loop.run();
*/