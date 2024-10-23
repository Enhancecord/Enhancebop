/*
 * SPDX-License-Identifier: GPL-3.0
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2023 Vendicated and Vencord contributors
 */

import { app } from "electron";
import { existsSync, mkdirSync, readdirSync, renameSync, rmdirSync } from "fs";
import { dirname, join } from "path";

const enhancebopDir = dirname(process.execPath);

export const PORTABLE =
    process.platform === "win32" &&
    !process.execPath.toLowerCase().endsWith("electron.exe") &&
    !existsSync(join(enhancebopDir, "Uninstall Enhancebop.exe"));

const LEGACY_DATA_DIR = join(app.getPath("appData"), "EnhancecordDesktop", "EnhancecordDesktop");
export const DATA_DIR =
    process.env.EQUICORD_USER_DATA_DIR || (PORTABLE ? join(enhancebopDir, "Data") : join(app.getPath("userData")));

mkdirSync(DATA_DIR, { recursive: true });

// TODO: remove eventually
if (existsSync(LEGACY_DATA_DIR)) {
    try {
        console.warn("Detected legacy settings dir", LEGACY_DATA_DIR + ".", "migrating to", DATA_DIR);
        for (const file of readdirSync(LEGACY_DATA_DIR)) {
            renameSync(join(LEGACY_DATA_DIR, file), join(DATA_DIR, file));
        }
        rmdirSync(LEGACY_DATA_DIR);
        renameSync(
            join(app.getPath("appData"), "EnhancecordDesktop", "IndexedDB"),
            join(DATA_DIR, "sessionData", "IndexedDB")
        );
    } catch (e) {
        console.error("Migration failed", e);
    }
}
const SESSION_DATA_DIR = join(DATA_DIR, "sessionData");
app.setPath("sessionData", SESSION_DATA_DIR);

export const VENCORD_SETTINGS_DIR = join(DATA_DIR, "settings");
export const VENCORD_QUICKCSS_FILE = join(VENCORD_SETTINGS_DIR, "quickCss.css");
export const VENCORD_SETTINGS_FILE = join(VENCORD_SETTINGS_DIR, "settings.json");
export const VENCORD_THEMES_DIR = join(DATA_DIR, "themes");

// needs to be inline require because of circular dependency
// as otherwise "DATA_DIR" (which is used by ./settings) will be uninitialised
export const VENCORD_DIR = (() => {
    const { State } = require("./settings") as typeof import("./settings");
    return State.store.vencordDir ? join(State.store.vencordDir, "enhancebop") : join(SESSION_DATA_DIR, "enhancecord.asar");
})();

export const USER_AGENT = `Enhancebop/${app.getVersion()} (https://github.com/Enhancecord/Enhancebop)`;

// dimensions shamelessly stolen from Discord Desktop :3
export const MIN_WIDTH = 940;
export const MIN_HEIGHT = 500;
export const DEFAULT_WIDTH = 1280;
export const DEFAULT_HEIGHT = 720;

export const DISCORD_HOSTNAMES = ["discord.com", "canary.discord.com", "ptb.discord.com"];

const VersionString = `AppleWebKit/537.36 (KHTML, like Gecko) Chrome/${process.versions.chrome.split(".")[0]}.0.0.0 Safari/537.36`;
const BrowserUserAgents = {
    darwin: `Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) ${VersionString}`,
    linux: `Mozilla/5.0 (X11; Linux x86_64) ${VersionString}`,
    windows: `Mozilla/5.0 (Windows NT 10.0; Win64; x64) ${VersionString}`
};

export const BrowserUserAgent = BrowserUserAgents[process.platform] || BrowserUserAgents.windows;

export const enum MessageBoxChoice {
    Default,
    Cancel
}

export const isWayland =
    process.platform === "linux" && (process.env.XDG_SESSION_TYPE === "wayland" || !!process.env.WAYLAND_DISPLAY);