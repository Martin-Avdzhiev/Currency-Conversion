const { api_key } = require("./config.json");
const { validateInputs } = require("./validation");
const { getData, saveData } = require("./manageData");
const url = "https://api.fastforex.io";
const options = { method: 'GET', headers: { accept: 'application/json' } };
async function exchange(date, amount, baseCurrency, targetCurrencyArray) {
    try {
        validateInputs(date, amount, baseCurrency, targetCurrencyArray);
        baseCurrency = baseCurrency.toUpperCase();
        targetCurrencyArray = targetCurrencyArray.map((x) => x.toUpperCase());
        const data = getData(date,baseCurrency,targetCurrencyArray);
        if(!data){

            const request = await fetch(`${url}/historical?api_key=${api_key}&from=${baseCurrency}&to=${targetCurrencyArray.join()}&date=${date}`, options);
            const response = await request.json();
            const results = response.results;
            for (const key in results) {
                const exchangeRate = results[key];
                console.log(`${amount} ${baseCurrency} is ${((amount * exchangeRate).toFixed(2))} ${key}`);
            }
            saveData(response);
        }
        else{
            for (const pair of data) {
                const [pairedCurrency,exchangeRate] = Object.entries(pair)[0];
              console.log(`${amount} ${baseCurrency} is ${((amount * exchangeRate).toFixed(2))} ${pairedCurrency}`);
            }
        }
        console.log("END");
    } catch (error) {
        if (error.message) {
            console.log(error.message)
        }
        else {
            console.log(error)
        }
        console.log("END");
    }
}
exchange("2024-05-16", 12.25, "GBP", ["USD", "EUR", "GBP"]);



