import Gio from 'gi://Gio';
import GLib from 'gi://GLib';

const proxy = new Gio.DBusProxy({
    g_connection: Gio.DBus.session,
    g_name: 'org.mpris.MediaPlayer2.deezer',
    g_object_path: '/org/mpris/MediaPlayer2',
    g_interface_name: 'org.mpris.MediaPlayer2.Player',
    g_flags: Gio.DBusProxyFlags.NONE,
});
proxy.init(null);

// Lecture du titre courant
function currentTitle() {
    const meta = proxy.get_cached_property('Metadata');
    if (!meta) return null;
    const dict = meta.recursiveUnpack();   // -> objet JS normal
    return dict['xesam:title'];
}

// Affichage immédiat au lancement
console.log('Titre courant : ' + currentTitle());

// Mise à jour automatique à chaque changement
proxy.connect('g-properties-changed', () => {
    console.log('Changement -> ' + currentTitle());
});

// Boucle d'événements : garde le programme en vie pour écouter les signaux
const loop = new GLib.MainLoop(null, false);
loop.run();