# Userinfo.md

清单应用中， 用户的数据结构。

## 用户数据类

- 下面是前端注册用户并完善用户信息的实现结构：

```javascript
{
    "username": String, // 用户名
    "token": String, // 一个记录用户是否登录的请求头。每次登录更新
    "UpdateAt": Date, // 最新登录时间，用于生成token
    "EmailAddress": String,// 用户邮箱地址，用于实现发验证码和找回密码
    "passwordHash":String, // 已经被定义好的密码哈希
    "UserGender": String,// 用户性别
    "Signature": String,// 个性签名
    "BirthDay": String, // 用户生日
    "Major": String,// 专业
    "Grade": String,// 年级
    "Photourl": String// 用于记录头像信息
}
```

- 对应不同的接口实现的传参用户信息不同，上面注册用户分为"必要信息"和"不必要信息".其中必要信息指在用户注册就必须要写入的，不必要信息是说在personalinfo这个url下可以自行修改的。

```javascript
// 这是在register下生成的用户基本信息
{
    "username": String, // 用户名
     "UpdateAt": Date, // 最新登录时间，用于生成token
    "EmailAddress": String,// 用户邮箱地址，用于实现发验证码和找回密码
    "passwordHash":String// 已经被定义好的密码哈希
}
```

- 在登陆的时候需要实现一个token，在登陆验证成功后加密生成给数据库，验证正确后需要返还token给前端存入浏览器的本地存储用于记录登陆状态

- 在登陆状态下前端每次都需要发送请求时都需要带上token给后端。这样才可以验证登陆状态。在personalinfo下可以对剩下的那些数据进行赋值。