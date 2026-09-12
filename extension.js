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


import GObject from 'gi://GObject';
import St from 'gi://St';

import {Extension, gettext as _} from 'resource:///org/gnome/shell/extensions/extension.js';
import * as PanelMenu from 'resource:///org/gnome/shell/ui/panelMenu.js';
import * as PopupMenu from 'resource:///org/gnome/shell/ui/popupMenu.js';
import * as Main from 'resource:///org/gnome/shell/ui/main.js';

import DeezerController from './dbus.js'

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


const Indicator = GObject.registerClass(
class Indicator extends PanelMenu.Button {
    _init() {
        super._init(0.0, _('My Shiny Indicator'));

        this.bar = new St.BoxLayout();
        this.bar.add_child(new Previous());
        this.bar.add_child(new Pause());

        this.add_child(this.bar);
        const deezer = new DeezerController();

        let title = deezer.currentTitle
        const item = new PopupMenu.PopupMenuItem(_('You are listening to' + title));
        item.connect('activate', () => {
            Main.notify(_('Whatʼs up, folks?'));
        });
        this.menu.addMenuItem(item);
    }
});

export default class IndicatorExampleExtension extends Extension {
    enable() {
        this._indicator = new Indicator();
        Main.panel.addToStatusArea(this.uuid, this._indicator);
    }

    disable() {
        this._indicator.destroy();
        this._indicator = null;
    }
}
