jQuery(() => {
    console.log("Natural Extended loaded");
    
    const context = SillyTavern.getContext();
    
    console.log("Event types:", context.eventTypes);

    if (context.eventSource) {
        console.log("Event source found");
    }
    
    console.log("Context:", context);
    console.log("Group ID:", context.groupId);
    console.log("Groups:", context.groups);
    console.log("Characters:", context.characters);
    console.log("Current character ID:", context.characterId);
    console.log("Current group ID:", context.groupId);
    console.log("Current chat:", context.chat);
    console.log("Tags:", context.tags);
    console.log("TagMap:", context.tagMap);
    console.log("getCharacters:", context.getCharacters);
    context.getCharacters().then(result => {
        console.log("getCharacters() result:", result);
    });

    const panels = document.querySelectorAll('.inline-drawer-content');

    console.log("Found panels:", panels.length);

    const panel = panels[16];

    if (!panel) {
        console.log("Natural Extended panel not found");
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
    
    if (context.eventSource) {
    console.log("Subscribing to events");

    context.eventSource.onAny?.((eventName, ...args) => {
        console.log("[Natural Extended Event]", eventName, args);
    });
}

    console.log("Natural Extended injected");
});