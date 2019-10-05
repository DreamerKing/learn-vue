# learn vue

定位： 用于构建UI的渐进式JS框架 核心库只关注视图层 方便与第三方库和已有项目整合，有完善的现代化的工具链和支持类库。

特点： 易用 灵活 高效


Vue(options)
+ el
+ data 数据
+ methods 方法
+ compted

计算属性、方法和侦听属性的区别
 计算属性是基于它们的`响应式依赖`进行缓存的。只在相关响应式依赖发生改变时它们才会重新求值。而方法没有缓存。侦听属性是一种通用的观察和响应Vue实例数据变化属性。

实例方法
watch(prop, cb);

实例生命周期钩子
+ beforeCreate
+ created
+ beforeMount
+ mounted
+ beforeUpdate
+ updated
+ beforeDestroy
+ destroyed

![实例生命周期函数](lifecycle.png)

## 模版语法
+ 插值  声明式渲染 `{{}}` 
    v-once 一次性插值
+ 原始HTML 
    v-html 谨慎使用
+ 特性
    v-bind:prop
+ 模版表达式
+ 指令 当表达式的值改变时，将其产生的连带影响，响应式地作用于 DOM
    + v-bind 绑定
    + v-if 条件
    + v-for 循环
    + v-on:event
    
    指令参数
    修饰符
        + submit.prevent => event.preventDefault()
    缩写
    + : => v-bind
    + @ => v-on:

计算属性 computed
侦听器 watch

v-bind:class 支持字符串、对象、数组、计算属性
v-bind:style 支持对象、数组写法

条件渲染
v-if
v-else-if
v-else
v-show 不支持template

单元素／组件的过渡
transition 封装组件
属性
    + duration 
    + mode="in-out|out-in" 过渡模式
事件
    + transitionend
    + animationend
    + appear 初始化渲染的过渡
hook
    + before-enter
    + enter
    + after-enter
    + enter-cancelled
    + before-leave
    + leave
    + after-leave
    + leave-cancelled

+ 条件渲染
+ 条件展示
+ 动态组件
+ 动态根节点

过渡类名
+ v-enter enter-class
+ v-enter-active enter-active-class
+ v-enter-to enter-to-class
+ v-leave leave-class
+ v-leave-active leave-active-class
+ v-leave-to leave-to-class

v可以被name属性的值代替



列表过渡
transition-group
+ v-move
+ move-class