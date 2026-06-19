// Natural Extended v0.9 - 
// 20 June, 2026

import {
    extension_settings
} from '../../../extensions.js';

import {
    saveSettingsDebounced
} from '../../../../script.js';

let activeConversationLock = [];

const MODULE =
    "natural_extended";

if (
    !extension_settings[MODULE]
) {
    extension_settings[MODULE] = {};
}

const naturalExtendedSettings =
    extension_settings[MODULE];

/*
 * SillyTavern's /trigger command cannot reliably trigger
 * multiple group members simultaneously.
 *
 * Natural Extended therefore places triggered characters
 * into a queue and waits for GENERATION_ENDED before
 * triggering the next character.
 */

let triggerQueue = [];

jQuery(() => {
    console.log("[ 🦜 Natural Extended ] Loaded successfully!");
    
    // Get access to SillyTavern's current context
    // (characters, chat ID, group ID, and so on...)
    const context = SillyTavern.getContext();

    // Refresh character list when group membership changes.
    context.eventSource.on(
        context.eventTypes.GROUP_UPDATED,
        () => {

            const freshContext =
                SillyTavern.getContext();

            const currentGroup =
                freshContext.groups.find(
                    g =>
                        String(g.id) ===
                        String(freshContext.groupId)
                );

            if (!currentGroup) {
                return;
            }

            const groupCharacters =
                freshContext.characters.filter(
                    character =>
                        currentGroup.members.includes(
                            character.avatar
                        )
                );

            groupCharacters.sort(
                (a, b) =>
                    a.name.localeCompare(b.name)
            );

            renderCharacterSections(
                groupCharacters
            );

            console.log(
                "[ 🦜 Natural Extended ] Character list refreshed"
            );
        }
    );

    context.eventSource.on(
        context.eventTypes.GENERATION_ENDED,
        async () => {

            if (!triggerQueue.length) {
                return;
            }

            const nextCharacter =
                triggerQueue.shift();

            console.log(
                "[ 🦜 Natural Extended ] Triggering from queue:",
                nextCharacter
            );

            const freshContext =
                SillyTavern.getContext();

            try {
                await freshContext.executeSlashCommands(
                    `/trigger "${nextCharacter}"`
                );
            }
            catch (error) {
                console.error(
                    "[ 🦜 Natural Extended ] Queue trigger failed",
                    error
                );
            }

        }
    );

    // Show or hide the extension panel whenever the user switches chat.
    context.eventSource.on(
        context.eventTypes.CHAT_CHANGED,
        
        () => {
    
            const freshContext =
                SillyTavern.getContext();

            const extensionPanel =
                document.getElementById(
                    "natural-extended-panel"
                );    
    
            // Extension only works in group chats.    
            if (!freshContext.groupId) {

                if (extensionPanel) {
                    extensionPanel.style.display = "none";
                }
                return;
            }    
            
            if (extensionPanel) {
                extensionPanel.style.display = "block";
            }
            
            // Find the currently open group.
            const currentGroup =
                freshContext.groups.find(
                    g =>
                        String(g.id) ===
                        String(freshContext.groupId)
                );
            
            // Safety check. Abort if the currently selected group
            // cannot be found in SillyTavern's group list.    
            if (!currentGroup) {
                return;
            }
    
            // Get all characters that belong to the currently open group.
            const groupCharacters =
                freshContext.characters.filter(
                    character =>
                        currentGroup.members.includes(
                            character.avatar
                        )
                );
            
            // Create default settings for this group
            // the first time it is opened.    
            if (
                !naturalExtendedSettings[
                    freshContext.groupId
                ]
            ) {
                naturalExtendedSettings[
                    freshContext.groupId
                ] = {
                    enabled: false,
                    everyoneWords: "",
                    maxTriggeredCharacters: 0,
                    characters: {}
                };
            }

            const groupSettings =
                naturalExtendedSettings[
                    freshContext.groupId
                ];
            
            // Keep character list sorted alphabetically.
            groupCharacters.sort(
                (a, b) =>
                    a.name.localeCompare(b.name)
            );
            
            // Build the UI for all group members.
            renderCharacterSections(
                groupCharacters
            );
            
            // Load saved settings into the UI and connect input events.
            groupCharacters.forEach(character => {

                // TEMP
                console.log(
                    "[ 🦜 Natural Extended ] Avatar:",
                    character.avatar
                );
                
                // Create default settings for new characters.
                if (
                    !groupSettings.characters[
                        character.name
                    ]
                ) {
                    groupSettings.characters[
                        character.name
                    ] = {
                        respond: "",
                        ignore: "",
                        conversationalLock: false
                    };
                }

                const characterSettings =
                    groupSettings.characters[
                        character.name
                    ];

                if (
                    characterSettings.conversationalLock
                    === undefined
                ) {
                    characterSettings.conversationalLock =
                        false;
                }
            
                const respondInput =
                    document.getElementById(
                        `respond-${character.name}`
                    );
            
                const ignoreInput =
                    document.getElementById(
                        `ignore-${character.name}`
                    );

                const lockCheckbox =
                    document.getElementById(
                        `lock-${character.name}`
                    );
            
                respondInput.value =
                    characterSettings.respond;

                ignoreInput.value =
                    characterSettings.ignore;

                lockCheckbox.checked =
                    characterSettings.conversationalLock;
            
                // Save changes immediately when the user types.
                respondInput.oninput = () => {

                    characterSettings.respond =
                        respondInput.value;

                    saveSettingsDebounced();    
                };
            
                ignoreInput.oninput = () => {

                    characterSettings.ignore =
                        ignoreInput.value;

                    saveSettingsDebounced();
                };
            
                lockCheckbox.onchange = () => {

                    characterSettings.conversationalLock =
                        lockCheckbox.checked;

                    saveSettingsDebounced();
                };
            });
            
            // Enable or disable Natural Extended for this group.
            const enableCheckbox =
                document.getElementById(
                    "ne-enabled"
                );

            const strategySelect =
                document.getElementById(
                    "rm_group_activation_strategy"
                );

            if (strategySelect) {

                strategySelect.addEventListener(
                    "change",
                    () => {

                        console.log(
                            "[ 🦜 Natural Extended ] Strategy changed:",
                            strategySelect.value
                        );

                        if (
                            strategySelect.value !== "2"
                        ) {

                            groupSettings.enabled = false;

                            enableCheckbox.checked = false;

                            updateSettingsVisibility();

                            saveSettingsDebounced();
                        }
                    }
                );
            }
            
            enableCheckbox.checked =
                groupSettings.enabled;
                
            const settingsContent =
                document.getElementById(
                    "ne-settings-content"
                );
            
            // Show settings when enabled, hide them when disabled.    
            function updateSettingsVisibility() {

                settingsContent.style.display =
                    enableCheckbox.checked
                        ? "block"
                        : "none";
            }
            
            updateSettingsVisibility();
            
            enableCheckbox.onchange = () => {
            
                groupSettings.enabled =
                    enableCheckbox.checked;
                
                updateSettingsVisibility();

                saveSettingsDebounced();
                
                // Force SillyTavern into Manual mode.
                // Natural Extended controls who gets triggered.
                if (enableCheckbox.checked) {
    
                    const strategySelect =
                        document.getElementById(
                            "rm_group_activation_strategy"
                        );

                    if (strategySelect) {
                
                        // Group reply strategy 2 = Manual mode.
                        strategySelect.value = "2";
                
                        strategySelect.dispatchEvent(
                            new Event("change")
                        );
                    }
                }
            };
            
            // Words that should trigger all characters.
            const everyoneInput =
                document.getElementById(
                    "ne-everyone"
                );

            everyoneInput.value =
                groupSettings.everyoneWords;

            everyoneInput.oninput = () => {

                groupSettings.everyoneWords =
                    everyoneInput.value;
            
                saveSettingsDebounced();
            };

            // Maximum number of characters that can be
            // triggered by one message.
            const maxInput =
                document.getElementById(
                    "ne-max-mentions"
                );

            maxInput.value =
                groupSettings.maxTriggeredCharacters;

            maxInput.oninput = () => {

                groupSettings.maxTriggeredCharacters =
                    Number(maxInput.value);
            
                saveSettingsDebounced();
            };
        }
    );     
    
    // Listen for new user messages.
    context.eventSource.on(
        context.eventTypes.MESSAGE_SENT,
        async () => {

            const freshContext =
                SillyTavern.getContext();

            const lastMessage =
                freshContext.chat[
                    freshContext.chat.length - 1
                ];

            const groupSettings =
                naturalExtendedSettings[
                    freshContext.groupId
                ];

            if (!groupSettings) {
                return;
            }
            
            // Ignore messages generated by characters.
            // We only want to react to actual user input.
            if (!lastMessage?.is_user) {
                return;
            }

            const messageText =
                lastMessage.mes
                    .toLowerCase();
                    
            const matchedCharacters = [];
    
            const characters =
                groupSettings.characters;
                
            const everyoneWords =
                groupSettings.everyoneWords
                    .split(",");
            
            let everyoneTriggered =
                false;
            
            for (
                const word
                of everyoneWords
            ) {
            
                const cleanWord =
                    word
                        .trim()
                        .toLowerCase();
            
                if (!cleanWord) {
                    continue;
                }
            
                if (
                    lastMessage.mes
                        .toLowerCase()
                        .includes(
                            cleanWord
                        )
                ) {
            
                    everyoneTriggered =
                        true;
                    
                    console.log(
                        "[ 🦜 Natural Extended ] Everyone triggered by:",
                        cleanWord
                    );
                    
                    break;
                }
            }
            
            for (
                const characterName
                in characters
            ) {
            
                if (
                    everyoneTriggered
                ) {
            
                    // -1 means this character was triggered by an
                    // "everyone" keyword rather than a direct mention.
                    matchedCharacters.push({
                        characterName,
                        position: -1
                    });
            
                    continue;
                }
                                
                const characterSettings =
                    characters[
                        characterName
                    ];

                const respondWords =
                    characterSettings.respond
                        .split(",");

                const ignoreWords =
                    characterSettings.ignore
                        .split(",");

                let shouldIgnore =
                    false;

                // Check ignore words first.
                // If one matches, this character is skipped.
                for (
                    const ignoreWord
                    of ignoreWords
                ) {

                    const cleanIgnoreWord =
                        ignoreWord
                            .trim()
                            .toLowerCase();

                    if (!cleanIgnoreWord) {
                        continue;
                    }

                    if (
                        messageText.includes(
                            cleanIgnoreWord
                        )
                    ) {

                        shouldIgnore =
                            true;

                        console.log(
                            "[ 🦜 Natural Extended ]",
                            characterName,
                            "ignored by:",
                            cleanIgnoreWord
                        );

                        break;
                    }
                }

                if (shouldIgnore) {
                    continue;
                }

                for (
                    const word
                    of respondWords
                ) {

                    // Look for trigger words that should
                    // make this character respond.
                    const cleanWord =
                        word
                            .trim()
                            .toLowerCase();

                    if (!cleanWord) {
                        continue;
                    }

                    if (
                        messageText.includes(
                            cleanWord
                        )
                    ) {

                        // Position is used later to preserve
                        // mention order in the user's message.
                        matchedCharacters.push({
                            characterName,
                            position:
                                messageText.indexOf(
                                    cleanWord
                                )
                        });

                        console.log(
                            "[ 🦜 Natural Extended ]",
                            characterName,
                            "detected by:",
                            cleanWord
                        );

                        break;
                    }
                }       
            }

            const maxTriggered =
                groupSettings.maxTriggeredCharacters;
                
            matchedCharacters.sort(
                (a, b) =>
                    a.position - b.position
            );
            
            const triggeredCharacters =
                matchedCharacters.map(
                    match =>
                        match.characterName
                );

            const lockedCharacters =
                triggeredCharacters.filter(
                    characterName =>
                        groupSettings.characters[
                            characterName
                        ]?.conversationalLock
                );

            if (lockedCharacters.length > 0) {

                activeConversationLock =
                    lockedCharacters;
            }

            console.log(
                "[ 🦜 Natural Extended ] Conversation Lock:",
                activeConversationLock
            );
            
            if (
                maxTriggered > 0
                &&
                !everyoneTriggered
            ) {
            
                triggeredCharacters.splice(
                    maxTriggered
                );
            }
    
            console.log(
                "[ 🦜 Natural Extended ] Triggered:",
                triggeredCharacters
            );
            
            if (
                triggeredCharacters.length === 0 &&
                activeConversationLock.length > 0
            ) {

                triggeredCharacters.push(
                    ...activeConversationLock
                );

            }
            
            if (
                !triggeredCharacters.length
            ) {
                return;
            }
            
            triggerQueue =
                [...triggeredCharacters];

            const characterName =
                triggerQueue.shift();

            console.log(
                "[ 🦜 Natural Extended ] Queue:",
                triggerQueue
            );
            
                const chid =
                    freshContext.characters.findIndex(
                        character =>
                            character.name
                            === characterName
                    );
                    
                if (chid === -1) {
                    console.error(
                        "[ 🦜 Natural Extended ] Character not found:",
                        characterName
                    );

                    return;
                }
                
                // Trigger the same command as SillyTavern's
                // "speech bubble" button.
                const character =
                    freshContext.characters[chid];

                /*
                * Do not use freshContext.generate(), Generate() or 
                * force_chid as these approaches cause duplicated messages,
                * broken group state and recursive generation.
                *
                * Using SillyTavern's built-in /trigger command works
                * correctly with group chat logic.
                */

                try {
                    await freshContext.executeSlashCommands(
                        `/trigger "${character.name}"`
                    );
                }

                catch (error) {
                    console.error(
                        "[ 🦜 Natural Extended ] Trigger failed",
                        error
                    );
                }
        }
    );
        
    const panels = document.querySelectorAll('.inline-drawer-content');

    // Inject the extension into SillyTavern's
    // Group Settings drawer panel, which just happens to be panel 16.
    const panel = panels[16];
       
    if (!panel) {
        console.log("[ 🦜 Natural Extended ] ❓ Could not find group panel!❓");
        return;
    }

    const extensionRoot =
        document.createElement('div');

    extensionRoot.innerHTML = `
    <div id="natural-extended-panel" style="margin-top:10px;">

        <div
            style="
                margin-bottom:10px;
                font-weight:bold;
            "
        >
            Natural Extended Settings
        </div>
        
        <div style="height:10px;"></div>
        
        <label style="display:flex; align-items:center; gap:8px;">
            <input type="checkbox" id="ne-enabled">
            Enable for this group
        </label>
        
        <div id="ne-settings-content">

            <p style="opacity:0.7; margin-top:5px;">
                Group Reply Strategy will automatically be set to Manual while Natural Extended is enabled.
            </p>

            <hr>
            
            <div id="ne-character-container"></div>
            
            <p
                style="
                    opacity:0.7;
                    margin-top:5px;
                "
            >
                Separate words or phrases with commas.
            </p>
                    
            <hr>

            <div style="margin-top:10px;">
                <label>
                    Words or phrases that make every character respond
                </label>
                <br>
                <input
                    type="text"
                    id="ne-everyone"
                    class="text_pole flex1"
                />
            </div>

            <hr>

            <div style="margin-top:10px;">
                <label>
                    Maximum Triggered Characters
                </label>
                <br>
                <input
                    type="number"
                    id="ne-max-mentions"
                    min="0"
                    value="0"
                    class="text_pole"
                    style="width:60px;"
                >
            </div>

        </div>

    </div>
    `;

    panel.appendChild(
        extensionRoot
    );
        
    // Build the Respond/Ignore UI
    // for every character in the group.
    function renderCharacterSections(
        groupCharacters
    ) {

        const characterContainer =
            document.getElementById(
                "ne-character-container"
            );
    
        if (!characterContainer) {
            return;
        }
    
        characterContainer.innerHTML = "";
    
        groupCharacters.forEach(character => {
    
            characterContainer.innerHTML += `
                <hr>
    
                <div style="margin-top:10px;">
                    <div
                        style="
                            display:flex;
                            align-items:center;
                            gap:8px;
                            margin-bottom:8px;
                        "
                    >

                        <div
                            style="
                                display:flex;
                                align-items:center;
                                justify-content:space-between;
                                width:100%;
                            "
                        >

                            <div
                                style="
                                    display:flex;
                                    align-items:center;
                                    gap:8px;
                                "
                            >

                                <div
                                    class="avatar"
                                    style="
                                        flex:none;
                                    "
                                >

                                    <img
                                        alt="Avatar"
                                        src="/thumbnail?type=avatar&file=${character.avatar}"
                                    >

                                </div>

                                <span
                                    style="
                                        color:#f0c040;
                                        font-weight:bold;
                                    "
                                >
                                    ${character.name}
                                </span>

                            </div>

                            <label
                                style="
                                    display:flex;
                                    align-items:center;
                                    gap:5px;
                                    font-size:0.9em;
                                "
                            >

                                <input
                                    type="checkbox"
                                    id="lock-${character.name}"
                                >

                                Conversation Lock

                            </label>

                        </div>

                    </div>
    
                    <div
                        style="
                            display:flex;
                            gap:10px;
                        "
                    >
                        <div style="flex:1;">
                            <label>Respond</label>
                            <input
                                id="respond-${character.name}"
                                class="text_pole flex1"
                                type="text"
                            >
                        </div>
    
                        <div style="flex:1;">
                            <label>Ignore</label>
                            <input
                                id="ignore-${character.name}"
                                class="text_pole flex1"
                                type="text"
                            >
                        </div>
                    </div>
                </div>
            `;
        });
    }
    
    const extensionPanel =
        document.getElementById(
            "natural-extended-panel"
        );

    if (extensionPanel) {
        extensionPanel.style.display = "none";
    }
});

/*
* NOTE:
* Currently injects into panel[16].
* If SillyTavern changes its UI this may break.
*
* TODO:
* - Add Continue-toggle which makes conversational lock.
* - Add Word Count-function to Continue function so
* it only checks for new trigger within X words.
* - Add some functionality to Talkativeness.
* - Only show Natural Extended inside actual group chats.
* - Add ways to randomize in which order characters respond.
* - Making it so characters can respond to each other.
* - Make each characters' icon appear next to their names.
* - Make each , create a little square around the word.
* - Make the saved data update correctly when adding and removed characters.
* - Make it so muting works.
* - Release Conversation Lock immediately when checkbox is disabled.
* - Add a way to introduce delay during queues.
*/