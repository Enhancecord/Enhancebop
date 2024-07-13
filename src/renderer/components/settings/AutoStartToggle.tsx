/*
 * SPDX-License-Identifier: GPL-3.0
 * Vesktop, a desktop app aiming to give you a snappier Discord Experience
 * Copyright (c) 2023 Vendicated and Vencord contributors
 */

import { Switch, useState } from "@vencord/types/webpack/common";

import { SettingsComponent } from "./Settings";

export const AutoStartToggle: SettingsComponent = () => {
    const [autoStartEnabled, setAutoStartEnabled] = useState(VesktopNative.autostart.isEnabled());

    return (
        <Switch
            value={autoStartEnabled}
            onChange={async v => {
                await VesktopNative.autostart[v ? "enable" : "disable"]();
                setAutoStartEnabled(v);
            }}
            note="Automatically start Equibop on computer start-up"
        >
            Start With System
        </Switch>
    );
};
