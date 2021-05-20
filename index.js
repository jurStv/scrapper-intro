const Nightmare = require('nightmare')
const nightmare = Nightmare({ show: false })
const fs = require('fs')  
const Path = require('path')  
const axios = require('axios')

const scDownloader = 'https://soundcloudmp3.cc/'

async function getDownloadLinkFromSc(scLink) {
  return nightmare
    .goto(scDownloader)
    /* Find element with id search_form_input_homepage, and input text */
    .type('#videoURL', scLink)
    /* Click on button */
    .click('#conversionForm button[type=\'submit\']')

    .evaluate(() => document.querySelector('#ftype option[value=\'3\']').setAttribute('selected', 'selected'))

    /* Wait when this element appears on page */
    .wait('a.btn.btn-success.download-buttons')
    /* Grap the href of the first link of results */
    .evaluate(() => document.querySelector('a.btn.btn-success.download-buttons').href)
    /* End session */
    // .end()
}

const last = (arr) => arr[arr.length - 1];

const getFile = (fileName, url) => axios({
  method: "get",
  url,
  responseType: "stream"
}).then(function (response) {
  response.data.pipe(fs.createWriteStream(`./files/${fileName}`));
}); 

async function main() {
  const scLinks = ['https://soundcloud.com/bliss_inc/radiant-reality'];
  const fileNames = scLinks.map((link) => `${last(link.split('/'))}.mp3` );
  const downloadLinks = await Promise.all(scLinks.map(getDownloadLinkFromSc));
  /* Parallele download */
  // const downloads = await Promise.all(downloadLinks.map((link, index) => {
  //   const filename = fileNames[index];
  //   return getFile(filename, link);
  // }));
  const downloads = await downloadLinks.reduce((acc, link, index) => {
    const filename = fileNames[index];
    return acc.then(() => getFile(filename, link));
  }, Promise.resolve(true));

  nightmare
    .end()
    .then(console.log)
    .catch(console.error);
  console.log(downloadLinks);
}

main();


// nightmare
//   .goto(scDownloader)
//   /* Find element with id search_form_input_homepage, and input text */
//   .type('#videoURL', scLink)
//   /* Click on button */
//   .click('#conversionForm button[type=\'submit\']')

//   .evaluate(() => document.querySelector('#ftype option[value=\'3\']').setAttribute('selected', 'selected'))

//   /* Wait when this element appears on page */
//   .wait('a.btn.btn-success.download-buttons')
//   /* Grap the href of the first link of results */
//   .evaluate(() => document.querySelector('a.btn.btn-success.download-buttons').href)
//   /* End session */
//   .end()
//   /* Log the result */
//   .then(console.log)
//   .catch(error => {
//     console.error('Search failed:', error)
//   })


// async function doWork(links) {
//   const results = await links.reduce((acc, link, index) => {
//     const nm = acc
//       .goto(link)
//       .wait('#r1-0 a.result__a')
//       .evaluate(() => document.querySelector('#r1-0 a.result__a').href);

//       const isLast = index === links.length - 1;

//       return isLast ? nm.end() : nm;
//   }, nightmare)
//   console.log(results);
// } 

// doWork(duckLinks);

// nightmare
//   /* Go to some page */
//   .goto('https://duckduckgo.com')
//   /* Find element with id search_form_input_homepage, and input text */
//   .type('#search_form_input_homepage', 'github nightmare')
//   /* Click on button */
//   .click('#search_button_homepage')
//   /* Wait when this element appears on page */
//   .wait('#r1-0 a.result__a')
//   /* Grap the href of the first link of results */
//   .evaluate(() => document.querySelector('#r1-0 a.result__a').href)
//   /* End session */
//   .end()
//   /* Log the result */
//   .then(console.log)
//   .catch(error => {
//     console.error('Search failed:', error)
//   })