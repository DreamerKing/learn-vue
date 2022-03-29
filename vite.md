## 功能

- npm 依赖解析和预构建
- 模块热重载
- 支持 TS 编译选项 isolatedModules 和 useDefineForClassFields
- 静态资源处理 查询参数 url、raw、worker、inline
- Glob 导入 import.meta.glob('xxx') import.meta.globEager('xxx')
- WebAssembly
- Web Worker
- 构建优化

## 插件

Vite 可以利用 Rollup 插件。
传统浏览器支持

```sh
npm add -D @vitejs/plugin-legacy
```

### 使用

```sh
yarn create vite
```
