/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */




import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import DeezerController from './mediaPlayer.js'
//import Indicator from './topbar.js'

import GObject from 'gi://GObject';
import St from 'gi://St';
import Clutter from 'gi://Clutter';
import Gtk from 'gi://Gtk';
import Gio from 'gi://Gio';

import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
//import * as Main from 'resource:///org/gnome/shell/ui/main.js';

const backward  = 'media-skip-backward-symbolic';
const forward   = 'media-skip-forward-symbolic';
const play      = 'media-playback-start-symbolic';
const pause     = 'media-playback-pause-symbolic';

// 1. Récupérer le chemin du dossier 'icons' de votre extension
const iconPath = 'home/ubuntu-jean/.local/share/gnome-shell/extensions/deezer@controller.com';

// 2. Ajouter ce chemin au thème d'icônes par défaut de GNOME

     
/*
const DeezerLogo = GObject.registerClass(
class DeezerLogo extends St.Icon {
    _init() {
        super._init({
            gicon: Gio.icon_new_for_string(iconPath),
            track_hover: true,
            can_focus: true,
            reactive: true,
            style_class: 'system-status-icon',
        });

        // Listen for update of left padding in settings
        this.connect('button-press-event', () => {
            console.log("\n\n\n\nHello Deezer\n\n\n\n");
        });
    }

});
*/

const Previous = GObject.registerClass(
class Previous extends St.Icon {
    _init(deezer) {
        super._init({
            track_hover: true,
            can_focus: true,
            reactive: true,
            icon_name: backward,
            style_class: 'system-status-icon',
        });

        // Listen for update of left padding in settings
        this.connect('button-press-event', () => {
            console.log("\n\n\n\nListen to previous song\n\n\n\n");
            deezer.previous();
        });
    }

});

const Pause = GObject.registerClass(
class Pause extends St.Icon {
    _init(deezer) {
        super._init({
            track_hover: true,
            can_focus: true,
            reactive: true,
            icon_name: pause,
            style_class: 'system-status-icon',
        });

        // Listen for update of left padding in settings
        this.connect('button-press-event', () => {
            console.log("\n\n\n\nThe song is on pause\n\n\n\n");
            deezer.pause();
            if (deezer.isPlaying()) {
                if (this.get_icon_name = pause)
                    this.set_icon_name(play);
            } else {
                if (this.get_icon_name = play)
                    this.set_icon_name(pause);
            }
        });
    }

});



const Next = GObject.registerClass(
class Next extends St.Icon {
    _init(deezer) {
        super._init({
            track_hover: true,
            can_focus: true,
            reactive: true,
            icon_name: forward,
            style_class: 'system-status-icon',
        });

        // Listen for update of left padding in settings
        this.connect('button-press-event', () => {
            console.log("\n\n\n\nListen to next song\n\n\n\n");
            deezer.next();
        });
    }

});

const Title = GObject.registerClass(
class Title extends St.Label {
    _init(deezer) {
        super._init({
            text: deezer.currentTitle() ?? 'Rien en lecture',
            y_align: Clutter.ActorAlign.CENTER,
        });
    }
});


const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init(deezer) {
        super._init(0.0, _('My Shiny Indicator'));

        this.bar = new St.BoxLayout();
        //this.bar.add_child(new DeezerLogo());
    
        this.bar.add_child(new Title(deezer));
        this.bar.add_child(new Previous(deezer));
        this.bar.add_child(new Pause(deezer));
        this.bar.add_child(new Next(deezer));

        this.add_child(this.bar);

        //title = deezer.currentTitle
        const item = new PopupMenu.PopupMenuItem(_(deezer.currentTitle()));
        item.connect('activate', () => {
            Main.notify(_('Whatʼs up, folks?'));
        });
        this.menu.addMenuItem(item);
    }

});

export default class IndicatorExampleExtension extends Extension {
    enable() {
        this.deezer = new DeezerController();
        this.deezer.setupProxy();
        this._indicator = new Indicator(this.deezer);
        let title = this.deezer.currentTitle();
        console.log("\n\n\n\n" + title + "\n\n\n\n");
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}
