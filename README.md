# webpack-deploy-http-push
a alternative to fis3-deploy-http-push

## usage
```js
    new UploadPlugin({
        receiver: 'http://xx.com/receiver.php',
        to: '/home/work/orp'
    })
```
custom callback
```js
    new UploadPlugin({
        ...
        onUploaded: list => {
            for(const item of list) {
                const {file, code} = item
                console.log(file, code)
            }
        }
    })
```