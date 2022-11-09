# ToDoList

一个清单应用。

## 本地预览（保姆级教程）

以下命令应该在你所使用的操作系统的命令行中执行。

### 安装 git

需要安装 git ，安装方法请自行搜索。

安装完成后，输入如下命令验证 git 的安装：

```sh
git --version
```

可能的输出：

```sh
git version 2.38.1
```

### 一些工具

需要安装 NodeJS, npm, sqlite3 。

具体安装方法请自行搜索。

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

按下 `Ctrl` + <code>\`</code> 打开一个新的终端。

```sh
cd ToDoList
npm install # 安装依赖
npm run dev # 启动 Vite
```

### 配置并启动后端

按下 `Ctrl` + <code>\`</code> 打开一个新的终端，注意不要关闭先前的终端。

```sh
cd Backend
npm install # 安装依赖
npm run dev # 启动 Nodemon
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