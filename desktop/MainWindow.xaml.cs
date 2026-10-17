using System.IO;
using System.Text.Json;
using System.Windows;
using Microsoft.Web.WebView2.Core;
using Microsoft.Win32;
namespace OP16.Desktop;
public partial class MainWindow : Window
{
    private readonly bool smoke=Environment.GetCommandLineArgs().Contains("--smoke-test");
    private readonly bool testZoom=Environment.GetCommandLineArgs().Contains("--smoke-125");
    private readonly string data=Path.Combine(Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData),"OP16");
    public MainWindow(){InitializeComponent();var area=SystemParameters.WorkArea;Width=Math.Min(1440,area.Width*.94);Height=Math.Min(1040,area.Height*.94);MinWidth=Math.Min(900,area.Width*.8);MinHeight=Math.Min(640,area.Height*.8);Loaded+=Init;StateChanged+=(_,_)=>{if(Web.CoreWebView2 is not null)Web.CoreWebView2.PostWebMessageAsJson(JsonSerializer.Serialize(new{type="host-visibility",visible=WindowState!=WindowState.Minimized}));};Closing+=(_,_)=>{try{Web.CoreWebView2?.ExecuteScriptAsync("window.OP16?.engine.stop()");}catch{}};}
    private async void Init(object sender,RoutedEventArgs e){
      try {
        Directory.CreateDirectory(data);var root=Path.Combine(AppContext.BaseDirectory,"wwwroot");
        if(!File.Exists(Path.Combine(root,"index.html")))throw new IOException("网页资源缺失，请保留正式版目录的所有文件后重试。");
        var opts=new CoreWebView2EnvironmentOptions("--disable-background-timer-throttling --disable-renderer-backgrounding --autoplay-policy=no-user-gesture-required");
        var env=await CoreWebView2Environment.CreateAsync(null,Path.Combine(data,smoke?"TestWebViewClassics22":"WebView"),opts);await Web.EnsureCoreWebView2Async(env);
        Web.CoreWebView2.SetVirtualHostNameToFolderMapping("op16.local",root,CoreWebView2HostResourceAccessKind.DenyCors);
        Web.CoreWebView2.Settings.IsStatusBarEnabled=false;Web.CoreWebView2.Settings.AreDefaultContextMenusEnabled=false;Web.CoreWebView2.Settings.AreDevToolsEnabled=false;
        Web.CoreWebView2.NewWindowRequested+=(_,a)=>{
          a.Handled=true;
          if(Uri.TryCreate(a.Uri,UriKind.Absolute,out var link)&&link.Scheme=="https"&&link.Host=="github.com"&&(link.AbsolutePath=="/power32m/Electronic-Step-Sequencer"||link.AbsolutePath.StartsWith("/power32m/Electronic-Step-Sequencer/",StringComparison.Ordinal)))
            try{System.Diagnostics.Process.Start(new System.Diagnostics.ProcessStartInfo(link.AbsoluteUri){UseShellExecute=true});}catch{SendStatus("无法打开浏览器，请手动访问GitHub仓库。");}
        };
        Web.CoreWebView2.ProcessFailed+=(_,a)=>{Loading.Visibility=Visibility.Visible;Status.Text="界面进程已停止，请关闭程序后重新打开。自动保存的工程会保留。\n"+a.ProcessFailedKind;};
        Web.CoreWebView2.WebMessageReceived+=OpenMessage;Web.CoreWebView2.DownloadStarting+=SaveDownload;
        Web.CoreWebView2.PermissionRequested+=(_,a)=>{if(a.PermissionKind==CoreWebView2PermissionKind.MultipleAutomaticDownloads&&Uri.TryCreate(a.Uri,UriKind.Absolute,out var uri)&&uri.Host=="op16.local"){a.State=CoreWebView2PermissionState.Allow;a.SavesInProfile=false;a.Handled=true;}};
        if(testZoom)Web.ZoomFactor=1.25;
        Web.NavigationCompleted+=Navigation;Web.Source=new Uri("https://op16.local/index.html");
      }catch(Exception ex){Status.Text="启动未成功："+ex.Message+"\n\n若缺少 WebView2，请安装 Microsoft Edge WebView2 Evergreen 运行时后重试。";File.WriteAllText(Path.Combine(data,"启动错误.txt"),ex.ToString());}
    }
    private void OpenMessage(object? sender,CoreWebView2WebMessageReceivedEventArgs args){
      try{using var doc=JsonDocument.Parse(args.WebMessageAsJson);if(doc.RootElement.GetProperty("type").GetString()!="open-project")return;
        var dialog=new OpenFileDialog{Title="打开 OP·16 工程",Filter="OP16 工程 (*.json)|*.json",Multiselect=false};if(dialog.ShowDialog(this)!=true)return;
        if(new FileInfo(dialog.FileName).Length>4*1024*1024)throw new IOException("工程文件超过 4 MB，无法打开。");
        Web.CoreWebView2.PostWebMessageAsJson(JsonSerializer.Serialize(new{type="project-open",text=File.ReadAllText(dialog.FileName)}));
      }catch(Exception ex){SendStatus("打开失败："+ex.Message);}
    }
    private void SaveDownload(object? sender,CoreWebView2DownloadStartingEventArgs args){
      args.Handled=true;var name=Path.GetFileName(args.ResultFilePath);bool wav=name.EndsWith(".wav",StringComparison.OrdinalIgnoreCase);
      if(smoke){var dir=Path.Combine(AppContext.BaseDirectory,testZoom?"验收125":"验收");Directory.CreateDirectory(dir);args.ResultFilePath=Path.Combine(dir,name);return;}
      var dialog=new SaveFileDialog{Title=wav?"导出 WAV 音频":"保存 OP·16 工程",FileName=name,Filter=wav?"WAV 音频 (*.wav)|*.wav":"OP16 工程 (*.json)|*.json",AddExtension=true,OverwritePrompt=true};
      if(dialog.ShowDialog(this)!=true){args.Cancel=true;SendStatus("已取消保存");return;}args.ResultFilePath=dialog.FileName;
      args.DownloadOperation.StateChanged+=(_,_)=>{if(args.DownloadOperation.State==CoreWebView2DownloadState.Completed)SendStatus("已保存："+dialog.FileName);else if(args.DownloadOperation.State==CoreWebView2DownloadState.Interrupted)SendStatus("文件保存未完成："+args.DownloadOperation.InterruptReason);};
    }
    private void SendStatus(string message)=>Web.CoreWebView2.PostWebMessageAsJson(JsonSerializer.Serialize(new{type="file-status",message}));
    private async void Navigation(object? sender,CoreWebView2NavigationCompletedEventArgs args){
      if(!args.IsSuccess){Status.Text="本地界面加载失败："+args.WebErrorStatus;return;}
      await Task.Delay(700);Loading.Visibility=Visibility.Collapsed;if(!smoke)return;
      try{
        var outDir=Path.Combine(AppContext.BaseDirectory,testZoom?"验收125":"验收");Directory.CreateDirectory(outDir);
        var accompaniment=await Web.CoreWebView2.ExecuteScriptAsync("(()=>{document.getElementById('new-project').click();const results=[];for(const style of ['pop','rock','funk','dance','hiphop','latin','chip']){const select=document.getElementById('accompaniment-style');select.value=style;select.dispatchEvent(new Event('change'));const start=performance.now();document.getElementById('random-accompaniment').click();const p=window.OP16.getProject();window.OP16.validate(p);results.push({style,ms:performance.now()-start,active:[0,1,2,3,5].map(t=>p.tracks[t].steps.filter(s=>s.on).length),mode:p.tracks[5].mode,lead:p.tracks[4].steps.some(s=>s.on)});}return {version:document.querySelector('header .brand').textContent,results};})()");
        using(var checks=JsonDocument.Parse(accompaniment)){
          var rows=checks.RootElement.GetProperty("results");
          if(rows.GetArrayLength()!=7||!checks.RootElement.GetProperty("version").GetString()!.Contains(typeof(MainWindow).Assembly.GetName().Version!.ToString(3)))throw new IOException("本地伴奏版本或风格检查失败。");
          foreach(var row in rows.EnumerateArray())if(row.GetProperty("lead").GetBoolean()||row.GetProperty("active").EnumerateArray().Any(n=>n.GetInt32()==0))throw new IOException("本地伴奏声部检查失败。");
        }
        File.WriteAllText(Path.Combine(outDir,"本地伴奏验收.json"),accompaniment);
        var largeFixture=Path.Combine(AppContext.BaseDirectory,"smoke-large.op16.json");
        if(File.Exists(largeFixture)){
          if(new FileInfo(largeFixture).Length>4*1024*1024)throw new IOException("大型工程超过4MB。");
          Web.CoreWebView2.PostWebMessageAsJson(JsonSerializer.Serialize(new{type="project-open",text=File.ReadAllText(largeFixture)}));await Task.Delay(500);
          var restored=await Web.CoreWebView2.ExecuteScriptAsync("window.OP16.getProject().phraseBars");if(restored!="113")throw new IOException("大型完整工程重新打开失败。");
          File.WriteAllText(Path.Combine(outDir,"大型工程恢复.json"),JsonSerializer.Serialize(new{bytes=new FileInfo(largeFixture).Length,bars=113,result="PASS"}));
        }
        await Task.Delay(1200);await Web.CoreWebView2.ExecuteScriptAsync("document.getElementById('preset').value='赤影战士';document.getElementById('preset').dispatchEvent(new Event('change'));true;");
        using(var stream=File.Create(Path.Combine(outDir,"桌面界面.png")))await Web.CoreWebView2.CapturePreviewAsync(CoreWebView2CapturePreviewImageFormat.Png,stream);
        await Web.CoreWebView2.ExecuteScriptAsync("document.getElementById('piano-panel').scrollIntoView({block:'end'});true;");await Task.Delay(300);
        using(var stream=File.Create(Path.Combine(outDir,"旋律编辑.png")))await Web.CoreWebView2.CapturePreviewAsync(CoreWebView2CapturePreviewImageFormat.Png,stream);
        await Web.CoreWebView2.ExecuteScriptAsync("scrollTo(0,0);true;");
        await Web.CoreWebView2.ExecuteScriptAsync("document.getElementById('save').click();document.getElementById('export').click();true;");for(var attempt=0;attempt<1500;attempt++){await Task.Delay(200);if(await Web.CoreWebView2.ExecuteScriptAsync("!!window.lastExportStats")=="true")break;}
        if(await Web.CoreWebView2.ExecuteScriptAsync("!!window.lastExportStats")!="true")throw new IOException("WAV导出未在300秒内完成。");await Task.Delay(700);
        await Web.CoreWebView2.ExecuteScriptAsync("window.OP16.engine.stop();window.OP16.engine.start();true;");await Task.Delay(1300);
        var before=await Web.CoreWebView2.ExecuteScriptAsync("window.OP16.stats()");
        WindowState=WindowState.Minimized;await Task.Delay(200);var hiddenStart=await Web.CoreWebView2.ExecuteScriptAsync("window.OP16.stats()");await Task.Delay(3300);var background=await Web.CoreWebView2.ExecuteScriptAsync("window.OP16.stats()");WindowState=WindowState.Normal;
        await Web.CoreWebView2.ExecuteScriptAsync("window.OP16.engine.stop();true;");
        var result=await Web.CoreWebView2.ExecuteScriptAsync("({title:document.title,bridge:!!window.chrome.webview,canvas:document.querySelectorAll('canvas').length,steps:document.querySelectorAll('[data-step]').length,stats:window.OP16.stats(),layout:{legendInInstrument:!!document.querySelector('.instrument .layer-legend'),toolsInPhrase:!!document.querySelector('.phrase-main #copy'),presetCount:document.querySelector('#preset').options.length,layers:window.OP16.device.stats.layers},linkCheck:(()=>{const d=window.OP16.device,p=window.OP16.getProject();d.update(p,0);const start=structuredClone(d.stats);d.update(p,383);const end=structuredClone(d.stats);p.display.keyboardTrack=5;p.display.keyboardOctave=2;d.update(p,0);const counter=structuredClone(d.stats);d.update(window.OP16.getProject(),-1);return {start,end,counter};})(),exportStats:window.lastExportStats,exportButton:document.getElementById('export').textContent,toast:document.getElementById('toast').textContent,project:window.OP16.getProject(),viewport:{width:innerWidth,height:innerHeight},scrollWidth:document.documentElement.scrollWidth})");
        File.WriteAllText(Path.Combine(outDir,"桌面冒烟.json"),JsonSerializer.Serialize(new{before=JsonDocument.Parse(before).RootElement.Clone(),hiddenStart=JsonDocument.Parse(hiddenStart).RootElement.Clone(),background=JsonDocument.Parse(background).RootElement.Clone(),result=JsonDocument.Parse(result).RootElement.Clone(),window=new{Width,Height,workWidth=SystemParameters.WorkArea.Width,workHeight=SystemParameters.WorkArea.Height,zoom=Web.ZoomFactor}}));
      }catch(Exception ex){File.WriteAllText(Path.Combine(AppContext.BaseDirectory,"桌面验收错误.txt"),ex.ToString());}finally{Close();}
    }
}

