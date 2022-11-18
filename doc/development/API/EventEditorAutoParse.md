# EventEditorAutoParse.md

清单应用中，添加新代办事项的输入框对于「时间词」的「自动高亮」功能的实现说明。

## 概述

- 前端维护一个支持「高亮部分文本」的文本编辑框，在其中内容被用户更新时，将更新后的内容发送给后端。
- 后端维护一个接口，接收前端传来的文本，提取出其中包含「时间词」的子串，将子串位置及长度，以及具体事件信息回传给前端。
- 前端收到后端回传的信息后，按需重新渲染编辑框中的文本。

## 接口说明

- 接口：`/api/ParseEventDescription`
- 前端请求：
  ```javascript
  {
    "id": String, // 本次请求的 id
    "content": String, // 编辑框中的内容
  }
  ```
- 后端回应：
  - 若后端能够正确处理请求，则返回如下数据：
    ```javascript
    {
      "id": String, // 对应请求的 id
      "time": {
        "beginIndex": Number, // id 对应的 content 中，时间词的起始下标
        "endIndex": Number, // id 对应的 content 中，时间词的结尾下标
        "time": Time, // 时间词对应的具体时间，Time 定义见 Event.md
      }
    }
    ```
    - 返回状态码 `200` 。
  - 否则，返回状态码 `502` ，返回如下数据。
    ```javascript
    {
      "id": String, // 对应请求的 id 
    }
    ```
  - 后端可能失败的情形：
    - 解析文本所需的插件丢失
    - 解析文本所需的时间过长，后端主动放弃

## 前端实现

- 编辑框的具体实现参考[这篇文章](https://css-tricks.com/creating-an-editable-textarea-that-supports-syntax-highlighted-code/)。
- 前端维护一个 `currentID` 变量，随着用户更新编辑框内容而更新。
- 当用户「更新编辑框中的内容」时，前端进行如下操作：
  - 生成一个不重复的 `id` ，并用它更新 `currentID` 。
  - 如果用户更改了高亮的内容，则取消那一处高亮。
  - 延时一段时间（异步）。
  - 比较 `id` 是否与 `currentID` 相同，即延时期间用户是否继续输入文本。
    - 如果不相同，则中止当前操作，避免短时间内向后端发起太多请求。
  - 提取出编辑框中的文本内容，调用 `/api/ParseEventDescription` 接口。
- 当前端「收到后端的回应」时，进行如下操作：
  - 比较回应数据中的 `id` 与 `currentID` ，若不一致则丢弃。
  - 根据后端返回的数据，更新编辑框中文本的高亮。

## 后端实现

- 使用开源 NLP 时间语义分析库，比如 [JioNLP](https://github.com/dongrixinyu/JioNLP) 。
- 接到前端请求后，调用分析工具，找到对应的「时间词」和「重要程度」子串。
- 向前端返回数据。