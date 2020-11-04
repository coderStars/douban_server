function parseQueryStr(queryStr){
  let queryData = {};
  let queryStrList = queryStr.split('&');
  for (let [index, queryStr] of queryStrList.entries()) {
      let itemList = queryStr.split('=')
      queryData[itemList[0]] = decodeURIComponent(itemList[1])
  }
  return queryData
}
module.exports = {
  parsePostData: (ctx) => {
      return new Promise((resolve, reject) => {
          try {
              let postData = '';
              ctx.req.addListener('data', (data) => {
                  postData += data;
              })
              ctx.req.addListener('end', () => {
                  let parseData = parseQueryStr(postData);
                  resolve(parseData);
              })
          } catch (err) {
              reject(err)
          }
      })
  }
}