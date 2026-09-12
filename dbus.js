import Gio from 'gi://Gio';
//import GLib from 'gi://GLib';


export default class DeezerController {
    constructor() {
        this.proxy = new Gio.DBusProxy({
            g_connection: Gio.DBus.session,
            g_name: 'org.mpris.MediaPlayer2.deezer',
            g_object_path: '/org/mpris/MediaPlayer2',
            g_interface_name: 'org.mpris.MediaPlayer2.Player',
            g_flags: Gio.DBusProxyFlags.NONE,
        });
        this.proxy.init(null);
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