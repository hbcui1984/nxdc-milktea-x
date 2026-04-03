
## H5平台

1. 从uni-app vue3版本升级到uni x版本，启动后报错：

```
11:49:11.717 App Hide at App.uvue:15
11:49:12.663 [vite] connecting...
11:49:12.689 [vite] connected.
11:49:13.257 ​warning: Cannot find name 'onError'. Did you mean 'onerror'?​
11:49:13.257 ​at App.uvue:41:2​
11:49:13.258   39 |
11:49:13.258   40 |
11:49:13.258 > 41 |   onError((err : any) => {
11:49:13.258      |   ^^^^^^^
11:49:13.258   42 |     console.log('App Error', err)
11:49:13.258   43 |   })
11:49:13.258   44 | </script>
11:49:13.731 App Launch at App.uvue:7
11:49:13.731 App Show at App.uvue:11
11:49:13.823 Preload pages in uni-app-x development mode.
```

2. 点餐页面空白 [](http://localhost:5173/#/pages/menu/menu)

原因：升级过程中，将本地Mock的静态数据给弄丢了

3. 完善静态数据后，点餐页面显示依然不全，只有一次分类，没有二级分类

![](upgradeLog_files/1.jpg)

正确的UI，应该是这个样子的：

![](upgradeLog_files/2.jpg)

> 改的更坏了，现在一级菜单分类也看不到了。[Image 1] 。另外，你应该尽量保持和老版一样的模拟数据方式，比如依然在api目录下。另外，你也要检查，除了这个页面，是不是企业页面的模拟数据，你也没处理？我看api文件夹下，目前只有一个文件，但老版项目（同目录的nxdc-milktea）api文件夹下有很多文件。

