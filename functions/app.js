const axios = require('axios')
const cheerio = require('cheerio')


const LeanResponse = (html) => {
    let $ = cheerio.load(html)
    return $('.js-sortable-table').map((index, element) => ({
        moeda: $(element).find('a').text(),
        compra: parseFloat($(element).find('div.hiddenOne.js-col-bid.pid-2103-bid').text().replace(",", ".")),
        venda: parseFloat($(element).find('div.hiddenOne.js-col-ask.pid-2103-ask').text().replace(",", ".")),
        ultimo: parseFloat($(element).find('div.last.hiddenTwo.js-col-last.pid-2103-last').text().replace(",", ".")),
        abertura: parseFloat($(element).find('div.hiddenTwo.hiddenFour.js-col-prev').text().replace("Abertura", "").replace(",", ".")),
        maximo: parseFloat($(element).find('div.hiddenOne.js-col-high.pid-2103-high').text().replace(",", ".")),
        minimo: parseFloat($(element).find('div.hiddenOne.js-col-low.pid-2103-low').text().replace(",", ".")),
       data: $(element).find('span.pid-2103-time').text(),
        dataSalvamento: new Date()
      })).get()
}

const pegaCotacao = async (LeanResponse) => {
    try {
        const resposta = await axios({
            url: "https://br.widgets.investing.com/live-currency-cross-rates?theme=darkTheme&pairs=2103",
            method: 'get'
        })
        const object = await LeanResponse(resposta.data )
        return Promise.resolve(object)
        
    } catch (err) {
        return Promise.reject(err)
        
    }
}
pegaCotacao(LeanResponse)
.then(resp => console.log(resp))
.catch(err => console.log(err))
