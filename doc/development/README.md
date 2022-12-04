# 小组成员开发文档

## 本地预览

以下命令应该在你所使用的操作系统的命令行中执行。

### 安装 git

需要安装 [git](https://git-scm.com/) ，安装方法请查看对应官网上的指引。

安装完成后，输入如下命令验证 git 的安装：

```sh
git --version
```

可能的输出：

```sh
git version 2.38.1
```

### 一些工具

需要安装 [NodeJS](https://nodejs.dev/), [npm](https://github.com/npm/cli), [sqlite3](https://www.sqlite.org/index.html) 。

具体安装方法请查看对应官网上的指引。

### 验证这些工具的安装

```sh
node --version # 应当不小于 v19.0.1
npm --version # 应当不小于 8.19.2
sqlite3 --version # 应当不小于 3.39.4
```

### 下载项目文件，用编辑器打开项目文件夹

克隆本项目到本地，然后进入项目文件夹。

```sh
git clone https://github.com/VVsxmja/ToDoList.git
cd ToDoList
```

这里以 Visual Studio Code 为例，你也可以使用你喜欢的编辑器。

```sh
code . # 运行 Visual Studio Code ，并打开当前文件夹
```

### 配置并启动前端

在项目文件夹内启动命令行，执行下面的命令。

你也可以使用你所使用的编辑器的*集成终端*，假定你正在使用 Visual Studio Code 。

打开一个新的终端，执行如下命令。

```sh
cd Frontend
npm install # 安装依赖
npm start # 启动 Vite dev server
```

### 配置并启动后端

打开一个新的终端，执行如下命令，注意不要关闭先前的终端。

```sh
cd Backend
npm install # 安装依赖
npm start # 启动 Nodemon
```

### 预览网页

当后端和前端都启动之后，访问 Vite 在控制台打印的网址即可预览网页。

可能的输出：

```
  VITE v3.2.3  ready in 276 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

将上面 `Local` 后的网址复制到浏览器地址栏并按下回车访问即可。

如果你使用的终端软件支持，你也可以通过 `Ctrl` + `鼠标左键` 单击此网址进行访问。

## 将本地代码和远程代码同步

先进行 `git pull` 拉取远程代码。

如果这一步执行失败，你应该新建一个自己的分支。

在这之后，先执行 `npm install` 等命令来更新依赖版本。

然后你应该验证程序是否能够正常工作，如果有 BUG ，你应该先将它修复。

最后执行 `git push` 把代码推送到远程仓库。