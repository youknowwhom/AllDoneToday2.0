# ToDoList

一个清单应用。

同济大学 2022秋季 计算机科学导论 小组作业

## 本地预览

> 原本供小组成员查看的本地预览教程在[这里](doc/development/README.md)

### 前提条件

你需要先安装 [Node.js](https://nodejs.dev/) ，[npm](https://github.com/npm/cli) ，以及 [sqlite3](https://www.sqlite.org/index.html) 。

### 克隆项目

```sh
git clone https://github.com/VVsxmja/ToDoList.git
```

### 配置并启动前端

进入项目文件夹，打开一个新的终端，执行如下命令。

```sh
cd Frontend
npm install # 安装依赖
npm start # 启动 Vite dev server
```

### 配置并启动后端

进入项目文件夹，打开一个新的终端，执行如下命令。

```sh
cd Backend
npm install # 安装依赖
npm start # 启动 Nodemon
```

### 预览网页

当后端和前端都启动之后，访问 Vite 在控制台打印的网址即可预览网页。