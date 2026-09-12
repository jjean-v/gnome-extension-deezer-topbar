
const backward  = 'media-skip-backward-symbolic';
const forward   = 'media-skip-forward-symbolic';
const play      = 'media-playback-start-symbolic';
const pause     = 'media-playback-pause-symbolic';


const Previous = GObject.registerClass(
class Previous extends St.Icon {
    _init() {
        super._init({
            track_hover: true,
            can_focus: true,
            reactive: true,
            icon_name: backward,
            style_class: 'system-status-icon',
        });

        // Listen for update of left padding in settings
        this.connect('button-press-event', () => {
            //spotify.previous();
            console.log("\n\n\n\nListen to previous song\n\n\n\n");
        });
    }

    _styleChanged() {
        this.set_style(styleStr('left', 'prev'));
    }
});

const Pause = GObject.registerClass(
class Pause extends St.Icon {
    _init() {
        super._init({
            track_hover: true,
            can_focus: true,
            reactive: true,
            icon_name: pause,
            style_class: 'system-status-icon',
        });

        // Listen for update of left padding in settings
        this.connect('button-press-event', () => {
            //spotify.previous();
            console.log("\n\n\n\nThe song is on pause\n\n\n\n");
        });
    }

    _styleChanged() {
        this.set_style(styleStr('left', 'prev'));
    }
});

const Play = GObject.registerClass(
class Play extends St.Icon {
    _init() {
        super._init({
            track_hover: true,
            can_focus: true,
            reactive: true,
            icon_name: play,
            style_class: 'system-status-icon',
        });

        // Listen for update of left padding in settings
        this.connect('button-press-event', () => {
            //spotify.previous();
            console.log("\n\n\n\nThe song is on play\n\n\n\n");
        });
    }

    _styleChanged() {
        this.set_style(styleStr('left', 'prev'));
    }
});

const Next = GObject.registerClass(
class Next extends St.Icon {
    _init() {
        super._init({
            track_hover: true,
            can_focus: true,
            reactive: true,
            icon_name: forward,
            style_class: 'system-status-icon',
        });

        // Listen for update of left padding in settings
        this.connect('button-press-event', () => {
            //spotify.previous();
            console.log("\n\n\n\nListen to next song\n\n\n\n");
        });
    }

    _styleChanged() {
        this.set_style(styleStr('left', 'prev'));
    }
});

const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init(title) {
        super._init(0.0, _('My Shiny Indicator'));

        this.bar = new St.BoxLayout();
        this.bar.add_child(new Previous());
        this.bar.add_child(new Pause());
        this.bar.add_child(new Play());
        this.bar.add_child(new Next());

        this.add_child(this.bar);

        //const deezer = new DeezerController();
        //let title = deezer.currentTitle
        
        const item = new PopupMenu.PopupMenuItem(_('You are listening to' + title));
        item.connect('activate', () => {
            Main.notify(_('Whatʼs up, folks?'));
        });
        this.menu.addMenuItem(item);
    }
});