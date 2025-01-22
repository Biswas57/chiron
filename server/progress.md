# Workflow

1. Get URL
2. parse URL
3. Extract HTML contents of the page
3. Extract Text from HTML
4. Package text with prompt and pipe it to OLLAMA
5. receive OLLama script
6. return script as output 
7. use Flask for endpoints

Problems:
- chromedriver application has a different pathfile name on windows
- pdf downloading requires access to Shadow DOMS on chrom which has been a painful process
    - gave up on this and tried HTML parsing
    - slightly worked but Selenium also has a module that lets me extract text straight from the site.

### How to connect to flask server output

```js
fetch("http://localhost:5000/api/extract-text", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ url: "https://example.com" }),
})
  .then((res) => res.json())
  .then((data) => {
    console.log(data);
  })
  .catch((err) => console.error(err));
```