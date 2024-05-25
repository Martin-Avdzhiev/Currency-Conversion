const ammountPattern = /\d+\.{1}\d{2}\b/;
const currencyPattern = /[A-Za-z]{3}/;

function validateInputs(date, amount, baseCurrency, targetCurrencyArray) {
    if (!ammountPattern.test(amount)) {
        throw new Error("Please enter a valid amount");
    }
    if (!currencyPattern.test(baseCurrency)) {
        throw new Error("Please enter a valid currency code");
    }
    for (const currency of targetCurrencyArray) {
        if (!currencyPattern.test(currency)) {
            throw new Error(`${currency} is not a valid currency code`)
        }
    }
    if (!isWithinLast14Days(date)) {
        throw new Error("Historical data limited to 14 days")
    }
}
function isWithinLast14Days(inputDateString) {
    const inputDate = new Date(inputDateString);
    const currentDate = new Date();
    const pastDate = new Date();
    pastDate.setDate(currentDate.getDate() - 14);
    return inputDate >= pastDate;
}
module.exports = { isWithinLast14Days, validateInputs }