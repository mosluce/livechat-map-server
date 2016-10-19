# LiveChat Map Server

參考 [LiveMaps](https://livemaps.ioa.tw/) 製作 App 版本，後端部分

## 技術部分

- Node.js : ES6 - 使用 babel 編譯
    - Socket.io
    - MongoDB : mongoose
- Hosting
    - Heroku : +mLab
- App
    - iOS : Swift
    - Android : 不想做 w ... [逃避雖可恥但有用](https://zh.wikipedia.org/wiki/逃避雖可恥但有用)

## 使用方式

- 請先參考 [Firebase 文件](https://firebase.google.com/docs/server/setup) ，取得 Credential 檔案，重新命名為 ``` serviceAccountCredentials.json ```
- 進行編譯&執行 ``` npm run dev ``` 
- 取得 [iOS版 App](https://github.com/mosluceLiveChatMapSwift) 可直接使用 (開發伺服器可能會關閉)
- 或參考 [Firebase 文件](https://firebase.google.com/docs/ios/setup) 更換 plist 連線到自己架設的主機 

## 坑..很多坑

- 地圖上顯示參加者位置(√)
- 文字聊天
- 私人訊息
- 房間系統
- 分流系統
- etc...

## LICENSE

MIT

Copyright (c) 2016 mosluce

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.