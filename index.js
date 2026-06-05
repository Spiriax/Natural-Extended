const naturalExtendedSettings = {};

jQuery(() => {
    console.log("Natural Extended loaded");
    
    const context = SillyTavern.getContext();
    
    context.eventSource.on(
        context.eventTypes.CHAT_CHANGED,
        
        () => {
            console.log(
                "[ 🦜 Natural Extended ] Detected chat change! 💬"
            );
    
            const freshContext =
                SillyTavern.getContext();
                
            const extensionPanel =
                document.getElementById(
                    "natural-extended-panel"
                );    
    
            if (!freshContext.groupId) {

                if (extensionPanel) {
                    extensionPanel.style.display = "none";
                }
            
                console.log(
                    "[ 🦜 Natural Extended ] ❌ Single chat detected!❌"
                );
            
                return;
            }    
            
            if (extensionPanel) {
                extensionPanel.style.display = "block";
            }
            
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
                
            if (!naturalExtendedSettings[freshContext.groupId]) {

                naturalExtendedSettings[
                    freshContext.groupId
                ] = {

                    enabled: false,
                    
                    everyoneWords: "",
                    
                    maxTriggeredCharacters: 0,
                    
                    characters: {}

                };

            }
            
            groupCharacters.sort(
                (a, b) =>
                    a.name.localeCompare(b.name)
            );
                
            renderCharacterSections(
                groupCharacters
            );
            
            groupCharacters.forEach(character => {

                if (
                    !naturalExtendedSettings[
                        freshContext.groupId
                    ].characters[
                        character.name
                    ]
                ) {
            
                    naturalExtendedSettings[
                        freshContext.groupId
                    ].characters[
                        character.name
                    ] = {
            
                        respond: "",
                        ignore: ""
            
                    };
            
                }
            
                const respondInput =
                    document.getElementById(
                        `respond-${character.name}`
                    );
            
                const ignoreInput =
                    document.getElementById(
                        `ignore-${character.name}`
                    );
            
                respondInput.value =
                    naturalExtendedSettings[
                        freshContext.groupId
                    ].characters[
                        character.name
                    ].respond;
            
                ignoreInput.value =
                    naturalExtendedSettings[
                        freshContext.groupId
                    ].characters[
                        character.name
                    ].ignore;
            
                respondInput.oninput = () => {
            
                    naturalExtendedSettings[
                        freshContext.groupId
                    ].characters[
                        character.name
                    ].respond =
                        respondInput.value;
            
                };
            
                ignoreInput.oninput = () => {
            
                    naturalExtendedSettings[
                        freshContext.groupId
                    ].characters[
                        character.name
                    ].ignore =
                        ignoreInput.value;
            
                };
            
            });
            
            const enableCheckbox =
                document.getElementById(
                    "ne-enabled"
                );
            
            enableCheckbox.checked =
                naturalExtendedSettings[
                    freshContext.groupId
                ].enabled;
                
            const settingsContent =
                document.getElementById(
                    "ne-settings-content"
                );
            
            settingsContent.style.display =
                enableCheckbox.checked
                    ? "block"
                    : "none";
            
            enableCheckbox.onchange = () => {
            
                naturalExtendedSettings[
                    freshContext.groupId
                ].enabled =
                    enableCheckbox.checked;
                    
                settingsContent.style.display =
                    enableCheckbox.checked
                        ? "block"
                        : "none";
            
                if (enableCheckbox.checked) {
    
                    const strategySelect =
                        document.getElementById(
                            "rm_group_activation_strategy"
                        );
                
                    if (strategySelect) {
                
                        strategySelect.value = "2";
                
                        strategySelect.dispatchEvent(
                            new Event("change")
                        );
                
                    }
                    
                }
            
                console.log(
                    "[ 🦜 Natural Extended ] Enabled:",
                    enableCheckbox.checked
                );
            
            };
            
            const everyoneInput =
                document.getElementById(
                    "ne-everyone"
                );
            
            everyoneInput.value =
                naturalExtendedSettings[
                    freshContext.groupId
                ].everyoneWords;
            
            everyoneInput.oninput = () => {
            
                naturalExtendedSettings[
                    freshContext.groupId
                ].everyoneWords =
                    everyoneInput.value;
            
                console.log(
                    "[ 🦜 Natural Extended ] Trigger All words:",
                    everyoneInput.value
                );
            
            };
            
            const maxInput =
                document.getElementById(
                    "ne-max-mentions"
                );
            
            maxInput.value =
                naturalExtendedSettings[
                    freshContext.groupId
                ].maxTriggeredCharacters;
            
            maxInput.oninput = () => {
            
                naturalExtendedSettings[
                    freshContext.groupId
                ].maxTriggeredCharacters =
                    Number(maxInput.value);
            
                console.log(
                    "[ 🦜 Natural Extended ] Max Triggered Characters:",
                    maxInput.value
                );
            
            };
                    
                console.log(
                    naturalExtendedSettings
                );
    
            console.log(
                "[Natural Extended]",
                {
                    groupId: freshContext.groupId,
                    groupName: currentGroup.name,
                    members: currentGroup.members,
                    characters: groupCharacters.map(
                        c => c.name
                    )
                }
            );  
        }
    );     
    
    context.eventSource.on(
        context.eventTypes.MESSAGE_SENT,
        () => {
    
            const freshContext =
                SillyTavern.getContext();
    
            const lastMessage =
                freshContext.chat[
                    freshContext.chat.length - 1
                ];
    
            const matchedCharacters = [];
    
            const characters =
                naturalExtendedSettings[
                    freshContext.groupId
                ].characters;
                
            const everyoneWords =
                naturalExtendedSettings[
                    freshContext.groupId
                ].everyoneWords
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
            
                    matchedCharacters.push({
                        characterName,
                        position: -1
                    });
            
                    console.log(
                        "[ 🦜 Natural Extended ]",
                        characterName,
                        "forced by everyone trigger"
                    );
            
                    continue;
            
                }
                                
                const respondWords =
                    characters[
                        characterName
                    ].respond
                        .split(",");
                        
                const ignoreWords =
                    characters[
                        characterName
                    ].ignore
                        .split(",");
                
                let shouldIgnore =
                    false;
                
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
                        lastMessage.mes
                            .toLowerCase()
                            .includes(
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
            
                        matchedCharacters.push({
                            characterName,
                            position:
                                lastMessage.mes
                                    .toLowerCase()
                                    .indexOf(cleanWord)
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
                naturalExtendedSettings[
                    freshContext.groupId
                ].maxTriggeredCharacters;
                
            matchedCharacters.sort(
                (a, b) =>
                    a.position - b.position
            );
            
            const triggeredCharacters =
                matchedCharacters.map(
                    match =>
                        match.characterName
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
                naturalExtendedSettings[
                    freshContext.groupId
                ]
            );
    
            console.log(
                "[ 🦜 Natural Extended ] Triggered:",
                triggeredCharacters
            );
    
        }
    );    
        
    const panels = document.querySelectorAll('.inline-drawer-content');

    const panel = panels[16];
       
    if (!panel) {
        console.log("[ 🦜 Natural Extended ] ❓ Could not find group panel!❓");
        return;
    }

    const div = document.createElement('div');

    div.innerHTML = `
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
                
        <hr>

        <div style="margin-top:10px;">
            <label>
                Words that make every character respond
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
        
    function renderCharacterSections(groupCharacters) {

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
                    <h4 style="color:#f0c040;">
                        ${character.name}
                    </h4>
    
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
    
    panel.appendChild(div);
    
    const extensionPanel =
        document.getElementById(
            "natural-extended-panel"
        );

    if (extensionPanel) {
        extensionPanel.style.display = "none";
    }
        
    console.log("Natural Extended injected");
});

// TODO:
// Add Continue-toggle which makes conversational lock.
// Add Word Count-function to Continue function so it only checks for new trigger within X words.
// Add some functionality to Talkativeness.
// Only show Natural Extended inside actual group chats.
// Current implementation injects into panel[16].