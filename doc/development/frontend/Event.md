# Event.md

清单应用中，代办事项的数据结构。

## 代办事项类

```javascript
{
    "brief": String, // 事件简介，若未提供则为「空」或「详细信息中的前若干个字」
    "description": String, // 事件详细内容
    "importance": Level, // 事件的重要程度，Level 定义见后文。
    "time": Time, // 事件的时间，Time 定义见后文。
    // ...
}
```

## 事件的重要程度

- 按照「紧急」/「不紧急」，「重要」/「不重要」分为四类。
- `Level` 定义如下：（前端）
  ```javascript
  {
    "important": Boolean, // 是否重要
    "urgent": Boolean, // 是否紧急
  }
  ```

## 事件的时间

- 基本信息：
  - 发生时间，或起始/结束时间
  - 是否重复，及重复的具体信息
- `Time` 定义如下：（前端）
  ```javascript
  {
    "beginTime": Date,
    "endTime": Date,
    "repetition": {
        "enabled": Boolean, // 是否重复
        "deltaBase": String, // 「间隔」的时间单位
        "delta": Number, // 与 deltaBase 相乘，得到真正的间隔
    }
  }
  ```