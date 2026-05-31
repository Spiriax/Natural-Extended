jQuery(() => {
    console.log("Natural Extended loaded");

    const panels = document.querySelectorAll('.inline-drawer-content');

    console.log("Found panels:", panels.length);

    panels.forEach((panel, index) => {
        console.log(`Panel ${index}:`, panel);

        const div = document.createElement('div');

        div.innerHTML = `
            <div
                id="natural-extended-test-${index}"
                style="
                    background:red;
                    color:white;
                    font-size:30px;
                    padding:20px;
                    margin:20px;
                    border:5px solid yellow;
                ">
                NATURAL EXTENDED TEST (${index})
            </div>
        `;

        panel.appendChild(div);
    });

    console.log("Natural Extended injected");
});