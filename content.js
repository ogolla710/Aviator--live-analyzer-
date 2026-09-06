
(function () {
    console.log("Aviator Analyzer: reader started");

    let history = [];

    function scanPage() {
        const text = document.body.innerText || "";

        // Find numbers such as 1.25x, 2.04x, 12.67x
        const matches = text.match(/\b\d+(?:\.\d+)?\s*x\b/gi) || [];

        const values = matches
            .map(v => parseFloat(v.replace(/x/i, "").trim()))
            .filter(v => v >= 1.00 && v <= 100000);

        return values;
    }

    function update() {
        const values = scanPage();

        if (!values.length) return;

        const newest = values[0];

        // Only add a value if it is different from the previous one
        if (history.length === 0 || newest !== history[history.length - 1]) {

            history.push(newest);

            // Keep last 200 rounds
            if (history.length > 200) {
                history.shift();
            }

            chrome.storage.local.set({
                multipliers: history
            });

            console.log(
                "Aviator Analyzer detected:",
                newest + "x"
            );
        }
    }

    // Check the page every second
    setInterval(update, 1000);

    update();
})();
    

        
