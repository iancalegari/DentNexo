async function checkRequestApi() {
  const jsRes = await fetch('https://ttsforfree.com/_next/static/chunks/8215-62573aff9e9697ce.js');
  const js = await jsRes.text();
  const index = js.indexOf('requestApi');
  if (index !== -1) {
    console.log('Found requestApi:', js.slice(index - 200, index + 300));
  } else {
    console.log('Not in 8215, searching other scripts');
  }
}
checkRequestApi();
