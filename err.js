function createHexGrid() {
    const hexWidth = 100;
    const hexHeight = 86.6;
    const spacing = 50;
    const hexGrid = document.querySelector('.hex-grid');

    const screenWidth = window.innerWidth * 1.2;
    const screenHeight = window.innerHeight * 1.2;
    const hexPerRow = Math.ceil(screenWidth / (hexWidth + spacing));
    const totalRows = Math.ceil(screenHeight / (hexHeight / 2));

    const offsetX = -hexWidth * 0.5;
    const offsetY = -hexHeight * 0.5;
    const messages = hexGrid.getAttribute('data-messages').split(',');

    for (let row = 0; row < totalRows; row++) {
        for (let i = 0; i < hexPerRow; i++) {
            const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
            svg.setAttribute("width", hexWidth);
            svg.setAttribute("height", hexHeight);
            svg.setAttribute("viewBox", `0 0 ${hexWidth} ${hexHeight}`);

            const hex = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            hex.setAttribute("points", `
                ${hexWidth * 0.25},0
                ${hexWidth * 0.75},0
                ${hexWidth},${hexHeight * 0.5}
                ${hexWidth * 0.75},${hexHeight}
                ${hexWidth * 0.25},${hexHeight}
                0,${hexHeight * 0.5}
            `);
            svg.appendChild(hex);

            const innerHex = document.createElementNS("http://www.w3.org/2000/svg", "polygon");
            const shrinkFactor = 0.85;
            innerHex.setAttribute("points", `
                ${hexWidth * 0.25 * shrinkFactor + hexWidth * (1 - shrinkFactor) / 2},${hexHeight * 0.5 * (1 - shrinkFactor)}
                ${hexWidth * 0.75 * shrinkFactor + hexWidth * (1 - shrinkFactor) / 2},${hexHeight * 0.5 * (1 - shrinkFactor)}
                ${hexWidth * shrinkFactor + hexWidth * (1 - shrinkFactor) / 2},${hexHeight * 0.5}
                ${hexWidth * 0.75 * shrinkFactor + hexWidth * (1 - shrinkFactor) / 2},${hexHeight * 0.5 + (hexHeight * 0.5 * shrinkFactor)}
                ${hexWidth * 0.25 * shrinkFactor + hexWidth * (1 - shrinkFactor) / 2},${hexHeight * 0.5 + (hexHeight * 0.5 * shrinkFactor)}
                ${hexWidth * (1 - shrinkFactor) / 2},${hexHeight * 0.5}
            `);
            svg.appendChild(innerHex);

            const textUp = document.createElementNS("http://www.w3.org/2000/svg", "text");
            textUp.setAttribute("x", hexWidth / 2);
            textUp.setAttribute("y", hexHeight * 0.3);
            textUp.setAttribute("class", "warning-text");
            textUp.textContent = "▲";
            svg.appendChild(textUp);

            const textMid = document.createElementNS("http://www.w3.org/2000/svg", "text");
            textMid.setAttribute("x", hexWidth / 2);
            textMid.setAttribute("y", hexHeight * 0.5);
            textMid.setAttribute("class", "warning-text");
            textMid.textContent = messages[Math.floor(Math.random() * messages.length)];
            svg.appendChild(textMid);

            const textDown = document.createElementNS("http://www.w3.org/2000/svg", "text");
            textDown.setAttribute("x", hexWidth / 2);
            textDown.setAttribute("y", hexHeight * 0.7);
            textDown.setAttribute("class", "warning-text");
            textDown.textContent = "▼";
            svg.appendChild(textDown);

            const initialState = ['color-original', 'color-dark', 'color-black'];
            const randomState = initialState[Math.floor(Math.random() * initialState.length)];
            hex.classList.add('hex', randomState);
            innerHex.classList.add('inner-hex', randomState);

            if (row % 2 === 0) {
                svg.style.left = `${i * (hexWidth + spacing) + offsetX}px`;
            } else {
                svg.style.left = `${i * (hexWidth + spacing) + (hexWidth * 0.75) + offsetX}px`;
            }

            svg.style.top = `${row * (hexHeight / 2) + offsetY}px`;
            hexGrid.appendChild(svg);
            setTimeout(() => randomFlicker(hex, innerHex, textUp, textMid, textDown), Math.random() * 5000);
        }
    }
}

function randomFlicker(outerHex, innerHex, textUp, textMid, textDown) {
    const states = ['color-original', 'color-dark', 'color-black'];
    const currentClass = outerHex.getAttribute('class').split(' ').pop();
    let nextClass;

    if (currentClass === 'color-original') {
        nextClass = 'color-dark';
    } else if (currentClass === 'color-dark') {
        nextClass = Math.random() > 0.5 ? 'color-original' : 'color-black';
    } else if (currentClass === 'color-black') {
        nextClass = 'color-original';
    }

    outerHex.setAttribute('class', `hex ${nextClass}`);
    innerHex.setAttribute('class', `inner-hex ${nextClass}`);

    const hexGrid = document.querySelector('.hex-grid');
    const messages = hexGrid.getAttribute('data-messages').split(',');
    textMid.textContent = messages[Math.floor(Math.random() * messages.length)];

    setTimeout(() => randomFlicker(outerHex, innerHex, textUp, textMid, textDown), Math.random() * 5000 + 5000);
}

window.addEventListener('load', function() {
    createHexGrid();
});

window.addEventListener('resize', function() {
    document.querySelector('.hex-grid').innerHTML = '';
    createHexGrid();
});
