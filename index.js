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
    <div
        id="natural-extended-test"
        style="
            background:red;
            color:white;
            font-size:30px;
            padding:20px;
            margin:20px;
            border:5px solid yellow;
        ">
        NATURAL EXTENDED TEST
    </div>
    `;
    
    panel.appendChild(div);

    console.log("Natural Extended injected");
});