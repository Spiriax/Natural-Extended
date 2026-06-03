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

                    enabled: false

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
            
            enableCheckbox.onchange = () => {
            
                naturalExtendedSettings[
                    freshContext.groupId
                ].enabled =
                    enableCheckbox.checked;
            
                console.log(
                    "[ 🦜 Natural Extended ] Enabled:",
                    enableCheckbox.checked
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
        
    const panels = document.querySelectorAll('.inline-drawer-content');

    const panel = panels[19];
    
    if (!panel) {
        console.log("[ 🦜 Natural Extended ] ❓ Could not find group panel!❓");
        return;
    }

    const div = document.createElement('div');

    div.innerHTML = `
    <div id="natural-extended-panel" style="margin-top:10px;">

        <div
            id="ne-header"
            class="
                inline-drawer-header
                inline-drawer-toggle
            "
            style="margin-bottom:10px;"
        >
            Natural Extended Settings
        </div>
        
        <div style="height:10px;"></div>
        
        <label style="display:flex; align-items:center; gap:8px;">
            <input type="checkbox" id="ne-enabled">
            Enable for this group
        </label>

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