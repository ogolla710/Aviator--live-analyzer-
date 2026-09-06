(function () {
    let lastResults = [];

    function findMultipliers() {
        const text = document.body.innerText;

        const matches = text.match(/\b\d+(?:\.\d+)?x\b/gi) || [];

        const values = matches
            .map(x => parseFloat(x.replace(/x/i, "")))
            .filter(x => x >= 1 && x <= 100000);

        return [...new Set(values)];
    }

    function updateResults() {
        const values = findMultipliers();

        if (values.length === 0) return;

        const newValues = values.filter(
            x => !lastResults.includes(x)
        );

        if (newValues.length > 0) {

            chrome.storage.local.get(
                ["multipliers"],
                function (data) {

                    let history =
                        data.multipliers || [];

                    history =
                        history.concat(newValues);

                    history =
                        history.slice(-200);

                    chrome.storage.local.set({
                        multipliers: history
                    });
                }
            );

            lastResults = values;
        }
    }

    setInterval(updateResults, 1500);

    updateResults();

})();
