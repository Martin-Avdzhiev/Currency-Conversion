const fs = require("fs");

function getData(date, baseCurrency, targetCurrencyArray) {
    const db = JSON.parse(fs.readFileSync("./db.json"));
    const index = db.findIndex((x) => Object.keys(x)[0] == date);
    if (index == -1) {
        return false;
    }
    const searchedDate = db[index][date];
    const currencyIndex = searchedDate.findIndex((x) => Object.keys(x)[0] == baseCurrency);
    if (currencyIndex == -1) {
        return false;
    }
    const results = searchedDate[currencyIndex][baseCurrency].results;
    const matchedCurrencies = [];
    for (const key in results) {
        if (targetCurrencyArray.includes(key)) {
            matchedCurrencies.push({ [key]: results[key] })
        }
    }
    if (matchedCurrencies.length == targetCurrencyArray.length) {
        return matchedCurrencies;
    }
    return false;
}
//console.log(getData("2024-05-15", "USD", ["GBP","EUR","BGN"]))

function saveData(data) {
    const db = JSON.parse(fs.readFileSync("./db.json"));
    const dateIndex = db.findIndex((x) => Object.keys(x)[0] == data.date);
    if (dateIndex != -1) {
        const searchedDate = db[dateIndex][data.date];
        const currencyIndex = searchedDate.findIndex((x) => Object.keys(x)[0] == data.base);
        if (currencyIndex != -1) {
            for (const key in data.results) {
                if (!db[dateIndex][data.date][currencyIndex][data.base].results[key]) {
                    db[dateIndex][data.date][currencyIndex][data.base].results[key] = data.results[key];
                }
            }
        }
        else {
            const newPair = { [data.base]: { results: {} } }
            for (const key in data.results) {
                newPair[data.base].results[key] = data.results[key];
            }

            db[dateIndex][data.date].push(newPair)
        }
    }
    else {
        const newDate = { [data.date]: [{ [data.base]: { results: {} } }] };
        for (const key in data.results) {
            newDate[data.date][0][data.base].results[key] = data.results[key];
        }
        db.push(newDate);
        fs.writeFileSync("./db.json", JSON.stringify(db), "utf8");
    }
}
// saveData({
//     date: '2024-05-14',
//     base: 'BGN',
//     results: { EUR: 0.92118, GBP: 0.79076, HI: 1.5, hello: 1 },
//     ms: 2
// })
module.exports = { getData, saveData }