wittyna-admin   
## 简介
一个简单的三方授权管理系统。支持客户端注册，用户管理，用户权限定义等。

## 启动项目
* 1、确保有 postgresql 服务，数据库配置地址在 node/.env中配置

* 2、确保有 redis 服务，redis配置地址在 node/config.mts 中配置

* 3、确保本地启动了 wittyna-auth 服务，https://github.com/wittyna/wittyna-auth

* 4、安装依赖
```shell
npm install
```
* 5、启动项目
```shell
npm run dev
```
* 6、访问
  http://127.0.0.1:5566/


