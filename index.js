jQuery(() => {
    console.log("Natural Extended loaded");

    const panel = document.querySelector(
        '.inline-drawer.wide100p.flexFlowColumn'
    );

    if (!panel) {
        console.log("Panel not found");
        return;
    }

    const div = document.createElement('div');

    div.innerHTML = `
        <div id="natural-extended-test"
             style="
                margin:10px;
                padding:10px;
                border:1px solid #666;
             ">
            <h3>Natural Extended</h3>
            <label>
                <input type="checkbox">
                Enable for this group
            </label>
        </div>
    `;

    panel.appendChild(div);

    console.log("Natural Extended injected");
});