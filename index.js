const axios = require("axios");
const { yandexKey, norgivUrl } = require("./vars");


const printReponse = ( response, word, count ) => {
  console.log(`\n\n********************* Results for the word: ${word} ************************`);
  console.log('\n Count of the word in the document: ', count);
  console.log('\n Synonyms: ', response.data.def.syn === undefined ? 'NA' : response.data.syn); // Word synonyms

  if (!response.data.def.length) {
    console.log(`\n Part of speech: NA`);
  }

  response.data.def.forEach(entry => {
    console.log(`\n\n Part of speech: ${entry.pos}`);
    console.log(` Translations Synonyms: `);
    const trSynonyms = [];
    entry.tr.forEach(tr => {
      if (!tr.syn || tr.syn === undefined) {
        return;
      }

      tr.syn.forEach(syn => trSynonyms.push(syn.text));
    });
    console.log(' ', trSynonyms.length ? trSynonyms.toString() : 'NA');

    // Meaning are also printed, since synonyms are not in english
    console.log(` Meanings: `);
    const meanings = [];
    entry.tr.forEach(tr => {
      if (!tr.mean || tr.mean === undefined) {
        return;
      }

      tr.mean.forEach(mn => meanings.push(mn.text));
    });
    console.log(' ', meanings.length ? meanings.toString() : 'NA');
  })
}

// IIFE to show the output on console
(async () => {
  try {
    const res = await axios.get(norgivUrl);
    const words = res.data.split(
      /[\s`1234567890-=\[\]\\;',.\/~!@#$%^&*()_+{}|:"<>?]+/
    );
    console.log(`********************* Words Count: ${words.length} ************************\n`);
    let wordstable = {};
    for (let i = 0; i < words.length; i++) {
      if (wordstable[words[i]] === undefined) {
        wordstable[words[i]] = 0;
      }
      wordstable[words[i]]++;
    }

    const wordCount = [];
    Object.keys(wordstable).forEach((word) => {
      const count = wordstable[word];
      wordCount.push({ word, count });
    });
    wordCount.sort((a, b) => b.count - a.count);

    console.log(`\n********************* Top 10 words list ************************\n`);
    // multiple concurrent requests for the top words
    const requests = [];
    for (let i = 0; i < 10; i++) {
      console.log(`${wordCount[i].word} -> ${wordCount[i].count}`);
      const request = axios.get(`https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${yandexKey}&lang=en-ru&text=${wordCount[i].word}`);
      requests.push(request);
    }

    const responses = await axios.all(requests);

    responses.forEach((response, index) => printReponse(response, wordCount[index].word, wordCount[index].count)); //response.data.def[0].text
    
  } catch (error) {
    console.log(error || error.response || error.response.body);
  }
})();
