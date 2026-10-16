[English](WINDOWS.en.md) | **简体中文** | [中文首页](../README.zh-CN.md)

# Windows桌面版

## 当前状态

本地正式版于2026-10-16同步网站功能：完整曲库、三层键盘、固定俯视、播放导航、后台音源和最新布局。版本号仍为2.2.1；工程打开上限由1MB提高至4MB，完整热血物语88小节工程可重新打开。

**[下载Windows x64正式版](https://github.com/power32m/Electronic-Step-Sequencer/releases/tag/v2.2.1)**，解压后双击 `OP16电子步进音序器.exe`。请保留整个文件夹；同页的SHA256校验文件可核对下载完整性。首次运行若系统提示未知发布者，请先核对下载来源；程序尚未进行代码签名。

网页版可[直接体验](https://op16-field-sequencer.breezysquid.chatgpt.site/)。下方构建步骤仅供开发者，使用下载包无需安装开发环境。

## 构建与启动

需要Windows 64位、Node.js 22.12或更高版本、.NET 8 SDK及Microsoft Edge WebView2运行时。在仓库根目录执行：

```powershell
npm ci
npm test
npm run build
dotnet publish desktop/OP16.Desktop.csproj -c Release -r win-x64 --self-contained true -o release
```

双击 `release/OP16电子步进音序器.exe`。整个 `release` 文件夹都属于运行包，不能只复制EXE。自包含构建随包提供.NET运行时；最终用户无需Node.js、SDK或本地服务器，但仍须安装WebView2运行时。

## 离线、保存与升级

网页资源从包内 `wwwroot` 加载，使用 `https://op16.local/` 映射本机资源，播放和导出不需联网。网页版首次加载需要网络，两者不同。

正常WebView2配置位于 `%LOCALAPPDATA%/OP16/WebView`。升级保留该目录即可继续读取原自动保存，不要用旧配置覆盖它。网站浏览器与桌面宿主是不同保存空间，迁移时请通过“保存工程／打开工程”交换JSON。

工程支持v1/v2/v3，上限4MB。保存工程和导出WAV弹出系统保存对话框。最小化可继续播放并暂停3D绘制；休眠、音频设备改变和后台策略仍可能影响声音。

更新已有安装：先保存JSON并退出旧程序，将整个旧程序目录另存备份，再用完整新发布目录替换，保留上述用户数据目录，启动后检查工程、试听及导出。

## 已完成的桌面检查

2026-10-16本地正式包通过普通及125%显示缩放下的启动、JSON保存恢复、40.2秒Boss完整WAV导出和后台播放检查。大型工程恢复使用约1.2MB的热血物语88小节工程。

开发者可在临时发布副本运行 `OP16电子步进音序器.exe --smoke-test`，加 `--smoke-125` 测试125%缩放。测试使用独立配置，在程序目录产生“验收”文件后退出。不要把测试产物当作个人工程。

具体控制见[使用指南](USER_GUIDE.md)。
