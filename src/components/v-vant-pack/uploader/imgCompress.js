/**
 * 图片压缩处理
 * @param file 文件
 * @param uplimit 文件大小多少M时开始压缩
 * @returns {Promise<unknown>} 文件
 */
const imgHandle = function (file, uplimit = 1) {
    return new Promise(resolve => {
        try {
            // 类型为png或jpg且大于1M，进行压缩
            if (/\/(?:jpeg|png)/i.test(file.type) && file.size > uplimit * 1024 * 1024) {
                let imgName = file.name     // 文件名
                let imgType = file.type     // 文件类型
                // 文件转base64
                let reader = new FileReader()
                reader.readAsDataURL(file)
                reader.onload = function () {
                    let content = this.result   // base64
                    let img = new Image()
                    img.src = content
                    img.onload = function () {  // 加载完成
                        // 用于压缩图片的canvas
                        let canvas = document.createElement('canvas')
                        let ctx = canvas.getContext('2d')
                        let width = img.width
                        let height = img.height
                        canvas.width = width
                        canvas.height = height
                        ctx.drawImage(img, 0, 0, width, height)
                        let dataURL = canvas.toDataURL('image/jpeg', 0.3)  // 压缩后的base64文件
                        // 转为file文件
                        // eslint-disable-next-line one-var
                        let arr = dataURL.split(','),
                            mime = arr[0].match(/:(.*?);/)[1],
                            bstr = atob(arr[1]),
                            n = bstr.length,
                            u8arr = new Uint8Array(n)
                        while (n--) {
                            u8arr[n] = bstr.charCodeAt(n)
                        }
                        let newblob = new Blob([u8arr], {type: mime})
                        let newfile = new File([newblob], imgName, {type: imgType, lastModified: Date.now()})
                        console.log('图片已压缩')
                        resolve(newfile)
                    }
                }
            } else {                        // 不压缩
                console.log('图片未压缩')
                resolve(file)
            }
        } catch (e) {
            console.log("图片压缩处理异常：", e)
            resolve(file)
        }
    })
}

export default imgHandle