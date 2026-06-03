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
    
            if (!freshContext.groupId) {
                console.log(
                    "[ 🦜 Natural Extended ] ❌ Single chat detected!❌"
                );
                return;
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

    const panel = panels[16];
    
    if (!panel) {
        console.log("[ 🦜 Natural Extended ] ❓ Could not find group panel!❓");
        return;
    }

    const div = document.createElement('div');

    div.innerHTML = `
    <div id="natural-extended-panel" style="margin-top:10px;">

        <div class="inline-drawer-header" style="margin-bottom:10px;">
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
        
        <div class="ne-character-section">

            <div style="
                display:flex;
                align-items:center;
                gap:10px;
                margin-bottom:10px;
            ">
                <img
                    src="/thumbnail?type=avatar&file=Siri.png"
                    width="40"
                    height="40"
                >
            
                <span style="
                    color:#f0d000;
                    font-weight:bold;
                ">
                    Siri
                </span>
            </div>

            <div style="display:flex; gap:10px;">
        
                <div style="flex:1;">
                    <label>Respond</label>
                    <br>
                    <input
                        type="text"
                        class="text_pole flex1"
                    />
                </div>
        
                <div style="flex:1;">
                    <label>Ignore</label>
                    <br>
                    <input
                        type="text"
                        class="text_pole flex1"
                    />
                </div>
        
            </div>
        
        </div>
        
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

    panel.appendChild(div);
    
    console.log("Natural Extended injected");
});