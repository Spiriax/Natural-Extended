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
                    "[ 🦜 Natural Extended ] Everyone words:",
                    everyoneInput.value
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
    
            console.log(
                "[ 🦜 Natural Extended ] Last message:",
                lastMessage.mes
            );
    
            if (
                lastMessage.mes
                    .toLowerCase()
                    .includes("siri")
            ) {
    
                console.log(
                    "[ 🦜 Natural Extended ] Siri detected!"
                );
    
            }
    
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
                value="1"
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
                                class="text_pole flex1"
                                type="text"
                            >
                        </div>
    
                        <div style="flex:1;">
                            <label>Ignore</label>
                            <input
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
// Only show Natural Extended inside actual group chats.
// Current implementation injects into panel[16].