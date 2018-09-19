```typescript
npm i --save @ngrx/core@5.2.0 @ngrx/store@5.2.0 @ngrx/router-store@5.2.0 @ngrx/effects@5.2.0 @ngrx/store-devtools@5.2.0
npm install --save ngrx-store-freeze
npm i --save reselect
```

# 第1章 课程介绍
## 1-2 环境搭建

npm i --save 包名: 软件依赖

npm i --save-dev 包名: 开发依赖 ， 正式环境中不用的包

json-server: 用于快速搭建 REST API 的利器

    安装： npm install -g json-server
    使用 json-server ./mock/data.json

几种常见的API测试工具

    POSTMAN
    VSCode: REST Client
    使用### 将请求隔离开

cli安装错误

    npm uninstall -g @angular/cli
    npm cache clean
    npm instlal -g @angular/cli

# 第2章 用 Angular Material 组件打造页面

## 2-1 项目工程结构

    ng new taskmgr -si --style=scss
    ng g m core
    ng g m shared


        @SkipSelf() , 跳过本身检测

通常要这样写，`import {CoreModule} from './core/core.module';`

但是改成 将core.module改成index.ts就只写 

    import {CoreModule} from './core';

就行了，省了很多路径

## 2-2 UI整体布局

    ng g c core/header --spec=false

报错，导出前只能在coremodule使用，

    app-header' is not a known element: ，

在core.module添加
  
    exports: [HeaderComponent, FooterComponent, SidebarComponent]

本课使用flex的方式来设置css。

flex 是对容器内的排布。只对直接子元素有用。

```css

.site {
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
  /*flex 参数3个 是否能放大放大几倍 0不能缩小 auto极限宽度*/

  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  /*横轴方向排列*/
  /*justify-content: flex-start;*/
  /*justify-content: flex-end;*/
  /*justify-content: space-around;*/
  justify-content: space-between;

  /*纵轴方向排列*/
  align-content: flex-end;
  /*default*/
  /*align-content: stretch;*/

  /*一行中怎样对齐*/
  align-items: center;
}

others {
    /*横轴方向排列*/
    justify-content: flex-start 左对齐,
    justify-content: flex-end 右对齐,
    justify-content: center 居中,
    justify-content: space-between 分散对齐,
    justify-content: space-around 项目位于各行之前、之间、之后都留有空白的容器内,
    纵轴方向排列
    align-content: stretch 充满屏幕,
    align-content: center 居中,
    align-content: flex-start 顶部对齐,
    align-content: flex-end 底部对齐,
    align-content: baseline    元素放置在父元素的基线上。,
}
```

## 2-3 Material介绍

https://material.angular.io/

https://material.io/

http://materialdesignblog.com/

什么场景适合采用官方的组件库？

* 团队没有能力制作统一的UI风格时.考虑使用.

* 优点:兼容性好，可扩展性好，可测试性好，对主题的支持好.

* 缺点：目前组件仍不算丰富，只有 Material 风格

SideNav

    npm i --save @angular/material
    npm i --save @angular/material @angular/cdk

Q: Could not find Angular Material core theme. Most Material components may not work as expected. For more info refer to the theming guide:
A: 引入主题css文件中 @import "~@angular/material/prebuilt-themes/deeppurple-amber.css";

    <mat-sidenav #sidenav mode="over" align="end">

一个container中可以有2个sidenav , align= start , 左边, end 右边

    <mat-toolbar color="primary"></mat-toolbar>
    <mat-toolbar color="accent"></mat-toolbar>

主色，配色  accent 指配色

## SideNav 

1. 用途：侧边栏导航，同时可以作为容器
2. 侧滑的三种模式： over, push , side
3. 一般的 <md-sidenav-container> 联合使用

## Toolbar

1. 用途: 一般用于头部、标题栏
2. 通过 <md-toolbar-row> 支持多行
3. 默认内部布局是基于flex的

        在coremodule 引入MatToolbarModule
        在appmodule import MatSidenavModule

header 并不知道 sidebar在哪儿 所以用output与根组件交互数据~

```typescript
header.ts
@Output() toggle = new EventEmitter<void>();
app.component.html
<app-header (toggle)="sidenav1.toggle()"></app-header>
```

## 2-4 MdIcon 组件

appModule 中导入 MatIconModule , header.html

    <mat-icon svgIcon="gifts"></mat-icon>

mat-icon 无损缩放，基于字体的

    使用图标字体，内建 material icon 支持
    支持 svg : 通过注入 mdiconRegistry 和 DomSanitizer

```typescript
this.addSvgIcon('project', this.sanitizer.bypassSecurityTrustResourceUrl('assets/img/sidebar/project.svg'));
```


报错找不到 HttpProvider，在appmodule中导入 HttpClientModule

* 避免重复加载，创建utils/svg.utils.ts 

```typescript
export const loadSvgResources = (ir: MatIconRegistry, ds: DomSanitizer) => {
  ir.addSvgIcon('gifts', ds.bypassSecurityTrustResourceUrl('assets/gifts.svg'));
}
```

避免在header使用时还是要导入，麻烦。我们在coremodule中导入。


```typescript
export class CoreModule {
  constructor(
    @Optional() @SkipSelf() parent: CoreModule,
    ir: MatIconRegistry,
    ds: DomSanitizer) {
    if (parent) {
      throw new Error('模块已存在，不能再次加载!');
    }
    loadSvgResources(ir, ds);
  }
}
```

## 2-5 Input 组件

__Install Component__

```typescript
ng g m login
ng g c login/login
```

Routing

```typescript
login-routing.module.ts
const routes: Routes = [{path: 'login', component: LoginComponent}, ];

app-rouing.module.ts
{path: '', redirectTo: '/login', pathMatch: 'full'},
full--如果 login后面什么都不放就导航到 login

```

HTML 

```html
# app.component.html
    <main> <router-outlet></router-outlet> </main>

#login.compoennt.html
<mat-card>
  <mat-card-header>
    <mat-card-title>登录</mat-card-title>
  </mat-card-header>

  <mat-card-content>
    <mat-input-container>
      <span matPrefix="">wang</span>
      <input matInput type="text" placeholder="您的email">
      <span matSuffix>@gmail.com</span>
      <mat-hint></mat-hint>
      <mat-label></mat-label>
    </mat-input-container>
  </mat-card-content>

  <mat-card-actions>
    <p>还没有账户?<a href="">注册</a></p>
    <p>忘记密码?<a href="">找回</a></p>
  </mat-card-actions>
</mat-card>

color accent
mat-input-container
    floatPlaceholder float 默认
    floatPlaceholder always 一直在动画
    floatPlaceholder never 一直在动画
hintLabel="必填项" 输入框下面有提示
```

Input

    指令: mdInput 在 <md-input-container> 内部，有前缀后缀
    <md-error> : 只能验证不通过时才出现，对两种类型表单都是如此
    <md-hint> : 当error显示时, hint 会隐藏

模块增多后，尽量放在sharedModule

```typescript
# login.module
imports: [SharedModule, LoginRoutingModule]
# core.module
imports: [HttpClientModule, SharedModule, BrowserAnimationsModule, ]
# app.module
imports: [BrowserModule, SharedModule, CoreModule, LoginModule, AppRoutingModule, ]
```

## 2-6 Card 和 Button 组件

__card __ 适合图文形式突出某一主题

```typescript
  <mat-card>
    <mat-card-header>
      <mat-card-title>每日佳句</mat-card-title>
      <mat-card-subtitle>{{quote.cn}}</mat-card-subtitle>
    </mat-card-header>
    <img mat-card-xl-image src="/assets/quote_fallback.jpg" alt="">
    <mat-card-content>
      {{quote.en}}
    </mat-card-content>
  </mat-card>

```

__Button__

md-button 是以指令形式提供的
标准按钮: md-button, md-raised-button, md-icon-button
浮动按钮: md-fab, md-fab-mini

不指明 type 默认为submit, 指定为type=button

    <button mat-raised-button type="button">登录</button>

mat-类型|效果
---|---
mat-raised-button | 浮起的效果
mat-fab-button  | 圆形效果
mat-mini-fab    | 更小的圆形效果

容器充满，用户、密码竖排，并将忘记密码放在 右侧
```css
# login.component.css
mat-card{
  height: 20em;
  flex: 0 0 20em;
}

form {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}

.text-right {
  margin: 10px;
  text-align: end;
}

# style.css
.full-width {
  width: 100%;
}
```


    <img mat-card-xl-image src="/assets/quote_fallback.jpg" alt="">

## 2-7 在侧滑菜单中使用 MdList

__List__

* 用户：一般用于列表
* `<mat-list>`和`<mat-nav-list>`

List item 默认样式 `align:center,flex:row`

使 list item 顶部对齐 

    mat-icon {align-self: flex-start; }

压缩列表.间距变小 `<mat-nav-list dense>`

日视图变成当天的日期

添加31天的日图标，使当日图标自动改变

```typescript
# svg.utils.ts
const days = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11,
  12, 13, 14, 15, 16, 17, 18, 19, 20,
  21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31];
days.forEach(d => ir.addSvgIcon(`day${d}`, ds.bypassSecurityTrustResourceUrl(`${dayDir}/day${d}.svg`)));

# sidebar.component.ts
today = 'day';
ngOnInit() {
  this.today = `day${getDate(new Date())}`;
}

# sidebar.component.html
<mat-icon mat-list-icon [svgIcon]="today"></mat-icon>
```

添加类库
```bash
npm install --save date-fns
npm install --save-dev @types/date-fns
```

## 2-8 Angular Material 主题

主题： 调色板+明暗+叠加
$my-app-accent: mat-palette($mat-pink,A200, A100, A400);
默认深浅，亮的主题，暗的主题亮度，
```typescript

# header.component.html
<span class="fill-remaining-space"></span>
<mat-slide-toggle (change)="onChange($event.checked)">默认模式</mat-slide-toggle>

# shared.module.ts
MatSlideToggleModule

# app.component.css
mat-sidenav-container.myapp-dark-theme {
  background-color: black;
}

# app.component.html
<app-header (toggle)="sidenav1.toggle()" (toggleDarkTheme)="switchTheme($event)"></app-header>
<mat-sidenav-container [class.myapp-dark-theme]="darkTheme">
  <mat-sidenav #sidenav1 mode="over">
    <app-sidebar></app-sidebar>
  </mat-sidenav>

# app.component.html
      <app-header (toggle)="sidenav1.toggle()" (toggleDarkTheme)="switchTheme($event)"></app-header>

# app.component.ts
darkTheme = false;
switchTheme(dark) {
  this.darkTheme = dark;
}

```

```scss
# styles.scss
@import "theme.scss";

# theme.scss
@import "~@angular/material/theming";

@include mat-core()

$my-app-primary: mat-palette($mat-indigo);
$my-app-accent: mat-palette($mat-pink,A200, A100, A400);
$my-app-warn: mat-palette($mat-red);

$my-app-theme: mat-light-theme($my-app-primary, $my-app-accent,$my-app-warn);

@include angular-material-theme($my-app-theme)

$my-dark-primary: mat-palette($mat-blue-gray);
$my-dark-accent: mat-palette($mat-amber,A200, A100, A400);
$my-dark-warn: mat-palette($mat-orange);

$my-dark-theme: mat-dark-theme($my-dark-primary, $my-dark-accent,$my-dark-warn);

.myapp-dark-theme {
  @include angular-material-theme($my-dark-theme)
}
```
## 2-9 GridList 打造注册页面头像列表

* GridList

用途：用于相似的数据展示，尤其是图片，类似相册。

行为很像表格，有colspan,rolspan等属性。

    ng g c login/register --spec=false

* mat-grid-list 属性

 rowHeight="34px"或1,colspan,rowspan

* map() 对每个元素处理返回新的元素

* svg图标集合使用方法： name:svg-${id}

```typescript
# SharedModule
MatGridListModule,

# svg.utils.ts
ir.addSvgIconSetInNamespace('avatars', ds.bypassSecurityTrustResourceUrl(`${avatarDir}/avatars.svg`));

# login-routing.module.ts
{path: 'register', component: RegisterComponent},
```

```html
# register.component.html
<mat-grid-list [cols]="6" rowHeight="2:1">
  <mat-grid-tile *ngFor="let item of items">
    <mat-icon class="avatar" [svgIcon]="item"></mat-icon>
  </mat-grid-tile>
</mat-grid-list>
```

## 2-10 对话框的使用

* 对话框很特殊，需要在模块中的 entrryComponents中声明
* 传递数据： const dialogRef = dialog.open(YourDialog, {data:'your data'})
* 接收数据： constructor(@Inject(MD_DIALOG_DATA) public data:any) {}

```typescript
ng g m project
ng g c project/project-list --spec=false
ng g c project/project-item --spec=false
ng g c project/new-project --spec=false
ng g c project/invite --spec=false

# project.module.ts
  declarations: [
    ProjectListComponent,
    ProjectItemComponent,
    NewProjectComponent,
    InviteComponent
  ],
  entryComponents: [
    NewProjectComponent,
    InviteComponent
  ],

# ProjectListComponent
export class ProjectListComponent implements OnInit {
  projects = [
    {'name': 'itemMame-1', 'desc': 'this is a ent project', 'coverImg': 'assets/img/covers/0.jpg'},
    {'name': 'Auto test', 'desc': 'this is a ent project', 'coverImg': 'assets/img/covers/1.jpg'} ];

  constructor(private dialog: MatDialog) {}
  ngOnInit() {}

  openNewProjectDialog() {
    const config = {width: '100px', height: '100px', position: {left: '0', top: '0'}};
    const data = {data: {dark: true}};
    const dialogRef = this.dialog.open(NewProjectComponent, data);
    dialogRef.afterClosed().subscribe(result => console.log(result));
  }
}

```

```html
# ProjectListComponent html
<app-project-item *ngFor="let project of projects"
  [item]="project"
  class="card">

</app-project-item>

<button class="fab-button" mat-fab type="button" (click)="openNewProjectDialog()">
  <mat-icon>add</mat-icon>
</button>

# project-item.component.html

<mat-card>
  <mat-card-header>
    <mat-card-title>
      {{item.name}}
    </mat-card-title>
  </mat-card-header>
  <img mat-card-image [src]="item.coverImg" alt="项目封面">
  <mat-card-content>
    {{item.desc}}
  </mat-card-content>
  <mat-card-actions>
    <button mat-button type="button">
      <mat-icon>note</mat-icon>
      <span>编辑</span>
    </button>
    <button mat-button type="button">
      <mat-icon>group_add</mat-icon>
      <span>邀请</span>
    </button>
    <button mat-button type="button">
      <mat-icon>delete</mat-icon>
      <span>删除</span>
    </button>
  </mat-card-actions>
</mat-card>
```

```typescript
# project-item.component.ts
export class ProjectItemComponent implements OnInit {
  @Input() item;
```

```html
# new-project.component.html

<form >
  <h2 mat-dialog-title>新建项目</h2>
  <div mat-dialog-content>
    <mat-input-container class="full-width">
      <input matInput type="text" placeholder="项目名称">
    </mat-input-container>
    <mat-input-container class="full-width">
      <input matInput type="text" placeholder="项目描述">
    </mat-input-container>
    <div mat-dialog-actions>
      <button type="button" mat-raised-button color="primary" (click)="onClick()">保存</button>
      <button type="button" mat-button mat-dialog-close>关闭</button>
    </div>
  </div>
</form>
```


```typescript
# new-project.component.ts
  constructor(@Inject(MAT_DIALOG_DATA) private data,
              private dialogRef: MatDialogRef<NewProjectComponent>,
              // private oc: OverlayContainer
  ) {
  }

  ngOnInit() {
    console.log(JSON.stringify(this.data));
    // this.oc.themeClass = this.data.dark ? 'myapp-dark-theme' : null;
  }

  onClick() {
    this.dialogRef.close('I received your message');
  }
}
```

```css
# project-list.component.css
.card {
  height: 360px;
  flex: 0 0 360px;
  margin: 10px;
}

:host {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
}

.fab-button {
  position: fixed;
  right: 32px;
  bottom: 96px;
  z-index: 998;
}
```


## 2-11 Autocomplete 的使用

要和 input 联合使用。

```typescript
<mat-form-field>
  <input type="text" matInput [formControl]="myControl" [matAutocomplete]="auto">
</mat-form-field>

<mat-autocomplete #auto="matAutocomplete">
  <mat-option *ngFor="let option of options" [value]="option">
    {{ option }}
  </mat-option>
</mat-autocomplete>

```

实例代码

```typescript
# shared.module.ts
  imports: [MatAutocompleteModule, ],
  exports: [MatAutocompleteModule, ],

# project-list.component.html
<app-project-item *ngFor="let project of projects"
  [item]="project" class="card" (onInvite)="launchInviteDialog()">

# project-list.component.ts
  launchInviteDialog() {const dialogRef = this.dialog.open(InviteComponent); }

# project-item.component.ts
  @Output() onInvite = new EventEmitter();

  onInviteClick() {this.onInvite.emit(); }

# project-item.component.html
    <button mat-button type="button" (click)="onInviteClick()">

# invite.component.html
<form >
  <h2 mat-dialog-title>邀请组员</h2>
  <div mat-dialog-content>
    <mat-input-container class="full-width">
      <input matInput type="text" placeholder="组员姓名" [matAutocomplete]="autoMembers">
    </mat-input-container>
    <div mat-dialog-actions>
      <button type="button" mat-raised-button color="primary" (click)="onClick()">保存</button>
      <button type="button" mat-button mat-dialog-close>关闭</button>
    </div>
  </div>
</form>

<mat-autocomplete #autoMembers="matAutocomplete" [displayWith]="displayUser">
  <mat-option *ngFor="let item of items" [value]="item">
    {{item.name}}
  </mat-option>
</mat-autocomplete>

# invite.component.ts
export class InviteComponent implements OnInit {
  items = [
    {id: 1, name: 'name-1'},
    {id: 2, name: 'name-2'},
    {id: 3, name: 'name-3'}
  ];

  displayUser(user: { id: string, name: string }) {
    return user ? user.name : '';
  }
}
```

[displayWith]="displayUser"> 而不是  displayUser()

* 表示传入的是函数不是函数的返回结果

## 2-12 任务列表之菜单

```typescript
ng g m task
ng g c task/task-home --spec=false
ng g c task/task-list --spec=false
ng g c task/task-item --spec=false
ng g c task/task-header --spec=false
```


* 将 OverlayContainer 注入到 AppComponent比较方便

```typescript
# app.component.ts
  constructor(private oc: OverlayContainer) { }

  switchTheme(dark) {
    this.darkTheme = dark;
    // this.oc.themeClass = this.data.dark ? 'myapp-dark-theme' : null;
  }

# app-routing.module.ts
    {path: 'tasklists', redirectTo: '/tasklists', pathMatch: 'full'},

# svg.utils.ts
  const iconDir = `${imgDir}/icons`;
  ir.addSvgIcon('move', ds.bypassSecurityTrustResourceUrl(`${iconDir}/move.svg`));
  ir.addSvgIcon('add', ds.bypassSecurityTrustResourceUrl(`${iconDir}/add.svg`));
  ir.addSvgIcon('delete', ds.bypassSecurityTrustResourceUrl(`${iconDir}/delete.svg`));

# task-header.component.css
.fill {
  flex: 1;
  text-align: center;
}

.header-container {
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: 100%;
}

# task-header.component.html
<div mat-subheader class="header-container">
  <div>
    <h3>{{header}}</h3>
  </div>
  <div class="fill">
    <button mat-button>
      <mat-icon>add_circle_outline</mat-icon>
      <span>新任务</span>
    </button>
  </div>
  <div>
    <button mat-icon-button [matMenuTriggerFor]="menu">
      <mat-icon>keyboard_arrow_down</mat-icon>
    </button>
  </div>
</div>

<mat-menu #menu="matMenu">
  <button mat-menu-item>
    <mat-icon>mode_edit</mat-icon>
    <span>修改列表名称</span>
  </button>
  <button mat-menu-item>
    <mat-icon [svgIcon]="'move'"></mat-icon>
    <span>移动本列表所有内容</span>
  </button>
  <button mat-menu-item>
    <mat-icon>delete_forever</mat-icon>
    <span>删除列表</span>
  </button>
</mat-menu>

# task-header.component.ts
  @Input() header = '';

# task-home.component.css
.fab-button {
  position: fixed;
  right: 32px;
  bottom: 96px;
  z-index: 998;
}

.task-lists {
  min-width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  overflow: scroll;
}

.list-container {
  flex: 0 0 360px;
  overflow-y: scroll;
  overflow-x: hidden;
}

# task-home.component.html
<div class="task-lists">
  <app-task-list *ngFor="let list of lists" class="list-container">
    <app-task-header [header]="list.name"></app-task-header>
    <app-task-item *ngFor="let task of list.tasks"></app-task-item>
  </app-task-list>
</div>

<button class="fab-button" mat-fab type="button">
  <mat-icon>add</mat-icon>
</button>

# task-home.component.ts
  lists = [
    {
      id: 1, name: '待办',
      tasks: [{id: 1, desc: '任务1：买咖啡', owner: {id: 1, name: '张三', avatar: 'avatars:svg-11'}, dueDate: new Date()}]
    },
   {
      id: 2, name: '进行中',
      tasks: [{id: 1, desc: '任务2：完成PPT', owner: {id: 1, name: '李四', avatar: 'avatars:svg-12'}, dueDate: new Date()}]
    },
  ];

# task-list.component.html
<mat-list>
  <ng-content></ng-content>
</mat-list>
```

## 2-13 任务列表之任务组件

几种和HTML对应组件非常像的 Material 组件：

* 复选框 `<mat-checkbox>`

* 单选组件 `<mat-radio>`

* 下拉框 `<mat-select>`

上节的下拉按钮对应的有点问题。添加上 line-height: 1.

`[ngClass] = {'class': expression}` , 表达式为true时，使用该类

```typescript
# task-header.component.css
.material-icon {line-height: 1; }

# task-header.component.html
    <mat-icon [svgIcon]="'move'" class="material-icon"></mat-icon>


# task-home.component.html
    <app-task-item *ngFor="let task of list.tasks" [item]="task"></app-task-item>

# task-home.component.ts
  lists = [
    {
      id: 1, name: '待办',
      tasks: [
        {id: 1, desc: '任务1：买咖啡', completed: true, priority: 3, owner: {id: 1, name: '张三', avatar: 'avatars:svg-11'}, dueDate: new Date()},
        {id: 2, desc: '任务4：我是一个非常非常长的任务', priority: 3, owner: {id: 1, name: '张三', avatar: 'avatars:svg-11'}, dueDate: new Date()}
        ]
    },
   {
      id: 2, name: '进行中',
      tasks: [
        {id: 1, desc: '任务2：完成PPT', completed: false, priority: 2, owner: {id: 1, name: '李四', avatar: 'avatars:svg-12'}, dueDate: new Date(), reminder: new Date()},
        {id: 2, desc: '任务3：task-3', completed: false, priority: 1, owner: {id: 1, name: '王五', avatar: 'avatars:svg-13'}, dueDate: new Date()}
        ]
    },
  ];

# task-item.component.css

mat-icon.avatar {
  overflow: hidden;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin: 12px;
  order: 3;
}

.priority-normal {border-left: 3px solid #a6a6a6; }
.priority-important {border-left: 3px solid #ffaf38; }
.priority-emergency {border-left: 3px solid red; }
.completed {
  opacity: 0.64;
  color: #d9d9d9;
  text-decoration: line-through;
}

.completion-status {order: -1; }
.due-date {
  background-color: #ff4f3e;
  color: #fff;
}

.alarm {font-size: 18px; }
.bottom-bar {
  margin-top: 3px;
  margin-bottom: 2px;
  font-size: 10px;
  width: 100%;
  order: 1;
}

.content {
  order: 1;
  width: 100%;
  padding: 5px;
}

.container {
  width: 100%;
  border-radius: 3px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

:host {width: 100%; }

# task-item.component.html
<mat-list-item class="container"
               [ngClass]="{
               'priority-normal': item.priority === 3,
               'priority-important': item.priority === 2,
               'priority-emergency': item.priority === 1
               }">
  <mat-checkbox class="completion-status" [checked]="item.completed"></mat-checkbox>
  <div mat-line class="content" [ngClass]="{'completed': item.completed}"><span [matTooltip]="item.desc">{{item.desc}}</span></div>
  <div mat-line class="bottom-bar" *ngIf="item.dueDate">
    <span class="due-date">{{item.dueDate | date:'yy-MM-dd'}}</span>
    <mat-icon *ngIf="item.reminder">alarm</mat-icon>
  </div>
  <mat-icon [svgIcon]="avatar" mat-list-avatar class="avatar"></mat-icon>
</mat-list-item>

# task-item.component.ts
  @Input() item;
  @Input() avatar;
  constructor() { }

  ngOnInit() {this.avatar = this.item.owner ? this.item.owner.avatar : 'unassigned'; }
```

## 2-14 任务列表之新任务对话框
ng g c task/new-task --spec=false

matSuffix 当成后缀使用。

SharedModule中需要引入     MatRadioModule, MatNativeDateModule, MatDatepickerModule,

    MatDatepickerModule 需要引入MatNativeDateModule 进行一些序列化

```typescript

# new-task.component.html
<form >
  <h2 mat-dialog-title>新建任务</h2>
  <div mat-dialog-content>
    <mat-input-container class="full-width">
      <input matInput type="text" placeholder="任务内容">
    </mat-input-container>
    <mat-radio-group>
      <mat-radio-button *ngFor="let priority of priorities" [value]="priority.value">
        {{priority.label}}
      </mat-radio-button>
    </mat-radio-group>
    <mat-input-container class="full-width">
      <input matInput [matDatepicker]="dueDatepicker" type="text" placeholder="任务截止日期">
      <!--<button type="button" matSuffix [matDatepickerToggle]="dueDatepicker"></button>-->
      <mat-datepicker-toggle matSuffix [for]="dueDatepicker"></mat-datepicker-toggle>
    </mat-input-container>
    <mat-datepicker #dueDatepicker></mat-datepicker>

    <mat-input-container class="full-width">
      <input matInput [matDatepicker]="reminderDatepicker" type="text" placeholder="提醒日期">
      <mat-datepicker-toggle matSuffix [for]="reminderDatepicker"></mat-datepicker-toggle>
    </mat-input-container>
    <mat-datepicker #reminderDatepicker></mat-datepicker>

    <div mat-dialog-actions>
      <button type="button" mat-raised-button color="primary" (click)="onClick()">保存</button>
      <button type="button" mat-button mat-dialog-close>关闭</button>
    </div>
  </div>
</form>

# new-task.component.ts
export class NewTaskComponent implements OnInit {
  priorities = [
    {label: '紧急', value: '1', },
    {label: '重要', value: '2', },
    {label: '普通', value: '3', },
 ];
}

# task-header.component.html
    <button mat-button type="button" (click)="onNewTaskClick()">

# task-header.component.ts
  @Output() newTask = new EventEmitter<void>();
  onNewTaskClick() {this.newTask.emit(); }

# task-home.component.html
    <app-task-header [header]="list.name" (newTask)="launchNewTaskDialog()"></app-task-header>
# task-home.component.ts

```
## 2-15 任务列表之移动内容对话框

ng g c task/copy-task --spec=false

```typescript
# copy-task.component.html
<form>
  <h3 mat-dialog-title>移动本列表所有内容</h3>
  <div mat-dialog-content>
    <mat-select placeholder="请所有目标列表">
      <mat-option *ngFor="let list of lists">{{list.name}}</mat-option>
    </mat-select>
  </div>
  <mat-dialog-actions>
    <button type="button" mat-raised-button color="primary" (click)="onClick()">保存</button>
    <button type="button" mat-button [mat-dialog-close]>关闭</button>
  </mat-dialog-actions>
</form>

# copy-task.component.ts
export class CopyTaskComponent implements OnInit {
  lists: any[];
  constructor(@Inject(MAT_DIALOG_DATA) private data,
              private dialogRef: MatDialogRef<CopyTaskComponent> ) {}
  ngOnInit() {this.lists = this.data.lists; }
}

# task-header.component.html
  <button mat-menu-item (click)="onMoveAllClick()">

# task-header.component.ts
  @Output() moveAll = new EventEmitter<void>();
  onMoveAllClick() {this.moveAll.emit(); }

# task-home.component.html
    <app-task-header [header]="list.name"
                     (newTask)="launchNewTaskDialog()"
                     (moveAll)="launchCopyTaskDialog()"></app-task-header>

# task-home.component.ts
  launchCopyTaskDialog() {
    const dialogRef = this.dialog.open(CopyTaskComponent, {width: '250px', data: {lists: this.lists}});
  }


```

## 2-16 完成主框架
完成下拉列表的几个按钮, 修改任务的 Dialog。

task-item.component.html 中点击 Checkbox 也会弹出修改任务的对话框。怎样处理？

```typescript
  onCheckBoxClick(ev: Event) {ev.stopPropagation(); }
```

同样 projects 添加/编辑是一样的一个组件。

删除列表按钮 -- 一个确认的对话框。比较通用建立在SharedModule中。

完成修改列表名称，添加新列表。

* __Cli 参数__

it=--inline-template

is=--inline-style

* 控制台： Could not find HammerJS

Material 组件 移动端会用 HammerJS。

```typescript
npm install --save hammerjs
# core.module.ts
import 'hammerjs';
```

* Coding:

```typescript
$ ng g c shared/confirm-dialog -it -is --spec=false
$ ng g c task/new-task-list --spec=false

# new-project.component.html
  <h3 mat-dialog-title>{{title}}</h3>

# new-project.component.ts
  title = '';
  ngOnInit() {this.title = this.data.title; }

# project-item.component.html
    <button mat-button type="button" (click)="onEditClick()">
    <button mat-button type="button" (click)="onDelClick()">

# project-item.component.ts
  @Output() onEdit = new EventEmitter();
  @Output() onDel = new EventEmitter();
  onEditClick() {this.onEdit.emit(); }
  onDelClick() {this.onDel.emit(); }

# project-list.component.html
  (onEdit)="launcherUpdateDialog()"
  (onDel)="launcheConfirmDialog()"

# project-list.component.ts
  launcherUpdateDialog() {const dialogRef = this.dialog.open(NewProjectComponent, {data: {title: '编辑项目:'}}); }

  launcheConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: {title: '删除项目:', content: '您确认删除该项目么'}});
    dialogRef.afterClosed().subscribe(result => console.log(result));
  }

# confirm-dialog.component.ts
@Component({
  selector: 'app-confirm-dialog',
  template: `
    <h3 mat-dialog-title>{{title}}</h3>
    <mat-dialog-content>
      {{content}}
    </mat-dialog-content>
    <mat-dialog-actions>
      <button type="button" mat-raised-button color="primary" (click)="onClick(true)">确定</button>
      <button type="button" mat-button [mat-dialog-close] (click)="onClick(false)">取消</button>
    </mat-dialog-actions>
  `,
  styles: []
})
export class ConfirmDialogComponent implements OnInit {
  title = ''; content = '';
  constructor(@Inject(MAT_DIALOG_DATA) private data, private dialogRef: MatDialogRef<ConfirmDialogComponent>) { }
  ngOnInit() {this.title = this.data.title; this.content = this.data.content; }
  onClick(result: boolean) {this.dialogRef.close(result); }
}

# shared.module.ts
  entryComponents: [ConfirmDialogComponent],

# new-task-list.component.html
<form>
  <h3 mat-dialog-title>{{title}}</h3>
  <mat-dialog-content>
    <mat-input-container class="full-width">
      <input type="text" matInput placeholder="列表名称">
    </mat-input-container>
  </mat-dialog-content>
  <mat-dialog-actions>
    <button type="button" mat-raised-button color="primary" (click)="onClick()">保存</button>
    <button type="button" mat-button [mat-dialog-close]>关闭</button>
  </mat-dialog-actions>
</form>

# new-task-list.component.ts
  title = '';

  constructor(@Inject(MAT_DIALOG_DATA) private data,
              private dialogRef: MatDialogRef<NewTaskListComponent>) {
  }

  ngOnInit() {this.title = this.data.title; }

  onClick() {this.dialogRef.close(this.title); }

# task-home.component.html
                     (moveAll)="launchCopyTaskDialog()"
                     (delList)="launchConfirmDialog()"
                     (editList)="launchEditListDialog()"
    ></app-task-header>
    <app-task-item *ngFor="let task of list.tasks" [item]="task" (taskClick)="launchUpdateTaskDialog(task)"></app-task-item>
  </app-task-list>
</div>

<button class="fab-button" mat-fab type="button" (click)="launchNewListDialog()">

# task-home.component.ts
  launchUpdateTaskDialog(task) {
    const dialogRef = this.dialog.open(NewTaskComponent, {width: '250px', data: {title: '修改任务:', task: task}});
  }

  launchConfirmDialog() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: {title: '删除任务列表:', content: '您确认删除该列表么'}});
    dialogRef.afterClosed().subscribe(result => console.log(result));
  }

  launchEditListDialog() {
    const dialogRef = this.dialog.open(NewTaskListComponent, {data: {title: '更改列表名称:'}});
    dialogRef.afterClosed().subscribe(result => console.log(result));
  }

  launchNewListDialog() {
    const dialogRef = this.dialog.open(NewTaskListComponent, {data: {title: '新建列表:'}});
    dialogRef.afterClosed().subscribe(result => console.log(result));
  }

新增，修改删除 添加对应的控制。

```

# 第3章 Angular 动画
## 3-1 初识 Angular Animation

为了减少Core体积, animation 不再放到核心库，但也很重要。

https://www.w3.org/TR/web-animations-1/

State 和 Transition

* 动画其实就是从一个状态过渡到另一个状态

* 状态本身包含形状、颜色、大小等等

* State 就是定义状态而 Transitoin 是定义如何过渡 


Animate 函数

* Animate 规定了具体怎样过渡，比如时间、过渡的速度等

* animate 有多个重载形式


0.2秒的动画，延时一秒执行。
        transition('green => red', animate('.2s 1s')), 
        transition('green => red', animate('<持续时间> <延时时间>')), 

加载BrowserAnimationsModule尽量放在最后。

    trigger('square', 名称在响应的html中 [@触发器名字]
=组件当中的成员变量或才函数

```typescript
npm i --save @angular/animations

# html
      <div class="square" [@square]="squareState" (click)="onClick()"></div>
# ts
@Component 中 添加
  animations: [
    trigger('square', [
        state('green', style({backgroundColor: 'green', height: '100px', transform: 'translateX(0)' })),
        state('red', style({backgroundColor: 'red', height: '50px', transform: 'translateX(100%)' })),
        transition('green => red', animate('.2s 1s')),
        transition('red => green', animate(1000)),
      ]
    )
  ]
class 中添加
  onClick() {this.squareState = this.squareState === 'red' ? 'green' : 'red'; }

# app.module.ts 
最后引入BrowserAnimationsModule
```

## 3-2 缓动函数和关键帧 

__缓动函数__

* 缓动函数指定动画效果在执行时的速度，使其看起来更加真实。

* 当皮球下落时，先是越掉越快，撞到地上后回弹最终才又碰触到地板。

ease-in 开始慢，后边快， ease-out 相反

ease实际是使用了 cubic-bezier(0.86, 0, 0.07, 1); 调整它的4个参数可得到相应效果，用网站进行查看。

easings.net cubic-bezier.com

__关键帧__

* W3C的 Web Animation 标准暂时无法支持所有的 cubic-bezier 函数

* 帧 - 就是动画中的最小单位影像画面

* 关键帧 - 物体运动或变化中的关键动作所处的那一帧


```typescript

  animations: [
    trigger('square', [
        state('green', style({backgroundColor: 'green', height: '100px', transform: 'translateY(-100%)' })),
        state('red', style({backgroundColor: 'red', height: '100px', transform: 'translateY(100%)' })),
        transition('green => red', animate('.8s cubic-bezier(0.68, -0.55, 0.265, 1.55)')),
        transition('red => green', animate(5000, keyframes([
          style({transform: 'translateY(100%)'}),
          style({transform: 'translateY(98%)'}),
          style({transform: 'translateY(95%)'}),
          style({transform: 'translateY(90%)'}),
          style({transform: 'translateY(80%)'}),
          style({transform: 'translateY(60%)'}),
          style({transform: 'translateY(30%)'}),
          style({transform: 'translateY(0%)'}),
          style({transform: 'translateY(-10%)'}),
          style({transform: 'translateY(-5%)'}),
          style({transform: 'translateY(-2%)'}),
          style({transform: 'translateY(0)'}),
          style({transform: 'translateY(10%)'}),
          style({transform: 'translateY(15%)'}),
          style({transform: 'translateY(-15%)'}),
          style({transform: 'translateY(-40%)'}),
          style({transform: 'translateY(-80%)'}),
          style({transform: 'translateY(-90%)'}),
          style({transform: 'translateY(-95%)'}),
        ]))),
      ]
    )
  ]

```


## 3-3 项目卡片和任务动画

给动画新建一个文件夹 anims, projects 鼠标移入时放大，移出恢复。

borderShadow 或 'border-shadow'，有横线当不了key

@HostBinding('@card') cardState = 'out';  相当于写上　[@card]="cardState"

鼠标进入时，离开时过场动画

```typescript
@HostListener() 监听宿主事件的。
@HostListener('mouseenter')
@HostListener('mouseenter', ['$event.target'])
@HostListener('mouseleave')
```

task-item 中 list 不是绑定整个组件的动画，所以直接写不用 HostBinding。

将 tasklists 将表示优先级的边扩大动画

Code

```typescript
# project-item.component.ts
  animations: [cardAnim]

  @HostBinding('@card') cardState = 'out';

  @HostListener('mouseenter')
  onMouseEnter() {
    this.cardState = 'hover';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.cardState = 'out';
  }

#task-item.component.html
<mat-list-item class="container"
               [@item]="widerPriority"
               [ngClass]="{'priority-normal': item.priority === 3, 'priority-important': item.priority === 2, 'priority-emergency': item.priority === 1 }"

#task-item.component.ts
  animations: [itemAnim]

  widerPriority = 'in';

  @HostListener('mouseenter')
  onMouseEnter() {
    this.widerPriority = 'out';
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.widerPriority = 'in';
  }

# card.anim.ts
import {trigger, state, transition, style, animate} from '@angular/animations';

export const cardAnim = trigger('card', [
  state('out', style({transform: 'scale(1)', 'box-shadow': 'none'})),
  state('hover', style({transform: 'scale(1.1)', 'box-shadow': '3px 3px 5px 6px #ccc'})),
  transition('out => hover', animate('100ms ease-in')),
  transition('hover => out', animate('100ms ease-out'))
]);

# item.anim.ts
import {trigger, state, transition, style, animate, keyframes} from '@angular/animations';

export const itemAnim = trigger('item', [
  state('in', style({'border-left-width': '3px'})),
  state('out', style({'border-left-width': '8px'})),
  transition('out => in', animate('100ms ease-in')),
  transition('in => out', animate('100ms ease-out'))
])
```
## 3-4 路由动画及高阶动画函数

__实践__

* 路由动画需要在host元数据中指定触发器

* 动画注意不要过多，否则适得其反。

__Group__

* 用于同时进行一组的动画变换

* `[animate(...), animate(...)...]`

__Query & Stagger__

* Query 用于父节点寻找子节点

* Stagger 指定有多个满足 Query 的元素，每个动画之间有间隔

路由动画和普通动画一样，因为是整个切换，要用 HostBinding, `@HostBinding('@routeAnim') state`

position: 'fixed' 如果没有会上下串位置， flex容器让它居中会调整位置，所以要固定它。

    transition('void => *', === ':enter'
    transition('* => void', === ':leave'
    别名 :enter,:leave 是一样的

es6写法
      
    this.projects = [...this.projects, {key: value}];

stagger 分别动画出来的。如果没有stagger, 是一起动画出来的。搜索全部的子节点，规定它们的进场动画。也可以是查div。为了让他们有些间隔，所以把间隔时间做出来，后面跟动画。
```typescript
# list.anim.ts
export const listAnimation = trigger('listAnim', [
  transition('* => *', [
    query(':enter', style({opacity: 0}), { optional: true}),
    query(':enter', stagger(100, [
      animate('1s', style({opacity: 1}))
    ]), { optional: true}),
    query(':leave', style({opacity: 1}), { optional: true}),
    query(':leave', stagger(100, [
      animate('1s', style({opacity: 0}))
    ]), { optional: true}),
  ])
]);

# router.anim.ts
export const slideToRight = trigger('routeAnim', [
  state('void', style({position: 'fixed', width: '100%', height: '80%'})),
  state('*', style({position: 'fixed', width: '100%', height: '80%'})),
  transition(':enter', [
    style({transform: 'translateX(-100%)', opacity: 0}),
    group([
      animate('.5s ease-in-out', style({transform: 'translateX(0)'})),
      animate('.3s ease-in', style({opacity: 1})),
    ])
  ]),
  transition(':leave', [
    style({transform: 'translateX(0)', opacity: 1}),
    group([
      animate('.5s ease-in-out', style({transform: 'translateX(100%)'})),
      animate('.3s ease-in', style({opacity: 0})),
    ])
  ]),
]);

# sidebar.component.html 添加路由
  <mat-list-item [routerLink]="['/projects']" (click)="onNavClick()">
  <mat-list-item [routerLink]="['/tasklists']" (click)="onNavClick()">

# sidebar.component.ts 添加弹出事件
  @Output() navClick = new EventEmitter();
  onNavClick() {this.navClick.emit(); }

# project-list.component.css
:host 改为 .container

# project-list.component.html
<div class="container" [@listAnim]="projects.length">
  <app-project-item ... (onDel)="launcheConfirmDialog(project)"> </app-project-item>
</div>

# project-list.component.ts

  animations: [slideToRight, listAnimation]
  @HostBinding('@routeAnim') state;

  openNewProjectDialog() {...
    dialogRef.afterClosed().subscribe(result => {
      this.projects = [...this.projects,
        {id: 3, name: '一个新项目', desc: '这是一个新项目', coverImg: 'assets/img/covers/1.jpg'},
        {id: 4, name: '又一个新项目', desc: '这是又一个新项目', coverImg: 'assets/img/covers/0.jpg'},
        ];
    });
  }


  launcheConfirmDialog(project) {...
    dialogRef.afterClosed().subscribe(result => {
      console.log(result);
      this.projects = this.projects.filter(p => p.id !== project.id);
    });
  }

# task-home.component.ts
  animations: [slideToRight]
  @HostBinding('@routeAnim') state;
```

# 第4章 Angular 核心概念回顾和提高
## 4-1 依赖性注入

* 什么是依赖性注入？

* 依赖性注入框架

* 依赖性注入进阶

```typescript
令牌-构建-依赖
Injector->Provider->Object

class Id {
  static getInstance(type: string): Id {
    //设置
    return new Id();
  }
}

class Address {
  province: string;
  city: string;
  district: string;
  street: string;
  constructor(province, city, district, street) {
    this.province = province;
    this.city = city;
    this.district = district;
    this.street = street;
  }
}
class Person {
  id: Id;
  address: Address;

  constructor() {
    this.id = Id.getInstance('idcard');
    this.address = new Address('北京', '北京', '朝阳区', 'XX 街道')
  }
}
```

这样显性构造需要知道细节，如果重构怎么办？工厂方法等， 其他类都需要改，比较麻烦。

怎样处理？

```typescript
class Person {
  id: Id;
  address: Address;

  constructor(id: Id, address: Address) {
    this.id = Id;
    this.address = address;
  }
}

main() {
  const id = Id.getInstance('idcard');
  const address = new Address('北京', '北京', '朝阳区', 'XX 街道')
  const person = new Person(id, address);
}
```


简单的依赖注入，还是需要知道细节，只是把责任推到上级了。最后到入口解决，入口就要处理很多问题。还是很麻烦。

所以我们还需要一般的依赖性注入的框架。

`Provider` 告诉 `Injecter` 怎样去构造对象。

根据 `Provider` 数组 构建一个提供给你依赖性的池子， Provider 数组包含多个 Provider 对象，

Provider 对象，: 两个属性， 1. Provide <令牌>,  2. userClass/useFactory/useValue 

```typescript
  constructor(private oc: OverlayContainer) {
    const injector = ReflectiveInjector.resolveAndCreate([
      { provide: Person, useClass: Person},
      { provide: Address, useFactory: () => {
        if (environment.production) {
          return new Address('北京', '北京', '朝阳区', 'XX 街道');
        } else {
          return new Address('西藏', '拉萨', 'xx区', 'XX 街道');
        }
        }},
      { provide: Id, useFactory: () => {
          return Id.getInstance('idcard');
        }
      },
    ]);
    const person = injector.get(Person);
    console.log(JSON.stringify(person));
  }

```
通过 Inject来使用

```typescript
class Person {
  constructor(@Inject(Id) id, @Inject(Address) address) {
    this.id = Id;
    this.address = address;
  }
}
```

    static resolveAndCreate(providers: Provider[], parent?: Injector): ReflectiveInjector;

Provider 中有 ClassProvider, 所以

      { provide: Person, useClass: Person}, 简写成 Person,

代码实例：
```typescript
# core.module.ts
  providers: [{provide: 'BASE_CONFIG', useValue: 'http://localhost:3000'} ]

# app.component.ts
  constructor(private oc: OverlayContainer, @Inject('BASE_CONFIG') config) {
    console.log(config);
  }
```

池子里的都是同一个实例，如果我们想要一个新的实例怎么办？

__方法1:__ 在返回一个工厂方法，而不是对象

```typescript
{ provide: Address, useFactory: () => {
  return () => {
    if (environment.production) {
      return new Address('北京', '北京', '朝阳区', 'XX 街道');
    } else {
      return new Address('西藏', '拉萨', 'xx区', 'XX 街道');
    }
  } } },
```

__方法2: 父子方式__

```typescript
const childInjector = injector.resolveAndCreateChild([Person]);
const person = injector.get(Person);
const personFromChild =  childInjector.get(Person);
console.log(person === personFromChild);
```

子注入者没有提供 Person ，为什么能找到依赖性呢： 如果子池子找不到，会上父级找。

同理，所以在 module中provide的东西可以在 Component 中使用。在父 Component 中声明的东西子 Component 也可以使用。

通常我们不用手动写， 在module或是类的 Provider中提供出来 ,然后在 constructor 中指明它的类型。

## 4-2 ChangeDetection
__ChangeDetection__

* 检测程序内部状态，然后反映到UI上

* 引起状态变化： Events，XHR，Timers

* ApplicationRef 监听 NgZone 的 onTurnDone, 然后执行检测。

默认策略是全局检查，一般不会引起性能问题，大型应用会影响性能。

OnPush 策略，只有外部发生改变--设置的属性发生变化才进行检测。避免了整个树跑一遍。大型应用会提高性能。

* 手动检测
```typescript
# project-list.component.ts
  changeDetection: ChangeDetectionStrategy.OnPush
```
鼠标划过时，自动添加子组件---解决方法：

constructor(private cd: ChangeDetectorRef) , 然后在要检查的地方添加 `this.cd.markForCheck();` 例:

    dialogRef.afterClosed().subscribe(result => {
      this.projects = this.projects.filter(p => p.id !== project.id);
      this.cd.markForCheck();
    });

聪明组件手动检测，笨组件容易多了。输入值变了它才会变。

## 4-3 打造支持拖拽的属性型指令

__指令 Directive__

* 组件是一种带模板的指令

* 结构型(Structural)指令和属性型(Attribute)指令

* 如何自己写一个指令

__Renderer2 ElementRef__

* Angular 不提倡直接操作 DOM

* 对于 DOM 的操作应该通过 Renderer2 来进行

* ElementRef 可以理解成指向 DOM 元素的引用

ng g m directive
ng g d directive/drag --spec=false
ng g d directive/drop --spec=false

  @Input('appDraggable')
  set isDraggable(value: boolean) {
    this._isDraggble = value;
  }

  this._isDraggble = xxx; 有set 方法后使用时会直接调用 set 方法。
  appDraggable=true, 

```typescript
# drag.directive.ts
@Directive({selector: '[appDraggable][dragTag][dragData][draggedClass]'})
export class DragDirective {
  private _isDraggable = false;
  get isDraggable(): boolean {return this._isDraggable; }

  @Input('appDraggable')
  set isDraggable(draggable: boolean) {
    this._isDraggable = draggable;
    this.rd.setAttribute(this.el.nativeElement, 'draggable', `${draggable}`);
  }

  @Input() draggedClass: string;
  @Input() dragTag: string;
  @Input() dragData: string;

  constructor(private el: ElementRef, private rd: Renderer2, private service: DragDropService) {
  }

  @HostListener('dragstart', ['$event'])
  onDragStart(ev: Event) {
    if (this.el.nativeElement === ev.target) {
      this.rd.addClass(this.el.nativeElement, this.draggedClass);
      this.service.setDragData({tag: this.dragTag, data: this.dragData})
    }
  }

  @HostListener('dragend', ['$event'])
  onDragEnd(ev: Event) {
    if (this.el.nativeElement === ev.target) {
      this.rd.removeClass(this.el.nativeElement, this.draggedClass);
    }
  }

}
# drop.directive.ts
@Directive({selector: '[appDroppable][dropTags][dragEnterClass]'})
export class DropDirective {
  @Output() dropped = new EventEmitter<DragData>();
  @Input() dragEnterClass: string;
  @Input() dropTags: string [] = [];
  private data$;

  constructor(private el: ElementRef, private rd: Renderer2, private service: DragDropService) {
    this.data$ = this.service.getDragData().take(1);
  }

  @HostListener('dragenter', ['$event'])
  onDragEnter(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.el.nativeElement === ev.target) {
      this.data$.subscribe(dragData => {
        if (this.dropTags.indexOf(dragData.tag) > -1) {
          this.rd.addClass(this.el.nativeElement, this.dragEnterClass);
        }
      });
    }
  }

  @HostListener('dragover', ['$event'])
  onDragOver(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.el.nativeElement === ev.target) {
      this.data$.subscribe(dragData => {
        if (this.dropTags.indexOf(dragData.tag) > -1) {
          this.rd.setProperty(ev, 'dataTransfer.effectAllowed', 'all');
          this.rd.setProperty(ev, 'dataTransfer.dropEffect', 'move');
        } else {
          this.rd.setProperty(ev, 'dataTransfer.effectAllowed', 'none');
          this.rd.setProperty(ev, 'dataTransfer.dropEffect', 'none');
        }
      });
    }
  }

  @HostListener('drop', ['$event'])
  onDrop(ev: Event) {
    ev.preventDefault();
    ev.stopPropagation();
    if (this.el.nativeElement === ev.target) {
      this.data$.subscribe(dragData => {
        if (this.dropTags.indexOf(dragData.tag) > -1) {
          this.rd.removeClass(this.el.nativeElement, this.dragEnterClass);
          this.dropped.emit(dragData);
          this.service.clearDragData();
        }
      });
    }
  }

}

# directive.module.ts
  providers: [DragDropService]

# drag-drop.service.ts
export interface DragData {
  tag: string; //标识拖拽ID
  data: any;
}

@Injectable()
export class DragDropService {
  //BehaviorSubject 总能记住上一次的值
  private _dragData = new BehaviorSubject<DragData>(null);

  setDragData(data: DragData) {this._dragData.next(data); }

  getDragData(): Observable<DragData> {return this._dragData.asObservable(); }

  clearDragData() {this._dragData.next(null); }
}

# task-home.component.css
.drag-enter {background-color: dimgray; }

# task-home.component.html
<app-task-list *ngFor="let list of lists" class="list-container"
               appDroppable
               [dropTags]="" ]="'task-item', 'task-list'"
               [dragEnterClass]="" ]="'drag-enter'"
               [appDraggable]="true"
               [dragTag]="'task-list'"
               [draggedClass]="'drag-start'"
               [dragData]="list"
               (dropped)="handleMove($event, list)"

# task-home.component.ts
  handleMove(srcData, list) {
    switch (srcData.tag) {
      case 'task-item':
        console.log('handling item'); break;
      case 'task-list':
        console.log('handling list'); break;
      default: break;
  } } }

# task-item.component.css
.drag-start {opacity: 0.5; border: #ff525b dashed 2px; }

# task-item.component.html
<mat-list-item class="container"
               [appDraggable]="true"
               [dragTag]="'task-item'"
               [draggedClass]="'drag-start'"
               [dragData]="item"

```
  
## 4-4 结构型指令、模块和样式

`*`是一个语法糖

```typescript
<a *ngif="user.login">退出</a>
和下面相等
<ng-template ngif="user.login">
    <a>退出</a>
</ng-template>
```

ElementRef 是指 button节点，可以改变它的属性，如果要操作 内部子视图就是用ViewContainerRef

Button 操作里面的 mat-icon ，那么button就是容器。
```typescript
<button class="fab-button" mat-fab type="button" (click)="launchNewListDialog()">
  <mat-icon>add</mat-icon>
</button>

```

__模块__

* 什么是模块

如果是共用的要export出来，默认只能自己用。

* 模块的元数据

* 经常看到的forRoot()

源码 是static 方法，两个工场方法

`ng g m services`

动态定义元数据，返回Module。
```typescript
services.module.ts
@NgModule()
export class ServicesModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: ServicesModule,
      providers: []
    };
  }
}
```

__ngClass, ngStyle, [class.yourstyle]__

* ngClass 用于条件动态指定样式类，适合对样式做大量更改的情况。

* ngStyle 用于条件动态指定样式，适合少量更改的情况。

* `[class.youcondition] = "condition"` 直接对应一个条件

```typescript
# task-item.component.html
  <div mat-line class="content" [class.completed]="item.completed">
  和下面相等
  <div mat-line class="content" [ngClass]="{'completed': item.completed}">
```

flex 容器是 按 order 属性的顺序进行排列的，只要设置了list的order属性就可以改变 order值进行排列了。

```typescript
# task-home.component.html
                 [ngStyle]="{'order': list.order}"
# task-home.component.ts
  handleMove(srcData, list) {
      ...
      case 'task-list':
        console.log('handling list');
        const srcList = srcData.data;
        const tempOrder = srcList.order;
        srcList.order = list.order;
        list.order = tempOrder;
  }
```

## 4-5 模板驱动型表单处理

__模板驱动型表单__

* 表单的数据绑定

* 令人困惑的 ngModel

* 数据验证

`ng g c task/quick-task --spec=false`

    <input .. [(ngModel)]="desc" name="desc">

必须要一个name属性，绑定ngModel后自动创建ControlForm, 为了找到它，使用了name属性。

form 标签会自动变成ngForm。变成了angular的form，里面的控件就必须要有名字了。

```typescript
[(ngModel)]="desc" 语法糖等于
[ngModel]="desc" (ngModelChange)="desc=$event"
```

Code:

```typescript
 imports: [
    FormsModule,
    ReactiveFormsModule,
   ],
  exports: [
    FormsModule,
    ReactiveFormsModule]

# quick-task.component.html
<mat-input-container class="full-width">
  <input matInput type="text" placeholder="在这里快速建立一个任务" [(ngModel)]="desc" name="desc" required>
  <button matSuffix mat-icon-button type="button" (click)="sendQuickTask()">
    <mat-icon>send</mat-icon>
  </button>
  <mat-error>不能为空</mat-error>
</mat-input-container>

# quick-task.component.ts
export class QuickTaskComponent implements OnInit {
  desc: string;

  @Output() quickTask = new EventEmitter();
  constructor() { }

  @HostListener('keyup.enter')
  sendQuickTask() {
    if (!this.desc || this.desc.length === 0 || !this.desc.trim()) {
      return;
    }
    this.quickTask.emit(this.desc);
    this.desc = '';
  }
}

# task-home.component.html
    <app-quick-task (quickTask)="handleQuickTask($event)"></app-quick-task>
# task-home.component.ts
  handleQuickTask(desc: string) {console.log(desc); }
```
## 4-6 响应式表单处理和自定义表单控件(上)

__响应式表单__

* 三个重要： FormControl, FormGroup, FormBuilder

* 验证器和异步验证器

e.g 前端验证 和 后台取消息验证。如注册。和服务器交互返回结果后完成验证。

* 动态指定验证器

__自定义表单控件__

* 表单过于复杂之后，逻辑难以理清楚。

* 复杂问题拆成若干简单问题问题永远是【万能钥匙】

* 自定义 FormControl 的例子

先定义formGroup根对象，

`<form [formGroup]="form" (ngSubmit)="onSubmit(form, $event)">`

再定义 formControl
```typescript
# ts
    this.form = new FormGroup({
      email: new FormControl('wang@163.com', Validators.compose([Validators.required, Validators.email])),
      password: new FormControl('', Validators.required)
    });

# html
<input matInput type="password" placeholder="您的密码" formControlName="password">
```

formControlName 会将将表单绑定到对象

组合 Validators : 使用comopse , 条件1 不为空; 条件2符合 email

      email: new FormControl('wang@163.com', Validators.compose([Validators.required, Validators.email])),

```typescript

# html
<form [formGroup]="form" (ngSubmit)="onSubmit(form, $event)">
<button mat-raised-button color="primary" type="submit">登录</button>


  onSubmit({value, valid}, ev: Event) {
    ev.preventDefault();
    console.log(JSON.stringify((value)));
    console.log(JSON.stringify((valid)));
  }
```

使用 FormBuilder 简化表单初始化

    this.form = this.fb.group({
      email: ['wang@163.com', Validators.compose([Validators.required, Validators.email])],
      password: ['', Validators.required],
    });

__自定义验证器__

只有在验证错误的时候才返回非空对象， 这个 key,value对象, 通常是返回一个null

```typescript
  validate(c: FormControl): {[key: string]: any}{
    if (!c.value) {return null; }
    const pattern = /^wang+/;
    if (pattern.test(c.value)) {return null; }
    return {emailNotValid: 'The email must start with wang'};
  }
```
动态验证
```typescript
  onSubmit({value, valid}, ev: Event) {
    ...
    this.form.controls['email'].setValidators(this.validate);
  }
```


选择封面和选择头像很像，能否封装成一个FormControl控件, 本身注册表单不关心它有多少图片，怎么选择。现在是复杂化了表单。

封装自定义表单控件, 简化逻辑

`ng g c shared/image-list-select --spec=false`

想要足够的自由度，还是要封装，可以实现时需要权衡。实现 ControlValueAccessor 接口。
```typescript
export class ImageListSelectComponent implements ControlValueAccessor {

  //对应的是this.form.setValue()
  writeValue(obj: any): void {
  }

  registerOnChange(fn: any): void {
  }

  registerOnTouched(fn: any): void {
  }
}
```
writeValue对应的是this.form.setValue() 来写值

需要在provider中定义，把自己注册进去。provide 指向自己需要使用，

      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageListSelectComponent)
      multi: true

forwardRef(() --- 等待实例化后指向它。

Code:

```typescript
# register.component.html
<mat-card-content>
      <mat-input-container class="full-width">
        <input matInput type="text" placeholder="您的email" formControlName="email">
      </mat-input-container>
      <mat-input-container class="full-width">
        <input matInput type="text" placeholder="姓名" formControlName="name">
      </mat-input-container>
      <mat-input-container class="full-width">
        <input matInput type="password" placeholder="您的密码" formControlName="password">
      </mat-input-container>
      <mat-input-container class="full-width">
        <input matInput type="password" placeholder="重复输入您的密码" formControlName="repeat">
      </mat-input-container>
      <app-image-list-select
        [useSvgIcon]="true"
        [cols]="6"
        [title]="'选择头像'"
        [items]="items"
        formControlName="avatar">
      </app-image-list-select>
</mat-card-content>

# register.component.ts

  form: FormGroup;
  items: string[];
  private readonly avatarName = 'avatars';

  constructor(private fb: FormBuilder) {
  }

  ngOnInit() {
    const img = `${this.avatarName}:svg-${Math.ceil(Math.random() * 16).toFixed(0)}`;
    console.log(img);
    const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];
    this.items = nums.map(d => `avatars:svg-${d}`);
    this.form = this.fb.group({
      email: [],
      name: [],
      password: [],
      repeat: [],
      avatar: [img],
    });
  }

# image-list-select.component.css
mat-icon.avatar {
  overflow: hidden;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin: 12px;
}

.scroll-container{overflow-y: scroll; height: 200px; }

.image-container {
  position: relative;
  display: inline-block;
}

.image-container img{display: block; }

.image-container .after{
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: none;
  color: #fff;
}

.image-container:hover .after {display: block; background: rgba(0,0,0,0); }

.image-container:hover .after {
  color: #ddd;
  font-size: 48px;
  position: absolute;
  top: 50%;
  left: 50%;
  margin: -30px 0 0 -19px;
  height: 50px;
  width: 45px;
  cursor: pointer;
}

.image-container .after .zoom:hover {color: #fff; }
# image-list-select.component.html
<div>
  <span>{{title}}</span>
  <mat-icon class="" [svgIcon]="selected" *ngIf="useSvgIcon; else imgSelect"></mat-icon>
  <ng-template #imgSelect>
    <img src="selected" alt="image selected" class="cover">
  </ng-template>

</div>

<div class="scroll-container">
  <mat-grid-list [cols]="cols" [rowHeight]="rowHeight">
    <mat-grid-tile *ngFor="let item of items; let i = index">
      <div class="image-container" (click)="onChange(i)">
        <mat-icon class="avatar" [svgIcon]="item" *ngIf="useSvgIcon; else imgItem"></mat-icon>
        <ng-template #imgItem>
          <img src="item" alt="image item" ngStyle="{'width': itemWidth}">
        </ng-template>
        <div class="after">
          <div class="zoom">
            <mat-icon>checked</mat-icon>
          </div>
        </div>
      </div>
    </mat-grid-tile>
  </mat-grid-list>
</div>

# image-list-select.component.ts
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageListSelectComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ImageListSelectComponent),
      multi: true
    },
  ]

export class ImageListSelectComponent implements ControlValueAccessor {
  @Input() title = '选择';
  @Input() cols = 6;
  @Input() rowHeight = '64px';
  @Input() items: string[] = [];
  @Input() useSvgIcon = false;
  @Input() itemWidth = '80px';

  selected: string;
  constructor() {}
  private propagateChange = (_: any) => {};

  onChange(i) {
    this.selected = this.items[i];
    this.propagateChange(this.selected);
  }

  // 对应的是this.form.setValue()
  writeValue(obj: any): void {this.selected = obj; }
  registerOnChange(fn: any): void {this.propagateChange = fn; }
  registerOnTouched(fn: any): void {}
  validate(c: FormControl): { [key: string]: any } {
    return this.selected ? null : {imageListInvalid: {valid: false } };
  }
}

# shared.module.ts
  exports: [ImageListSelectComponent],


```
# 第5章 Rxjs常见操作符
## 5-1 RxJS帮你走进响应式编程的世界
__简介__

* 名字的由来： Reactive Extension

* 源自微软、火于 NetFlix

* 优势：在思考的维度上加入时间考量

使用  https://jsbin.com 讲解测试比较直观。

height$, $ 表明 stream一个流.

```typescript
# html 中 add library rxjs 5.0.3
<script src="https://unpkg.com/@reactivex/rxjs@5.0.3/dist/global/Rx.js"></script>
<input type="text" id="height">
# ES6/label 任何一个event有target.得到target的value
const height = document.getElementById('height');
const height$ = Rx.Observable.fromEvent(height, 'keyup');
height$.subscribe(val => console.log(val.target.value + '  ' + new Date()));
```

Rx 有很多强大的操作符，可合并多个流。

示例：求面积
```typescript
# html
  <div><input type="text" id="length"></div>
  <div><input type="text" id="width"></div>
  <div id="area"></div>
<script src="https://unpkg.com/@reactivex/rxjs@5.0.3/dist/global/Rx.js"></script>
# ES6/label 任何一个event有target.得到target的value
const length = document.getElementById('length');
const width = document.getElementById('width');
const area = document.getElementById('area');

const length$ = Rx.Observable.fromEvent(length, 'keyup').pluck('target', 'value');
const width$ = Rx.Observable.fromEvent(width, 'keyup').pluck('target', 'value');;

const area$ = Rx.Observable.combineLatest(length$, width$, (l, w) => {return l*w;});

area$.subscribe(val => area.innerHTML = val);
------------
length: -----1-------------3
width:  ----------2---------
area:   ---------(2,1)-----(2,3)
                  \        \
                  2*1        2*3
                  2           6
```
只改变一个值不进行计算， 我们可以使用zip操作符。

`const area$ = Rx.Observable.zip(length$, width$, (l, w) => {return l*w;});`

* 本节使用的操作符

combineLatest 有一个值改变就更新。

zip 多个值都改变时才更新。需要一一对应的关系

* 事件流

理解 Rx 的关键是要把任何变化想像成事件流。

## 5-2 常见操作符(一)

__常见创建类的操作符__

from: 可以把数组、Promise以及 Iterable 转化为 Observable
fromEvent: 可以把事件转化为 Observable
of: 接受一系列的数据，并把它们emit出去。

__常见转换操作符: map, mapTo, pluck__

弹珠图网站, 互动  http://rxmarbles.com/

__map__ 对原始值处理映射新的流

`map(x => 10 * x)`

效果相同

    const length$ = Rx.Observable.fromEvent(length, 'keyup').pluck('target', 'value');
    const length$ = Rx.Observable.fromEvent(length, 'keyup').map(ev => ev.target.value)

__mapTo__ 适合只关心事件，不关心值的情况下使用

    ...mapTo(1) ,返回1,
    ...map(_ => 1) 

    const length$ = Rx.Observable.from([1,2,3,4]);
    const width$ = Rx.Observable.fromEvent(width, 'keyup').pluck('target', 'value');;

__from__ 操作符

-1-2-3-4-------4
----------4----4
----------\----\
----------2----2

__of__ 操作符

    const length$ = Rx.Observable.of({id:1, value:20},{id:2, value:40});
    const area$ = Rx.Observable.combineLatest(length$, width$, (l, w) => {return l.value*w;});

```typescript
# core.module.ts
    {provide: 'BASE_CONFIG', useValue: {
      uri: 'http://localhost:3000',
      }}

# login.component.html
      <mat-card-subtitle>{{quote.cn}}</mat-card-subtitle>
    </mat-card-header>
    <img mat-card-xl-image [src]="quote.pic">
    <mat-card-content>
      {{quote.en}}

# login.component.ts
  // 为了防止为空给初始值
  quote: Quote =  {
    cn: '慧妍',
    en: 'Aliquam erat volutpat.',
    pic: '/assets/img/quotes/1.jpg'
  };
  constructor(private fb: FormBuilder, private quoteService: QuoteService) {
    this.quoteService.getQuote().subscribe(q => {this.quote = q; }); 
  }
# quote.service.ts
export class QuoteService {

  constructor(private http: HttpClient, @Inject('BASE_CONFIG') private config) {}

  getQuote(): Observable<Quote> {
    const uri = `${this.config.uri}/quotes/${Math.floor(Math.random() * 6)}`
    // return this.http.get<Quote>(uri).debug('quote: ');
    return this.http.get<Quote>(uri);
  }
}
# services.module.ts
      providers: [QuoteService]
      
```
## 5-3 常见操作符(二)

__Observable的性质__

* 三种状态： next, error, complete 

* 特殊的： 永不结束，Never, Empty(结束但不发射), Throw

常见工具类操作符: do

常见变换类操作符: scan

常见数学类操作符: redude

过滤类操作符： filter,take,first/last,skip

常见创建类操作符: Interval, Timer

```typescript
const interval$ = Rx.Observable.interval(100).take(3);
interval$.subscribe(
  val => console.log(val),
  err => console.log(err),
  () => console.log('I am compolelte')
)
```

timer 只输出一个值
```typescript
const timer$ = Rx.Observable.timer(100);
timer$.subscribe(v => console.log(v))
```

`const timer$ = Rx.Observable.timer(100, 100);` 参数1延时时间，参数2循环时间

do 相当于中间桥梁处理在 subscribe 之前。

```typescript
let logLabel = '当前值是'

const interval$ = Rx.Observable.interval(100)
  .map(val => val *2)
  .do(v => {
    console.log(logLabel + v);
    logLabel = '当前'
    })
  .take(3);
```

只有在3个偶数之后流才会结束

`const interval$ = Rx.Observable.interval(100) .filter(val => val % 2 === 0) .take(3);`

`.first()` 和 `take(1)` 是一样的

.filter(val => val % 2 === 0) .skip(2) 过滤掉前两个0, 2 

__scan__

```typescript
const interval$ = Rx.Observable.interval(100)
  .filter(val => val % 2 === 0)
  .scan((x, y) => {return x+y})
  .take(4);
```
参数1:accumulater, 累加器默认是0, 返回结果作为下次累加值传入，

    0-----1----2----3----4----5-----6----
    0----------2---------4----------6----
    0----------2---------6----------12---

reduce 只发射最后值，所以这里take是没用的。

    .filter(val => val % 2 === 0) .reduce((x, y) => {return x+y}) .take(4);

需要改变一下顺序

    .filter(val => val % 2 === 0) .take(4) .reduce((x, y) => {return x+y})

reduce 不是只针对数组，可对集合处理，字典处理。

    .filter(val => val % 2 === 0) .take(4) .reduce((x, y) => {return [...x, y]}, []) ---[0,2,4,6], 
    

手动 throw error

    .map( val => {throw '出错了'}) .take(4) .reduce((x, y) => {return [...x, y]}, [])

自带never `const interval$ = Rx.Observable.never()` 直接无尽序列

`const interval$ = Rx.Observable.throw('出错了')`

`const interval$ = Rx.Observable.empty()` 直接进入 complete

### 实现一个DebugUtil

core中引入 `import '../utils/debug.util';`

```typescript
# src/app/utils/debug.util.ts

declare module 'rxjs/Observable' {
  interface Observable<T> {debug: (...any) => Observable<T>; }
}
Observable.prototype.debug = function (message: string) {
  return this.do(
    (next) => {if (!environment.production) {console.log(message, next); } },
    (err) => {if (!environment.production) {console.error('Error>>', message, err); } },
    () => {if (!environment.production) {console.log('Complete - '); } }
  );
};
```


## 5-4 常见操作符(三)

过滤类操作符：
debounce, debounceTime, distinct, distinctUntilChanged,

distinctUntilChanged 只跟前一个元素比，一样就抛弃掉。

合并类操作符： merge, concat, startWith, combineLatest, withLatestFrom, zip

concat, 顺序连接

startWith 开始就发射一个值。

combineLatest 有新元素就成为新的流

zip 严格要求成对匹配，才产生新流。

withLatestFrom 以源事件流为基准，主流产生数据时去取另一个流最新值。

* debounce 滤波, http请求自动提示时常用。
```typescript
const length = document.getElementById('length');

const length$ = Rx.Observable.fromEvent(length, 'keyup').pluck('target', 'value').debounce(() => Rx.Observable.interval(300));
const length$ = Rx.Observable.fromEvent(length, 'keyup').pluck('target', 'value').debounceTime(300);
length$.subscribe(val => console.log(val));
```

* distinct 扔掉相同的流
```typescript
# const length$ = Rx.Observable.fromEvent(length, 'keyup').pluck('target', 'value') .distinctUntilChanged();
```

* merge 简单合并
```typescript
const length = document.getElementById('length');
const length$ = Rx.Observable.fromEvent(length, 'keyup').pluck('target', 'value');
const width = document.getElementById('width');
const width$ = Rx.Observable.fromEvent(width, 'keyup').pluck('target', 'value');
const merged$ = Rx.Observable.merge(length$, width$);
merged$.subscribe(val => console.log(val));
```

* concat
```typescript
# const merged$ = Rx.Observable.concat(length$, width$);
concat 时第二个永远不会输出，因为此例中length是无穷序列。

const first$ =  Rx.Observable.from([1,2,3,4])
const merged$ = Rx.Observable.concat(first$, width$);
```

* startWith 相当于赋初始值0
```typescript
const first$ =  Rx.Observable.from([1,2,3,4]).startWith(0)
```

* combineLatest 任一值改变时有输出
```typescript
const merged$ = Rx.Observable.combineLatest(length$, width$, (l,w) => l*w);
```

* _zip 对齐，两个流都变化时输出，最新值
```typescript
const merged$ = Rx.Observable.zip(length$, width$, (l,w) => l*w);
```
_
* withLatestFrom 以源流为主，源流变化时才会有输出
```typescript
const merged$ = length$.withLatestFrom(width$);
```
## 5-5 实战复杂表单控件(上)

* ng-container

```typescript
<div>1</div>
<ng-container formControlName="age">
  <div>2</div>
</ng-container>
```
    
通常多一层div，但是用 ng-container 是没有这一层的。 1,2,是同级的

自定义表单控件要继承 ControlValueAccessor ，包含三个实现的方法。

`writeValue registerOnChange registerOnTouched`

* writeValue -- 向控件中写值，通常用来改变模板当中的值

* registerOnChange(fn: any) 向外广播我值发生变化的机制。

```typescript
  registerOnChange(fn: any): void {this.propagateChange = fn; }
  
  ngOnInit() {this.propagateChange('ss'); }
  //外界就知道我的值改变了, 并且知道变化的值是什么

  写上 (change)="onChange($event)" , 这个onchange就会到 propagateChange 当中去，处理函数会接收到event。
```

* registerOnTouched 也是提供机制向外传播我的控件被touch。

```text
                  toAge
                  / 
birthday: -------d,from-------d-------d--------------------
ageNum: ----an--------an-----an------an------------------
ageUnit: ---------au-------au------au--------------------
age                a   a    a
                    \toDate,from
         ----d----d-----d---d--d-d-----d-d--------------------
```

合并起来，符合 combineLatest 合并流。得到合并流后转换为日期。再将日期流合并。--添加区分来源，防止相互反应。

## 5-6 实战复杂表单控件(中)

判断流是从 birthday 还是 age 来的。

用filter过滤掉表单不合法的值。

combineLatest(ageNum$, ageUnit$ 需要两个都有值，我们一个初始值即表单的值

    const ageNum$ = ageNum.valueChanges.startWith(ageNum.value);

用 debounceTime 过滤掉没用的值。
用 distinctUntilChanged 过滤掉一样的值。

## 5-7 实战复杂表单控件(下)

组合验证需要知道组合验证的名子，

```typescript
      age: this.fb.group({
        ageNum: [],
        ageUnit: [],
      }, {validator: this.validateAge('ageNum', 'ageUnit')})
```
需要返回一个验证器，它是一个工厂。

          ageNum.patchValue(age.age, {emitEvent: false});
更新了控件后，是否通知其他人。

```typescript
# date.util.ts
import {differenceInYears, isDate, isFuture, isValid, parse} from 'date-fns';
export const isValidDate = (val: string): boolean => {
  const date = parse(val)
  return isDate(date)
  && isValid(date)
  && !isFuture(date)
  && differenceInYears(Date.now(), date) < 150;
}
# register.component
    html <app-age-input formControlName="dateOfBirth"></app-age-input>

    ts this.form = this.fb.group({
      ...
      dateOfBirth: ['1990-01-01'],
    });

# age-input.component.html
<div [formGroup]="form" class="age-input">
  <div>
    <mat-input-container>
      <input type="text" matInput [matDatepicker]="birthPicker"  formControlName="birthday" placeholder="出生日期">
      <mat-datepicker-toggle matSuffix [for]="birthPicker"></mat-datepicker-toggle>
      <mat-error>日期不正确</mat-error>
    </mat-input-container>
    <mat-datepicker touchUi="true" #birthPicker></mat-datepicker>
  </div>
  <ng-container formGroupName="age">
    <div class="age-num">
      <mat-input-container>
        <input type="number" placeholder="年龄" matInput formControlName="ageNum">
      </mat-input-container>
    </div>
    <div>
      <mat-button-toggle-group formControlName="ageUnit" [(ngModel)]="selectedUnit">
        <mat-button-toggle *ngFor="let unit of ageUnits" [value]="unit.value">
          {{unit.label}}
        </mat-button-toggle>
      </mat-button-toggle-group>
    </div>
    <mat-error *ngIf="form.get('age').hasError('ageInvalid')">年龄或单位不正确</mat-error>
  </ng-container>
</div>

# age-input.component.ts

export enum AgeUnit {
  Year = 0,
  Month,
  Day
}

export interface Age {
  age: number;
  unit: AgeUnit;
}

@Component({
  selector: 'app-age-input',
  templateUrl: './age-input.component.html',
  styleUrls: ['./age-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AgeInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AgeInputComponent),
      multi: true
    },
  ]
})
export class AgeInputComponent implements ControlValueAccessor, OnInit, OnDestroy {

  @Input() daysTop = 90; @Input() daysBottom = 0; 
  @Input() monthTop = 24; @Input() monthBottom = 1;
  @Input() yearTop = 150; @Input() yearsBottom = 1;
  @Input() format = 'YYYY-MM-DD';
  @Input() debounceTime = 300;

  selectedUnit = AgeUnit.Year;
  ageUnits = [
    {value: AgeUnit.Year, label: '岁'},
    {value: AgeUnit.Month, label: '月'},
    {value: AgeUnit.Day, label: '天'},
  ]
  form: FormGroup;
  sub: Subscription;
  private propagateChange = (_: any) => {};

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form = this.fb.group({
      birthday: ['', this.validateDate],
      age: this.fb.group({
        ageNum: [],
        ageUnit: [AgeUnit.Year],
      }, {validator: this.validateAge('ageNum', 'ageUnit')})
    });
    const birthday  = this.form.get('birthday');
    const ageNum  = this.form.get('age').get('ageNum');
    const ageUnit  = this.form.get('age').get('ageUnit');

    const birthday$ = birthday.valueChanges.map(d => {
      return {date: d, from: 'birthday'};
    }).filter(_ => birthday.valid);

    const ageNum$ = ageNum.valueChanges.startWith(ageNum.value).debounceTime(this.debounceTime).distinctUntilChanged();
    const ageUnit$ = ageUnit.valueChanges.startWith(ageUnit.value).debounceTime(this.debounceTime).distinctUntilChanged();
    const age$ = Observable.combineLatest(ageNum$, ageUnit$, (_n, _u) => {
      return this.toDate({age: _n, unit: _u});
      }).map(d => {
        return {date: d, from: 'age'};
      }).filter(_ => this.form.get('age').valid);

    const merged$ = Observable.
      merge(birthday$, age$)
      .filter(_ => this.form.valid);
    this.sub = merged$.subscribe(d => {
      const age = this.toAge(d.date);
      if (d.from === 'birthday') {
        if (age.age !== ageNum.value) {
          ageNum.patchValue(age.age, {emitEvent: false});
        }
        if (age.unit !== ageUnit.value) {
          this.selectedUnit = age.unit;
          ageUnit.patchValue(age.unit, {emitEvent: false});
        }
        this.propagateChange(d.date);
      } else {
        const ageToCompare = this.toAge(birthday.value);
        if (age.age !== ageToCompare.age || age.unit !== ageToCompare.unit) {
          this.form.get('birthday').patchValue(d.date, {emitEvent: false});
          this.propagateChange(d.date);
        }
      }
    });

  }

  writeValue(obj: any): void {
    if (obj) {
      const date = format(obj, this.format);
      this.form.get('birthday').patchValue(date);
      const age = this.toAge(date);
      this.form.get('age').get('ageNum').patchValue(age.age);
      this.form.get('age').get('ageUnit').patchValue(age.unit);
    }
  }

  registerOnChange(fn: any): void {this.propagateChange = fn; }

  registerOnTouched(fn: any): void {}

  private toAge(dateStr: string): Age {
    const date = parse(dateStr);
    const now = Date.now();
    return isBefore(subDays(now, this.daysTop), date) ?
      {age: differenceInDays(now , date), unit: AgeUnit.Day} :
        isBefore(subMonths(now, this.monthTop), date) ?
          {age: differenceInMonths(now, date), unit: AgeUnit.Month} :
          {
            age: differenceInYears(now, date),
            unit: AgeUnit.Year
          };
  }

  private toDate(age: Age): string {
    const now = Date.now();
    switch (age.unit) {
      case AgeUnit.Year: {return format(subYears(now, age.age), this.format); }
      case AgeUnit.Month: {return format(subMonths(now, age.age), this.format); }
      case AgeUnit.Day: {return format(subDays(now, age.age), this.format); }
      default: return null;
    }
  }

  ngOnDestroy() {if (this.sub) {this.sub.unsubscribe(); } }

  validate(c: FormControl): { [key: string]: any } {
    const val = c.value;
    if (!val) {return null; }
    if (isValidDate(val)) {return null; }
    return {dateOfBirthInvalid: true };
  }


  validateDate(c: FormControl): { [key: string]: any } {
    const val = c.value;
    return isValidDate(val) ? null : {
      birthdayInvalid: true
    };
  }

  validateAge(ageNumKey: string, ageUnitKey: string) {
    return (group: FormGroup): {[key: string]: any} => {
      const ageNum = group.controls[ageNumKey];
      const ageUnit = group.controls[ageUnitKey];
      let result = false;
      const ageNumVal = ageNum.value;
      switch (ageUnit.value) {
        case AgeUnit.Year: {result = ageNumVal >= this.yearsBottom && ageNumVal < this.yearTop; break; }
        case AgeUnit.Month: {result = ageNumVal >= this.monthBottom && ageNumVal < this.monthTop; break; }
        case AgeUnit.Day: {result = ageNumVal >= this.daysBottom && ageNumVal < this.daysTop; break; }
        default:
          break;
      }
      return result ? null : {ageInvalid: true};
    };
  }
}
```

# 第6章 Angular 中的响应式编程
## 6-1 高阶操作符
高阶操作符： 拍扁的作用--从多层变一层

flatMap 和 mergeMap 是相等的。在rxjs中flatMap是mergeMap的别名。

mergeMap 会保留所有订阅的子流。

switchMap 有新流进来时会抛弃之前的流。

例删除文章的流，外层删除文章 ，内层要删除文章的所有的评论。删除第一个文章时，来了删除第二个文章的请求，要不要评论这个动作要不要继续进行。要继续=mergeMap。
```typescript
const length$ = Rx.Observable.fromEvent(length, 'keyup').pluck('target', 'value')
  .switchMap(_ => Rx.Observable.interval(1000));
```

在 index.ts 中导入当前所有需要导入的， 在引用时 只引用到目录即可 '/domain'

update 用 patch 方法，只更新需要修改的属性。

json-server 只支持2级级联删除。我们这里使用 删除列表和项目的task。

我们只需要最后全部删除的结果，不需要中间返回的http status 200。 使用 count, 对流里的数量进行一个统计。

删除所有 task后

mergeMap - taskList 对应的子流全部都要保持住。希望在删除时删的干干净净。

switchMap 不关心外层。
```typescript
  del(project: Project) {
    const delTasks$ = Observable.from(project.taskLists)
      .mergeMap(listId => this.http.delete(`${this.config.uri}/taskLists/${listId}`))
      .count();
    const uri = `${this.config.uri}/${this.domain}/${project.id}`;
    return delTasks$
      .switchMap(_ => this.http.delete(`${this.config.uri}/${this.domain}/${project.id}`))
      .mapTo(project);
  }
```

`json-server ./mock/data.json --watch`

`mock/rest.http` 中添加 `GET http://localhost:3000/projects/?members_like=2` 来测试。 

```typescript
# data.json
  "projects": [
    {
      "id": 1,
      "name": "itemMame-1",
      "desc": "this is a ent project",
      "coverImg": "assets/img/covers/0.jpg",
      "members": ["1", "2"]
    },
    {
      "id": 2,
      "name": "Auto test",
      "desc": "this is a ent project",
      "coverImg": "assets/img/covers/1.jpg",
      "members": ["1"]
    }
  ],

# domain/index.ts
export * from './project.model';
export * from './quote.model';
export * from './task-list.model';
export * from './task.model';
export * from './user.model';

# domain/project.model.ts
export interface Project {
  id?: string;
  name: string;
  desc?: string;
  coverImg: string;
  taskLists?: string[]; // 列表id
  members?: string[]; // 成员id

}

# domain/task.model.ts
export interface Task {
  id?: string;
  desc: string;
  completed: boolean;
  priority: number;
  dueDate?: Date;
  reminder?: Date;
  remark?: string;
  createDate: Date;
  ownerId?: string;
  participantIds: string[];
  taskListId: string;
}

# domain/task-list.model.ts
export interface TaskList {
  id?: string;
  name: string;
  order: number;
  taskIds: string[];
  projectId: string;
}

# domain/user.model.ts
export interface User {
  ...
  projectIds: string[];
}

# src/app/services/project.service.ts
export  class ProjectService {

  private readonly domain = 'project';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  constructor(private http: HttpClient, @Inject('BASE_CONFIG') private config) {}

  // POST
  add(project: Project): Observable<Project> {
    project.id = null;
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http
      .post<Project>(uri, JSON.stringify(project), {headers: this.headers});
  }

  // PUT
  update(project: Project): Observable<Project> {
    const uri = `${this.config.uri}/${this.domain}/${project.id}`;
    const toUpdate = {
      name: project.name,
      desc: project.desc,
      coverImg: project.coverImg,
    }
    return this.http
      .patch<Project>(uri, JSON.stringify(toUpdate), {headers: this.headers});
  }

  // DELETE
  del(project: Project): Observable<Project> {
    const delTasks$ = Observable.from(project.taskLists)
      .mergeMap(listId => this.http.delete(`${this.config.uri}/taskLists/${listId}`))
      .count();
    const uri = `${this.config.uri}/${this.domain}/${project.id}`;
    return delTasks$
      .switchMap(_ => this.http.delete(`${this.config.uri}/${this.domain}/${project.id}`))
      .mapTo(project);
  }

  // GET
  get(userId: string): Observable<Project[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http
      .get<Project[]>(uri, {params: {'members_like': userId}});
  }
}

# services.module.ts
      providers: [QuoteService, ProjectService]

# project-list.component.ts
  projects;
  constructor(...private service$: ProjectService) {}
  ngOnInit() {this.service$.get('1').subscribe(projects => this.projects = projects); }

```
## 6-2 实战服务逻辑(上)
项目列表(name, order, projectid)-任务列表

任务列表-增删改查 和project 类似，但多了一个移动。但只改变了内存，没有改变服务器的数据。

__tasks__ 和 taskList 有类似的增删改查，多一个 completed, 单一责任制， 单独写完成功能，移动功能。

src, target 的  order 的更新。两个事件流，一个drag的事件，一个是drop的order。 先将这两个流处理完后，将更新后的 tasklist 返回。最后要返回一个tasklist数组，做一个合并再做reduce。

用merge和concat都行。没有顺序之分。这里为了演示使用 concat 顺序执行。再用reduce返回数组。
```typescript
# task-list.service.ts
export  class TaskListService {
   ...
  add(taskList: TaskList): Observable<TaskList> {
    taskList.id = null;
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http .post<TaskList>(uri, JSON.stringify(taskList), {headers: this.headers}); }

  update(taskList: TaskList): Observable<TaskList> {
    const uri = `${this.config.uri}/${this.domain}/${taskList.id}`;
    const toUpdate = {name: taskList.name }
    return this.http .patch<TaskList>(uri, JSON.stringify(toUpdate), {headers: this.headers}); }

  del(taskList: TaskList): Observable<TaskList> {
    const uri = `${this.config.uri}/${this.domain}/${taskList.id}`;
    return this.http.delete(uri) .mapTo(taskList); 
  }

  // GET
  get(projectId: string): Observable<TaskList[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http .get<TaskList[]>(uri, {params: {'projectId': projectId}}); 
  }

  swapOrder(src: TaskList, target: TaskList): Observable<TaskList[]> {
    const dragUri = `${this.config.uri}/${this.domain}/${src.id}`;
    const dropUri = `${this.config.uri}/${this.domain}/${target.id}`;
    const drag$ = this.http.patch<TaskList[]>(dragUri, JSON.stringify({order: target.order}), {headers: this.headers});
    const drop$ = this.http.patch<TaskList[]>(dropUri, JSON.stringify({order: target.order}), {headers: this.headers});
    return (Observable.concat(drag$, drop$).reduce((arrs, list) => [...arrs, list], [])) as Observable<TaskList[]>;
  }


}

```


## 6-3 实战服务逻辑(中)

```typescript
npm i --save lodash
npm i -D @types/lodash


dialogRef.afterClosed().subscribe(project => {})
dialogRef.afterClosed().filter(n => n).subscribe(project => {})
```

直接关闭时没有project的，filter一下

      this.service$.add(project); 也返回的是个流，不2次订阅，合并一下流。


    dialogRef.afterClosed().filter(n => n).switchMap(v => this.service$.add(v))
      .subscribe(project => console.log(project));

返回的是 xx_tn 缩略图，我们要处理一让返回大图。并在界面上进行更改。

* 节省订阅

做一人个 take ， 不需要 desctroy 中取消订阅，也不用一直监视。节省订阅。

__filter__  (n => n) 它或 boolean 为真，非空

__map__  `.map(val => ({...val, coverImg: this.buildImgSrc(val.coverImage)})) `

展开前面对象，后面的属性，没有就添加有就更新。

```typescript

# new-project.component.ts
ngOnInit() {
    this.coverImages = this.data.thumbnails;
    if (this.data.project) {
      this.form = this.fb.group({
        name: [this.data.project.name, Validators.required],
        desc: [this.data.project.desc],
        coverImg: [this.data.project.coverImg],
      });
      this.title = '修改项目';
    } else {
      this.form = this.fb.group({
        name: [, Validators.required],
        desc: [],
        coverImg: [this.data.img],
      });
      this.title = '创建项目';
    }
  }

  onSubmit({value, valid}, ev: Event) {
    ev.preventDefault();
    if (!valid) {return; }
    this.dialogRef.close(value);
  }

#project-list.component.css
.card {　... display: flex; }

#project-list.component.html
                    (onEdit)="launcherUpdateDialog(project)"

#project-list.component.ts
  sub: Subscription;

  constructor(private dialog: MatDialog, private cd: ChangeDetectorRef, private service$: ProjectService) {
  }

  ngOnInit() {
    this.sub = this.service$.get('1').subscribe(projects => {
      this.projects = projects;
      this.cd.markForCheck();
    });
  }

  ngOnDestroy() {if (this.sub) {this.sub.unsubscribe(); } }

  openNewProjectDialog() {
    const selectedImg = `/assets/img/covers/${Math.floor(Math.random() * 40)}_tn.jpg`;
    console.log(selectedImg);
    const dialogRef = this.dialog.open(NewProjectComponent, {data: {thumbnails: this.getThumbnails(), img: selectedImg}});
    dialogRef.afterClosed()
      .take(1)
      .filter(n => n)
      .map(val => ({...val, coverImg: this.buildImgSrc(val.coverImg)}))
      .switchMap(v => this.service$.add(v))
      .subscribe(project => {
          this.projects = [...this.projects, project];
          this.cd.markForCheck();
      });
  }

  launcherUpdateDialog(project: Project) {
    const dialogRef = this.dialog.open(NewProjectComponent, {data: {thumbnails: this.getThumbnails(), project: project}});
    dialogRef.afterClosed() .take(1) .filter(n => n)
      .map(val => ({...val, id: project.id, coverImg: this.buildImgSrc(val.coverImg)}))
      .switchMap(v => this.service$.update(v))
      .subscribe(project => {
        const index = this.projects.map(p => p.id).indexOf(project.id);
        this.projects = [...this.projects.slice(0, index), project, ...this.projects.slice(index + 1)]
        this.cd.markForCheck();
      });
  }

  launcheConfirmDialog(project) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: {thumbnails: this.getThumbnails(), project: project}});
    dialogRef.afterClosed() .take(1) .filter(n => n)
      .switchMap(v => this.service$.del(project))
      .subscribe(prj => {
        this.projects = this.projects.filter(p => p.id !== project.id)
        this.cd.markForCheck();
      });
  }

  private getThumbnails() {return _.range(0, 40) .map(i => `/assets/img/covers/${i}_tn.jpg`); }

  private buildImgSrc(img: string): string {console.log(img); return img.indexOf('_') > -1 ? img.split('_')[0] + '.jpg' : img; }
}

# task.service.ts
export  class TaskService {

  private readonly domain = 'tasks';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  constructor(private http: HttpClient, @Inject('BASE_CONFIG') private config) {}

  // POST
  add(task: Task): Observable<Task> {
    task.id = null;
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http .post<Task>(uri, JSON.stringify(task), {headers: this.headers}); 
  }

  // PUT
  update(task: Task): Observable<Task> {
    const uri = `${this.config.uri}/${this.domain}/${task.id}`;
    const toUpdate = {
      name: task.desc,
      desc: task.priority,
      coverImg: task.dueDate,
      reminder: task.reminder,
      ownerId: task.ownerId,
      participantIds: task.participantIds,
      remark: task.remark
    }
    return this.http .patch<Task>(uri, JSON.stringify(toUpdate), {headers: this.headers});
  }

  // DELETE
  del(task: Task): Observable<Task> {
    const uri = `${this.config.uri}/${this.domain}/${task.id}`;
    return this.http.delete(uri) .mapTo(task);
  }

  // GET
  get(taskListId: string): Observable<Task[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http .get<Task[]>(uri, {params: {'taskListId': taskListId}});
  }

  getByLists(lists: TaskList[]): Observable<Task[]> {
    return Observable.from(lists) .mergeMap(list => this.get(list.id) ) 
    .reduce((tasks: Task[], t: Task[] ) => [...tasks, ...t], []);
  }

  complete(task: Task): Observable<Task> {
    const uri = `${this.config.uri}/${this.domain}/${task.id}`;
    return this.http .patch<Task>(uri, JSON.stringify({completed: !task.completed}), {headers: this.headers});
  }

  move(taskId: string, taskListId: string): Observable<Task> {
    const uri = `${this.config.uri}/${this.domain}/${taskId}`;
    return this.http .patch<Task>(uri, JSON.stringify({taskListId: taskListId}), {headers: this.headers});
  }

  moveAll(srcListId: string, targetListId: string): Observable<Task[]> {
    return this.get(srcListId)
      .mergeMap(tasks => Observable.from(tasks))
      .mergeMap(task => this.move(task.id, targetListId))
      .reduce((arr, x) => [...arr, x], []);
  }

}

```

## 6-4 实战服务逻辑(下)

* 查询用户，搜索建议

* 添加组员，添加任务执行者

* 处理 user 和 project 的关系。

### UserService

user 这边有 projectsid， project 有 members id。

增加关联，删除关联，以及批量的处理。

```typescript

export  class UserService {

  private readonly domain = 'users';
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  constructor(private http: HttpClient, @Inject('BASE_CONFIG') private config) {}

  searchUsers(filter: string): Observable<User[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http.get<User[]>(uri, {params: {'email_like': filter}});
  }
  gethUsersByProject(projectId: string): Observable<User[]> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http.get<User[]>(uri, {params: {'projectId_like': projectId}});
  }

  addProjectRef(user: User, projectId: string): Observable<User> {
    const uri = `${this.config.uri}/${this.domain}/${user.id}`;
    const projectIds = user.projectIds ? user.projectIds : [];
    if (projectIds.indexOf(projectId) > -1) {
        return Observable.of(user);
    }
    return this.http.patch<User>(uri, JSON.stringify({projectIds: [...projectIds, projectId]}), {headers: this.headers});
  }

  removeProjectRef(user: User, projectId: string): Observable<User> {
    const uri = `${this.config.uri}/${this.domain}/${user.id}`;
    const projectIds = user.projectIds ? user.projectIds : [];
    const index = projectIds.indexOf(projectId);
    if (index === -1) {
        return Observable.of(user);
    }
    const toUpdate = [...projectIds.slice(0, index), ...projectIds.slice(index + 1)];
    return this.http.patch<User>(uri, JSON.stringify({projectIds: toUpdate}), {headers: this.headers});
  }

  batchUpdateProjectRef(project: Project): Observable<User[]> {
    const projectId = project.id;
    const membersIds = project.members ? project.members : [];
    return Observable.from(membersIds)
      .switchMap(id => {
        const uri = `${this.config.uri}/${this.domain}/${id}`;
        return this.http.get<User>(uri);
      })
      .filter(user => user.projectIds.indexOf(projectId) === -1)
      .switchMap(u => this.addProjectRef(u, projectId))
      .reduce((arr, curr) => [...arr, curr], []);
  }
}
```
### AuthService

新建 auth.model ， 基于 token based 认证。session 维护目前比较麻烦。

认证service 会有验证和登录。这里没有后台。没有删除用户

```typescript
# auth.service.ts
export  class AuthService {
  private readonly domain = 'users';
  private headers = new HttpHeaders({'Content-Type': 'application/json'});
  private token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9' +
    '.eyJ1c2VyX2lkIjoxNSwidXNlcm5hbWUiOiJ3YW5nZ2YiLCJleHAiOjE1MjQ2MDYzMzgsImVtYWlsIjoiIn0' +
    '.fd2TpIyyc5ErnnFzAffCDE83wpfXM44hZWPvSVbn0Ec';

  constructor(private http: HttpClient, @Inject('BASE_CONFIG') private config) {}

  // POST
  register(user: User): Observable<Auth> {
    user.id = null;
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http
      .get<User[]>(uri, {params: {'email': user.email}})
      .switchMap(res => {
        if (res.length > 0) {throw 'user existed'; }
        return this.http
          .post<User>(uri, JSON.stringify(user), {headers: this.headers})
          .map(r => ({token: this.token, user: r}));
      });
  }

  login(username: string, password: string): Observable<Auth> {
    const uri = `${this.config.uri}/${this.domain}`;
    return this.http
      .get<User[]>(uri, {params: {'email': username, 'password': password}})
      .map(users => {if (users.length === 0) {throw 'username or password not match'; }
        return {token: this.token, user: users[0] };
      });
  }
}

```

### AuthGuard 

路由守卫可以用 纯 boolean 或 Observable 或Promise形式返回，这里以 Observable形式的返回

```typescript
# auth-guard.service.ts
export class AuthGuardService implements CanActivate {
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {
    return Observable.of(true);
  }
}
```

### Models

```typescript
# auth.model.ts
export interface Auth {
  user?: User;
  userId?: string;
  token?: string;
  err?: Err;
}

# err.model.ts
export interface Err {
  timestamp?: Date;
  status?: string;
  error?: string;
  exception?: string;
  message?: string;
  path?: string;
}

```

## 6-5 实战自动建议表单控件

本节使用了 MatChipsModule

```typescript
#chips-list.component.html
<div [formGroup]="form">
  <span>{{label}}</span>
  <mat-chip-list>
    <mat-chip selected="true" color="primary" *ngFor="let member of items">
      {{member.name}} <span class="remove-tag" (click)="removeMember(member)">x</span>
    </mat-chip>
  </mat-chip-list>
  <mat-input-container *ngIf="displayInput" class="full-width">
    <input type="text"
           matInput
           [placeholder]="placehoderText"
           [matAutocomplete]="autoMember"
           formControlName="memberSearch">
  </mat-input-container>
</div>
<mat-autocomplete #autoMember="matAutocomplete" [displayWith]="displayUser">
  <mat-option *ngFor="let item of memberResults$ | async"
  [value]="item"
  (onSelectionChange)="handleMemberSelection(item)">
    {{item.name}}
  </mat-option>
</mat-autocomplete>

#chips-list.component.ts
import {Component, forwardRef, Input, OnInit} from '@angular/core';
import {ControlValueAccessor, FormBuilder, FormControl, FormGroup, NG_VALIDATORS, NG_VALUE_ACCESSOR} from '@angular/forms';
import {User} from '../../domain';
import {Observable} from 'rxjs/Observable';
import {UserService} from '../../services/user.service';

@Component({
  selector: 'app-chips-list',
  templateUrl: './chips-list.component.html',
  styleUrls: ['./chips-list.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ChipsListComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ChipsListComponent),
      multi: true
    },
  ]

})
export class ChipsListComponent implements OnInit, ControlValueAccessor {

  @Input() multiple = true;
  @Input() placehoderText = '请输入成员 email';
  @Input() label = '添加/修改成员';
  form: FormGroup;
  items: User[] = [];
  memberResults$: Observable<User[]>;

  private propagateChange = (_: any) => {
  }

  constructor(private fb: FormBuilder, private service: UserService) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      memberSearch: ['']
    });
    this.memberResults$ = this.form.get('memberSearch').valueChanges
      .debounceTime(300)
      .distinctUntilChanged()
      .filter(s => s.length > 1)
      .switchMap(str => this.service.searchUsers(str));
  }

  writeValue(obj: any): void {
    if (obj && this.multiple) {
      const userEntities = obj.reduce((e, c) => ({...e, c}), {});
      if (this.items) {
        const remaining = this.items.filter(item => !userEntities[item.id]);
        this.items = [...remaining, ...obj];
      }
    } else if (obj && !this.multiple) {
      this.items = [...obj];
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  validate(c: FormControl): { [key: string]: any } {
    return this.items ? null : {
      chipListInvalid: true
    };
  }

  removeMember(member) {
    const ids = this.items.map(item => item.id);
    const i = ids.indexOf(member.id);
    if (this.multiple) {
        this.items = [...this.items.slice(0, i), ...this.items.slice(i + 1)];
    } else {
      this.items = [];
    }
    this.form.patchValue({memberSearch: ''});
    this.propagateChange(this.items);
  }

  handleMemberSelection(member: User) {
    if (this.items.map(item => item.id).indexOf(member.id) !== -1) {
        return;
    }
    this.items = this.multiple ? [...this.items, member] : [member];
    this.form.patchValue({memberSearch: member.name});
    this.propagateChange(this.items);
  }

  displayUser(user: User): string {
    return user ? user.name : '';
  }

  get displayInput() {
    return this.multiple || this.items.length === 0;
  }
}

#project-list.component.ts
  launchInviteDialog() {
    const dialogRef = this.dialog.open(InviteComponent, {data: {members: []}});
  }

# invite.component.html
<form #f="ngForm" (ngSubmit)="onSubmit($event, f)">
  <h3 mat-dialog-title>邀请组员</h3>
  <div mat-dialog-content>
    <app-chips-list label="邀请成员" name="members" [(ngModel)]="members"></app-chips-list>
  </div>
  <mat-dialog-actions>
    <button type="submit" mat-raised-button color="primary" [disabled]="!f.valid">保存</button>
    <button type="button" mat-button [mat-dialog-close]>关闭</button>
  </mat-dialog-actions>
</form>
# invite.component.ts
export class InviteComponent implements OnInit {
  members: User[] = [];
  constructor(@Inject(MAT_DIALOG_DATA) private data,
              private dialogRef: MatDialogRef<InviteComponent>) {
  }

  ngOnInit() {this.members = [...this.data.members]; }

  onSubmit(ev: Event, {valid, value}) {
    ev.preventDefault();
    if (!valid) {return; }
    this.dialogRef.close(this.members);
  }
}

```

## 6-6 Observable 的冷和热以及 Subject

Observable 的冷和热

热---所有的观察者得到的都是最新的值。订阅者进来的时候和是什么就发送什么，和其他订阅者时间一样。

冷---新的订阅者进来都是从头开始的序列。

### Subject

Subject 即是 Observer 又是 Observable

ReplaySubject 只留最新的N个值

BehaviorSubject 保留最新的一个值。

### Angular 中的 Rx 支持

大师内置 Observable 支持：如 Http, ReactiveForms, Route 等待实例化后指向它。

Async Pipe 是什么？ 有什么用？ (可直接使用 Observable，而且不用取消订阅)

### 冷和热

冷-点播

```typescript
const count$ = Rx.Observable.interval(1000);

const sub1 = count$.subscribe(val => console.log(val));

setTimeout(function(){
  const sub2 = count$.subscribe(val => console.log(val))
}, 2000)
```

热-直播
`const count$ = Rx.Observable.interval(1000).share();`

改为 subscribe
```typescript
const counter$ = Rx.Observable.interval(1000).take(5);

const subject = new Rx.Subject();

const observer1 = {
  next: (val) => console.log('1: ' + val),
  error: (err) => console.error('ERROR>> 1:' + err),
  complete: () => console.log('1 is complete')
}

const observer2 = {
  next: (val) => console.log('2: ' + val),
  error: (err) => console.error('ERROR>> 2:' + err),
  complete: () => console.log('2 is complete')
}

// counter$.subscribe(val => console.log(val))
// 上下是相等的
counter$.subscribe(observer1);

setTimeout(function() {
  counter$.subscribe(observer2);
}, 2000);
```

需要在2处执行，但有很多情况，是我们定义好在应该的时间触发，所有的序列都这么执行。这种情况要用 subject
```typescript
subject.subscribe(observer1);

setTimeout(function() {
  subject.subscribe(observer2);
}, 2000);

counter$.subscribe(subject);
```
这样就用一句执行了2个observerable

```typescript
subject.next(10);
subject.next(11);

subject.subscribe(observer1);
counter$.subscribe(subject);

```
10 11并没有反应。因为还没开始订阅

```typescript
subject.subscribe(observer1);
subject.next(10);
subject.next(11);

setTimeout(function() {
  subject.subscribe(observer2);
}, 2000);

counter$.subscribe(subject);
```
第二个流没有反应，10 11已经过去了，所以它是热的流。

#### ReplaySubject 进行重复播放

```typescript
const counter$ = Rx.Observable.interval(1000).take(5);

const subject = new Rx.ReplaySubject(2);
subject.next(10);
subject.next(11);
...
counter$.subscribe(subject);
```
第一个流 播出了 10 11， 第二个流播出了 0 11
```typescript
"1: 0"
"1: 10"
"1: 11"
"1: 0" 我们重播2个值，已经有0了，再播一个值 只播了11
"2: 11"
```

#### BehaviorSubject 只播放最新的值

```typescript
const subject = new Rx.BehaviorSubject();
subject.next(10);
subject.next(11);
...
counter$.subscribe(subject);

"1: 11" 最新值是11，所以播出来11
"1: 0"
"2: 0"
"1: 1"
"2: 1"
```

__之前 drag and drop service__， 用到 BehaviorSubject

开始拖的时候 `setDragData(data: DragData) {this._dragData.next(data); }`

在流新增一个元素，放的时候，`getDragData(): Observable<DragData> {return this._dragData.asObservable(); }` 会得到这个 Observable 取到最新的值。
  
clear时怎么办？把null放进来。其他的地方误接收时会收到 null 没有数据。

### Async Pipe

正常要 subscribe, 并在 {} 传递 objects， 然后在 ondestroy中取消订阅。

现在直接定义流， name$ ，在 html中 item | async 使用。

## 6-7 实战身份验证控件和地址选择控件(上)

证件类型，证件号码。 不同的证件类型有不同的校验。省市区联动。最后填上街道。。

联动都放在表单中处理，会变得非常复杂。表单只关心你选的值，不关心校验。

分成3个组件比较简单。

```typescript
ng g c shared/identity-input -spec false
ng g c shared/area-list -spec false
```

## 6-8 实战身份验证控件和地址选择控件(中)
```typescript
#area-list.component.css
.street {flex: 1 1 100%; }

.address-group {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: space-between;
}

#area-list.component.html
<div class="address-group">
  <div>
    <mat-select
      placeholder="请输入省份"
      [(ngModel)]="_address.province"
      (change)="onProvinceChange()">
      <mat-option *ngFor="let p of provinces$ | async" [value]="p">{{p}}</mat-option>
    </mat-select>
  </div>
  <div>
    <mat-select
      placeholder="请输入城市"
      [(ngModel)]="_address.city"
      (change)="onCityChange()">
      <mat-option *ngFor="let c of cities$ | async" [value]="c">
        {{c}}
      </mat-option>
    </mat-select>
  </div>
  <div>
    <mat-select
      placeholder="请输入区县"
      [(ngModel)]="_address.district"
      (change)="onDistrictChange()">
      <mat-option *ngFor="let d of districts$ | async" [value]="d">
        {{d}}
    </mat-option>
    </mat-select>
  </div>
  <div class="street">
    <mat-input-container class="full-width">
      <input type="text" matInput placeholder="请输入街道地址" [(ngModel)]="_address.street" (change)="onStreetChange()">
    </mat-input-container>
  </div>
</div>

#area-list.component.ts
@Component({
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AreaListComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AreaListComponent),
      multi: true
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AreaListComponent implements ControlValueAccessor, OnInit, OnDestroy {
  _address: Address = {
    province: '',
    city: '',
    district: '',
    street: '',
  };
  _province = new Subject();
  _city = new Subject();
  _district = new Subject();
  _street = new Subject();
  provinces$: Observable<string[]>;
  cities$: Observable<string[]>;
  districts$: Observable<string[]>;

  sub: Subscription;

  private propagateChange = (_: any) => {};

  writeValue(obj: Address): void {
    if (obj) {
        this._address = obj;
        if (this._address.province) {this._province.next(this._address.province); }
        if (this._address.city) {this._city.next(this._address.city); }
        if (this._address.district) {this._district.next(this._address.district); }
        if (this._address.street) {this._street.next(this._address.street); }
    }
  }

  registerOnChange(fn: any): void {this.propagateChange = fn; }
  registerOnTouched(fn: any): void {}

  ngOnInit(): void {
    const province$ = this._province.asObservable().startWith('');
    const city$ = this._city.asObservable().startWith('');
    const district$ = this._district.asObservable().startWith('');
    const street$ = this._street.asObservable().startWith('');
    const val$ = Observable.combineLatest([province$, city$, district$, street$], (_p, _c, _d, _s) => {
      return  {
        province: _p,
        city: _c,
        district: _d,
        street: _s
      };
    });
  this.sub = val$.subscribe(v => {
    this.propagateChange(v);
  });
  this.provinces$ = Observable.of(getProvinces());
  this.cities$ = province$.map((p: string) => getCitiesByProvince(p));
  this.districts$ = Observable.combineLatest(province$, city$, (p: string, c: string) => getAreaByCity(p, c));
  }

  ngOnDestroy(): void {
    if (this.sub) {
        this.sub.unsubscribe();
    }
  }

  validate(c: FormControl): { [key: string]: any } {
    const val = c.value;
    if (!val) {
      return null;
    }
    if (val.province && val.city && val.district && val.street) {
        return null;
    }
    return  {
      addressInvalid: true
    };
  }

  onProvinceChange() {
    this._province.next(this._address.province);
  }

  onCityChange() {
    this._city.next(this._address.city);
  }

  onDistrictChange() {
    this._district.next(this._address.district);
  }

  onStreetChange() {
    this._street.next(this._address.street);
  }


}

#identity-input.component.html
<div>
  <mat-select placeholder="证件类型" (change)="onIdTypeChange($event.vallue)" [(ngModel)]="identity.identityType">
    <mat-option *ngFor="let type of identityTypes" [value]="type.value">{{type.label}}</mat-option>
  </mat-select>
</div>
<div class="id-input">
  <mat-input-container class="full-width">
    <input matInput type="text" placeholder="证件号码" (change)="onIdNoChange($event.target.value)" [(ngModel)]="identity.identityNo">
    <mat-error>证件号码输入有误</mat-error>
  </mat-input-container>
</div>

#identity-input.component.ts
@Component({
  selector: 'app-identity-input',
  templateUrl: './identity-input.component.html',
  styleUrls: ['./identity-input.component.css'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => IdentityInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => IdentityInputComponent),
      multi: true
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class IdentityInputComponent implements ControlValueAccessor, OnInit, OnDestroy {

  identityTypes = [
    {value: IdentityType.IdCard, label: '身份证'},
    {value: IdentityType.Insurance, label: '医保'},
    {value: IdentityType.Passport, label: '护照'},
    {value: IdentityType.Military, label: '军官证'},
    {value: IdentityType.Other, label: '其他'},
  ];
  identity: Identity = {identityType: null, identityNo: null};

  private _idType = new Subject<IdentityType>();
  private _idNo = new Subject<string>();
  private propagateChange = (_: any) => {};
  private sub: Subscription;

  writeValue(obj: any): void {if (obj) {this.identity = obj; } }

  registerOnChange(fn: any): void {this.propagateChange = fn; }
  registerOnTouched(fn: any): void {}

  ngOnInit(): void {
    const val$ = Observable.combineLatest(this.idNo, this.idType, (_no, _type) => {
      return {
        identityType: _type,
        identityNo: _no,
      };
    });
    this.sub = val$.subscribe(id => this.propagateChange(id));
  }

  ngOnDestroy(): void {if (this.sub) {this.sub.unsubscribe(); } }


  onIdTypeChange(idType: IdentityType) {this._idType.next(idType); }

  onIdNoChange(idNo: string) {this._idNo.next(idNo); }

  get idType(): Observable<IdentityType> {return this._idType.asObservable(); }

  get idNo(): Observable<string> {return this._idNo.asObservable(); }

  validate(c: FormControl): { [key: string]: any } {
    const val = c.value;
    if (!val) {return null; }
    switch (val.identityType) {
      case IdentityType.IdCard: {return this.validateIdCard(c); }
      case IdentityType.Passport: {return this.validatePassport(c); }
      case IdentityType.Military: {return this.validateMilitary(c); }
      case IdentityType.Insurance:
        return null;
      default: {
        return null;
      }

    }
  }
  private validateIdCard(c: FormControl): { [key: string]: any } {
    const val = c.value.identityNo;
    if (val.length !== 18) {
      return {idInvalid: true};
    }
    const patter  = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    return patter.test(val) ? null : {idNotValid: true};
  }

   private validatePassport(c: FormControl): { [key: string]: any } {
    const val = c.value.identityNo;
    if (val.length !== 9) {
      return {idInvalid: true};
    }
    const patter  = /^[GgEe]\d{8}$/;
    return patter.test(val) ? null : {idNotValid: true};
  }

   private validateMilitary(c: FormControl): { [key: string]: any } {
    const val = c.value.identityNo;
    const patter  = /[\u4e00-\u9fa5](字第)(\d{4,8})(号?)$/;
    return patter.test(val) ? null : {idNotValid: true};
  }
}
# area.util.ts
import {city_data} from './area.data';

export const getProvinces = () => {
  const provinces = [];
  for (const province in city_data) {
    provinces.push(province);
  }
  return provinces;
}

export const getCitiesByProvince = (province: string) => {
  if (!province || !city_data[province]) {
      return [];
  }
  const cities = [];
  const val = city_data[province];
  for (const city in val) {
    cities.push(city);
  }
  return cities;
}

export const getAreaByCity = (province: string, city: string) => {
  if (!province || !city_data[province] || !city_data[province][city]) {
    return [];
  }
  return city_data[province][city];
}

# identity.util.ts
import {GB2260} from './identity.data';

export const extractInfo = (idNo: string) => {
  const addrPart = idNo.substring(0, 6);
  const birthPart = idNo.substring(6, 14);
  return {
    addrCode: addrPart,
    dateOfBirth: birthPart
  };
};

export const isValidAddr = (addr: string) => {
  return GB2260[addr] !== undefined;
};

export const getAddrByCode = (code: string) => {
  const province = GB2260[code.substring(0, 2) + '0000'];
  const city = GB2260[code.substring(0, 4) + '00'].replace(province, '');
  const district = GB2260[code].replace(province + city, '');
  return {
    province: province,
    city: city,
    district: district
  };
}


```
# 第7章 使用 Redux 管理应用状态
## 7-1 Redux 的概念和实战(一)

__Redux是什么__

Redux 是一个状态的集中管理机制。全局的、唯一的、不可改变的内存状态【数据库】

不可改变--不会改变自己原有状态，每次会返回一个全新的状态。

状态：影响到UI变化的数据。

Store, Action, Reducer,

多人协作时，另一个人改变了某状态而没考虑你的业务逻辑导致了bug，防止这种情况。使用Redux管理。

__第一个 reducer__。

* reducer 是一个纯函数，可以接收到任何 Action 。
* reducer 不改变状态，只返回新的状态。

npm i --save @ngrx/core@1.2.0 @ngrx/store@2.2.3 @ngrx/router-store@1.2.6 @ngrx/effects@2.0.4 @ngrx/store-devtools@3.2.4


相等的，返回的是新的对象，不是修改的原来的对象。

      return { ...state, quote: action.payload};
      return Object.assign({}, state, {quote: action.payload})

redux 相关的导入方法
```typescript
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {StoreModule} from '@ngrx/store';
import {RouterStoreModule} from '@ngrx/router-store';

@NgModule({
  imports: [
    StoreModule.provideStore(reducer),
    RouterStoreModule.connectRouter(),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
  ],
})

```

ngrx提供了方法合并 reducer

生产和开发的 区别， 不可改变的。
const productionReducers: ActionReducer<State> = combineReducers(reducers);
const developmentReducers: ActionReducer<State> = ...

npm install --save ngrx-store-freeze

使用它时，如果写入原有状态时会报错，在开发环境时希望有这种特性。

compose把前面函数当成后面函数的参数传进去

`const developmentReducers: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);`

先定义全局State，再定义分支State， 全局初始值，每项对应的分支初始值。

reducers 全部包含分支。再combine起来成为全局的reducer。做生产环境和开发环境。再放到storeModule中。

__Code__

```typescript
# quote.action.ts
export const QUOTE = 'Quote';
export const QUOTE_SUCCESS = 'Quote Success';
export const QUOTE_FAILED = 'Failed';

# src/app/reducers/index.ts
import {NgModule} from '@angular/core';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {ActionReducer, combineReducers, StoreModule} from '@ngrx/store';
import {RouterStoreModule} from '@ngrx/router-store';
import * as fromQuote from './quote.reducer';
import {storeFreeze} from 'ngrx-store-freeze';
import {compose} from '@ngrx/core/compose';
import {environment} from '../../environments/environment';

export interface State {
  quote: fromQuote.State;
};

const initialState: State = {
  quote: fromQuote.initialState
};

const reducers = {
  quote: fromQuote.reducer,
};

const productionReducers: ActionReducer<State> = combineReducers(reducers);
const developmentReducers: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers);

export function reducer(state = initialState, action: any): State {
  return environment.production ? productionReducers(state, action) : developmentReducers(state, action);
}

@NgModule({
  imports: [
    StoreModule.provideStore(reducer),
    RouterStoreModule.connectRouter(),
    StoreDevtoolsModule.instrumentOnlyWithExtension(),
  ],
})
export class AppStoreModule {}

# quote.reducer.ts
import * as quoteAction from '../actions/quote.action';
export interface State {
  quote: Quote;
};

export const initialState: State = {
  quote: {
    cn: '慧妍',
    en: 'Aliquam erat volutpat.',
    pic: '/assets/img/quotes/1.jpg'
  }
};

export function reducer(state = initialState, action: {type: string, payload: any}): State {
  switch ( action.type) {
    case quoteAction.QUOTE_SUCCESS: {
      return { ...state, quote: action.payload};
      // return Object.assign({}, state, {quote: action.payload})
    }
    case quoteAction.QUOTE_FAILED:
    default: {
      return state;
    }
  }
}

```

路由改变后发送 `RouterStoreModule.connectRouter(),`

## 7-2 Redux 的概念和实战(二)

没有对值直接进行操作。组件是不关心怎样处理的，只要一个结果。

大家的操作都是有规矩的，统一进行操作，不会直接对状态进行修改。

```typescript
  quote$: Observable<Quote>;

  constructor(private fb: FormBuilder,
              private quoteService$: QuoteService,
              private store$: Store<fromRoot.State>) {
    this.quoteService$.getQuote().subscribe(q => {
      this.quote$ = this.store$.select(state => state.quote.quote)
      this.store$.dispatch({type: actions.QUOTE_SUCCESS, payload: q});
    });
  }
```

把内存数据处理的逻辑从组件中剥离了出来。目前 q 是any，要改造下指定为特定类型。

npm i --save reselect

createSelector(getQuoteState, fromQuote.getQuote);  createSelector可以将多个函数组合。

__使用 reselect 进行状态函数的高阶运算__

reselect: 带【记忆】功能的函数运算，无论多少个参数，最后一个才是用于函数计算，其他的都是它的输入

```typescript
export const getTasksWithOwner = createSelector(getTasks, getUserEntities, 
    (tasks, entities) => {
        return tasks.map(task => {
            const owner = entities[task.ownerId];
            const participants = task.participantIds.map(id => entities[id]);
            return Object.assign({}, task, {owner: owner}, {participants: [...participants]});
        });
    });
```

Code:


```typescript
# quote.action.ts

export const QUOTE = 'Quote';
export const QUOTE_SUCCESS = 'Quote Success';
export const QUOTE_FAILED = 'Failed';

// ng-rx-actions

import {Action} from '@ngrx/store';
import {type} from '../utils/type.util';
import {Quote} from '../domain';

export const ActionTypes = {
  LOAD: type('[Quote] Load'),
  LOAD_SUCCESS: type('[Quote] Load Success'),
  LOAD_FAIL: type('[Quote] Load Fail')
}

export class LoadAction implements Action {
  type = ActionTypes.LOAD;

  constructor(public payload: null) {}
}

export class LoadSucessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;

  constructor(public payload: Quote) {}
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;

  constructor(public payload: string) {}
}

export type Action
  = LoadAction
  | LoadSucessAction
  | LoadFailAction;

# index.ts

import {NgModule} from '@angular/core';
import {StoreDevtoolsModule} from '@ngrx/store-devtools';
import {ActionReducer, combineReducers, compose, StoreModule} from '@ngrx/store';
import {routerReducer, StoreRouterConnectingModule} from '@ngrx/router-store';
import * as fromQuote from './quote.reducer';
import {storeFreeze} from 'ngrx-store-freeze';
import {environment} from '../../environments/environment';
import {createSelector} from 'reselect';
import {Action} from '../actions/quote.action';

export interface State {
  quote: fromQuote.State;
};

const initialState: State = {
  quote: fromQuote.initialState
};

const reducers = {
  quote: fromQuote.reducer,
  router: routerReducer,
};

const productionReducers: ActionReducer<State> = combineReducers(reducers);
const developmentReducers: ActionReducer<State> = compose(storeFreeze, combineReducers)(reducers) as ActionReducer<State, Action>;

export function reducer(state = initialState, action: any): State {
  return environment.production ? productionReducers(state, action) : developmentReducers(state, action);
}

export const getQuoteState = (state: State) => state.quote;

export const getQuote = createSelector(getQuoteState, fromQuote.getQuote);

@NgModule({
  imports: [
    StoreModule.forRoot(reducers),
    StoreRouterConnectingModule.forRoot({
      stateKey: 'router', // name of reducer key
    }),
    StoreDevtoolsModule.instrument({
      maxAge: 25, // Retains last 25 states
      logOnly: environment.production, // Restrict extension to log-only mode
    }),
  ],
})
export class AppStoreModule {}

# quote.reducer.ts
import * as actions from '../actions/quote.action';
import {Quote} from '../domain';

export interface State {
  quote: Quote;
}

export const initialState: State = {
  quote: {
    cn: '慧妍',
    en: 'Aliquam erat volutpat.',
    pic: '/assets/img/quotes/1.jpg'
  }
};

export function reducer(state = initialState, action: actions.Action): State {
  switch (action.type) {
    case actions.ActionTypes.LOAD_SUCCESS: {
      return { ...state, quote: <Quote>action.payload};
      // return Object.assign({}, state, {quote: action.payload})
    }
    case actions.ActionTypes.LOAD_FAIL:
    default: {
      return state;
    }
  }
}

export const getQuote = (state: State) => state.quote;

# type.util.ts
let typeCache: { [label: string]: boolean } = {};
export function type<T>(label: T | ''): T {
  if (typeCache[<string>label]) {
      throw new Error('Action type "label" is not unique');
  }

  typeCache[<string>label] = true;
  return <T>label;
}

```
## 7-3 什么是 Effects

```typescript
npm install @ngrx/effects --save
npm install -g concurrently

```

__什么是 Effiect?__

action 想像为一个流的话，改变的是数据流。不改变数据， 改变外部状态的， 比如

* DOM side effects
* HTTP side effects
* Other side effects

和UI相关的数据处理 为reducer ，UI相关状态之外的改变叫 effects.

```typescript
 
# package.json
    "server": "json-server --watch mock/data.json --port 3000",
    "start": "convurrently \"ng server --port=4200 \" \"npm run server\"",

# index.ts
@NgModule({
  imports: [EffectsModule.forRoot([QuoteEffects])],
})
export class AppEffectsModule {}

# quote.effects.ts
import {Injectable} from '@angular/core';
import {Actions, Effect} from '@ngrx/effects';
import {Observable} from 'rxjs/Observable';
import {Action} from '@ngrx/store';
import * as actions from '../actions/quote.action';
import {QuoteService} from '../services/quote.service';

@Injectable()
export class QuoteEffects {
  @Effect()
  quote$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.LOAD)
    // .map(toPayload)
    .switchMap(_ => this.service$.getQuote()
        .map(data => new actions.LoadSucessAction(data))
        .catch(err =>  Observable.of(new actions.LoadFailAction(JSON.stringify(err)))
      )
  );

  constructor(private actions$: Actions, private service$: QuoteService) {
  }
}

# login.component.ts
  constructor(private fb: FormBuilder,
              private store$: Store<fromRoot.State>) {
    this.quote$ = this.store$.select(fromRoot.getQuote);
    this.store$.dispatch(new actions.LoadAction(null));
  }
```

现在已经不关心真正的逻辑了，只要在关键的时候发出action即可。

在处理完一个逻辑后，发送到另一个逻辑，完成逻辑的拼接。

用了reducer和effects 进一步把程序的逻辑剥离出来了。

## 7-4 实战认证信息流

登录Action: 登录，成功，失败

Code:

```typescript
# auth.action.ts

export const ActionTypes = {
  LOGIN: type('[Auth] Login'),
  LOGIN_SUCCESS: type('[Auth] Login Success'),
  LOGIN_FAIL: type('[Auth] Login Fail'),
  REGISTER: type('[Auth] Register'),
  REGISTER_SUCCESS: type('[Auth] Register Success'),
  REGISTER_FAIL: type('[Auth] Register Fail'),
  LOGOUT: type('[Auth] Logout'),
}

export class LoginAction implements Action {
  type = ActionTypes.LOGIN;
  constructor(public payload: {email: string; password: string}) {}
}

export class LoginSuccessAction implements Action {
  type = ActionTypes.LOGIN_SUCCESS;
  constructor(public payload: Auth) {}
}

export class LoginFailAction implements Action {
  type = ActionTypes.LOGIN_FAIL;
  constructor(public payload: string) {}
}

export class RegisterAction implements Action {
  type = ActionTypes.REGISTER;
  constructor(public payload: {email: string; password: string}) {}
}

export class RegisterSuccessAction implements Action {
  type = ActionTypes.REGISTER_SUCCESS;
  constructor(public payload: Auth) {}
}

export class RegisterFailAction implements Action {
  type = ActionTypes.REGISTER_FAIL;
 constructor(public payload: string) {}
}
export class LogoutAction implements Action {
  type = ActionTypes.LOGOUT;
 constructor(public payload: null) {}
}

export type Actions = LoginAction | LoginSuccessAction | LoginFailAction | RegisterAction | RegisterSuccessAction | RegisterFailAction | LogoutAction;

# quote.action.ts
export const ActionTypes = {
  LOAD: type('[Quote] Load'),
  LOAD_SUCCESS: type('[Quote] Load Success'),
  LOAD_FAIL: type('[Quote] Load Fail')
}

export class LoadAction implements Action {
  type = ActionTypes.LOAD;
 constructor(public payload: null) {}
}

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;
 constructor(public payload: Quote) {}
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;
 constructor(public payload: string) {}
}

export type Actions = LoadAction | LoadSuccessAction | LoadFailAction;
# header.component.html
  <button mat-icon-button (click)="openSidebar()" *ngIf="(auth$ | async)?.token" >
  <span><a mat-button *ngIf="(auth$ | async)?.token" (click)="logout()">退出</a></span>
# header.component.ts
  constructor(private store$: Store<fromRoot.State>) {this.auth$ = this.store$.select(getAuthState); }
  logout() {this.store$.dispatch(new actions.LogoutAction(null)); }

# auth.effects.ts
export class AuthEffects {

  @Effect()
  login$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.LOGIN),
    map((action: LoginAction) => action.payload),
    switchMap(({ email, password }) =>
      this.service$.login(email, password).pipe(
        map(auth => (new actions.LoginSuccessAction(auth))),
        catchError((err) => of(new actions.LoginFailAction(JSON.stringify(err))))))
  );

  @Effect()
  register$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.REGISTER),
    map((action: RegisterAction) => action.payload),
    switchMap((user: User) =>
      this.service$.register(user).pipe(
        map(auth => (new actions.RegisterSuccessAction(auth))),
        catchError((err) => of(new actions.RegisterFailAction(JSON.stringify(err))))))
  );

  @Effect({ dispatch: false })
  logout$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.LOGOUT),
    tap(() => this.router.navigate(['/']))
  );

  @Effect({ dispatch: false })
  loginAndNavigate$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.LOGIN_SUCCESS),
    tap(() => this.router.navigate(['/projects'])));

  @Effect({ dispatch: false })
  registerAndNavigate$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.REGISTER_SUCCESS),
    tap(() => this.router.navigate(['/projects'])));

  constructor(private actions$: Actions, private service$: AuthService, private router: Router ) { }
}
# index.ts
@NgModule({
  imports: [EffectsModule.forFeature([QuoteEffects, AuthEffects, ]) ]
})
export class AppEffectsModule {}

# quote.effects.ts
export class QuoteEffects {

  @Effect()
  quote$: Observable<Action> = this.actions$
    .ofType(actions.ActionTypes.LOAD)
    // .map(toPayload) // this action default is null
    .switchMap(_ => this.service$.getQuote()
        .map(data => new actions.LoadSuccessAction(data))
        .catch(err =>  Observable.of(new actions.LoadFailAction(JSON.stringify(err)))
      )
  );

  constructor(private actions$: Actions, private service$: QuoteService) {}
}

# login.component.ts
  constructor(private fb: FormBuilder, private store$: Store<fromRoot.State>) {
    this.quote$ = this.store$.select(fromRoot.getQuote);
    this.store$.dispatch(new quoteActions.LoadAction(null));
  }
  onSubmit({value, valid}, ev: Event) {... this.store$.dispatch(new authActions.LoginAction(value)); }

# register.component.ts
  onSubmit({value, valid}, ev: Event) {... this.store$.dispatch(new authActions.RegisterAction(value)); }

# auth.reducer.ts
export const initialState: Auth = {};

export function reducer(state = initialState, action: actions.Actions): Auth {
  switch ( action.type) {
    case actions.ActionTypes.REGISTER_SUCCESS:
    case actions.ActionTypes.LOGIN_SUCCESS: {return {...<Auth>action.payload}; }
    case actions.ActionTypes.REGISTER_FAIL:
    case actions.ActionTypes.LOGIN_FAIL: {return initialState; }
    default: {return state; }
  } }

# index.ts
export interface State {quote: fromQuote.State; auth: Auth; };
const initialState: State = {quote: fromQuote.initialState, auth: fromAuth.initialState, };
const reducers = {quote: fromQuote.reducer, auth: fromAuth.reducer, router: fromRouter.routerReducer };

@NgModule({
  imports: [
    StoreModule.forRoot(reducers),
    StoreRouterConnectingModule.forRoot({stateKey: 'router'}),
    StoreDevtoolsModule.instrument({
      maxAge: 25, 
      logOnly: environment.production, 
    }),
    EffectsModule.forRoot([]),
    AppEffectsModule,
  ],
})
export class AppStoreModule {}

# quote.reducer.ts
export const getQuote = (state: State) => state.quote;

# auth-guard.service.ts
export class AuthGuardService implements CanActivate {
  constructor(private store$: Store<fromRoot.State>, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot ): Observable<boolean> {
    return this.store$
      .select(getAuthState)
      .map(auth => {
        const result = auth.token !== null && auth.token !== undefined;
        if (result) {
            this.router.navigate['/login'];
        }
        return result;
      })
      .defaultIfEmpty(false);
  } }
# auth.service.ts
--- delete user.id = null
```

## 7-5 实战项目信息流(上)
```typescript
# project.action.ts
export const ActionTypes = {
  ADD: type('[Project] Add'),
  ADD_SUCCESS: type('[Project] Add Success'),
  ADD_FAIL: type('[Project] Add Fail'),
  UPDATE: type('[Project] Update'),
  UPDATE_SUCCESS: type('[Project] Update Success'),
  UPDATE_FAIL: type('[Project] Update Fail'),
  DELETE: type('[Project] Delete'),
  DELETE_SUCCESS: type('[Project] Delete Success'),
  DELETE_FAIL: type('[Project] Delete Fail'),
  LOAD: type('[Project] Load'),
  LOAD_SUCCESS: type('[Project] Load Success'),
  LOAD_FAIL: type('[Project] Load Fail'),
  INVITE: type('[Project] Invite'),
  INVITE_SUCCESS: type('[Project] Invite Success'),
  INVITE_FAIL: type('[Project] Invite Fail'),
  SELECT_PROJECT: type('[Project] Select Project'),

}
export class AddAction implements Action {
  type = ActionTypes.ADD;
  constructor(public payload: Project) {}
}
export class AddSuccessAction implements Action {
  type = ActionTypes.ADD_SUCCESS;
  constructor(public payload: Project) {}
}
export class AddFailAction implements Action {
  type = ActionTypes.ADD_FAIL;
  constructor(public payload: string) {}
}
export class UpdateAction implements Action {
  type = ActionTypes.UPDATE;
  constructor(public payload: Project) {}
}
export class UpdateSuccessAction implements Action {
  type = ActionTypes.UPDATE_SUCCESS;
  constructor(public payload: Project) {}
}
export class UpdateFailAction implements Action {
  type = ActionTypes.UPDATE_FAIL;
  constructor(public payload: string) {}
}
export class DeleteAction implements Action {
  type = ActionTypes.DELETE;
  constructor(public payload: Project) {}
}
export class DeleteSuccessAction implements Action {
  type = ActionTypes.DELETE_SUCCESS;
  constructor(public payload: Project) {}
}
export class DeleteFailAction implements Action {
  type = ActionTypes.DELETE_FAIL;
  constructor(public payload: string) {}
}
export class LoadAction implements Action {
  type = ActionTypes.LOAD;
  constructor(public payload: null) {}
}
export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;
  constructor(public payload: Project[]) {}
}
export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;
  constructor(public payload: string) {}
}
export class InviteAction implements Action {
  type = ActionTypes.INVITE;
  constructor(public payload: {projectId: string; members: User[]}) {}
}
export class InviteSuccessAction implements Action {
  type = ActionTypes.INVITE_SUCCESS;
  constructor(public payload: Project) {}
}
export class InviteFailAction implements Action {
  type = ActionTypes.INVITE_FAIL;
  constructor(public payload: string) {}
}
export class SelectAction implements Action {
  type = ActionTypes.SELECT_PROJECT;
  constructor(public payload: Project) {}
}

# project.reducer.ts

export interface State {
     ids: string[];
     entities: {[id: string]: Project};
     selectedId: string | null;
};

const initialState: State = {ids: [], entities: {}, selectedId: null, };

const addProject = (state, action) => {
  const project = action.payload;
  if (state.entities[project.id]) {return state; }
  const ids = [...state.ids, project.id];
  const entities = {...state.entities, [project.id]: project};
  return {...state, ids: ids, entities: entities};
};

const updateProject = (state, action) => {
  const project = action.payload;
  const entities = {...state.entities, [project.id]: project};
  return {...state, entities: entities};
}

export function reducer(state = initialState, action: actions.Actions ): State {
  switch (action.type) {
    case actions.ActionTypes.ADD_SUCCESS: {return addProject(state, action); }
    case actions.ActionTypes.DELETE_SUCCESS: {return delProject(state, action); }
    case actions.ActionTypes.UPDATE_SUCCESS: {return updateProject(state, action); }
    case actions.ActionTypes.LOAD_SUCCESS: {return loadProject(state, action); }
    case actions.ActionTypes.SELECT_PROJECT: {return {...state, selectedId: action.payload.id}; }
    default: {return state; }
  }
}

```

## 7-6 实战项目信息流(中)

    npm install -P lodash
    npm install -D @types/lodash

difference 使不一样的会被保留下来

    import * as _ from "lodash";
    const newIds = _.difference(incomingIds, state.ids);

```typescript
# index.ts
import * as fromProjects from './project.reducer';
projects: fromProjects.State;
projects: fromProjects.reducer,
export const getProjectState = (state: State) => state.projects;
export const getProjects = createSelector(getProjectState, fromProjects.getAll);

# project.reducer.ts
const delProject = (state, action) => {
  const project = action.payload;
  const newIds = state.iods.filter(id => id !== project.id);
  const newEntities = newIds.reduce((entities, id: string) => ({...entities, [id]: state.entities[id]}), {});
  return {
    ids: newIds,
    entities: newEntities,
    selectedId: null
  };
}

const loadProjects = (state, action) => {
  const projects = action.payload;
  const incomingIds = projects.map(p => p.id);
  const newIds = _.difference(incomingIds, state.ids);
  const incomingEntities = _.chain(projects)
  .keyBy('id')
  .mapValues(o => o)
  .value();
  const newEntities = newIds.reduce((entities, id: string ) => ({...entities, [id]: incomingEntities[id]}), {});
  return {
    ids: [...state.ids, ...newIds],
    entities: [...state.entities, ...newEntities],
    selectedId: null
  };
}
```
## 7-7 实战项目信息流(下)
ngrx基于rx 的，所有 rx 操作符都可以用。

```typescript
# src/app/effects/index.ts
    EffectsModule.forRoot([... ProjectEffects])

# project.effects.ts
@Injectable()
export class ProjectEffects {

  @Effect()
  loadProjects$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.LOAD),
    map((action: LoadAction) => action.payload),
    withLatestFrom(this.store$.select(fromRoot.getAuthState)),
    switchMap(([_, auth]) => this.service$.get(auth.userId).pipe(
        map(projects => new actions.LoadSuccessAction(projects)),
        catchError((err) => of(new actions.LoadFailAction(JSON.stringify(err))))))
  );

  @Effect()
  addProjects$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.ADD),
    map((action: AddAction) => action.payload),
    withLatestFrom(this.store$.select(fromRoot.getAuthState)),
    switchMap(([project, auth]) => {
      const added = {...project, members: [`${auth.userId}`]};
      return this.service$.add(added).pipe(
        map(auth => new actions.AddSuccessAction(project)),
        catchError((err) => of(new actions.AddFailAction(JSON.stringify(err))))
      );
    })
  );

  @Effect()
  updateProjects$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.UPDATE),
    map((action: UpdateAction) => action.payload),
    switchMap((project) => {
      return this.service$.update(project).pipe(
        map(auth => new actions.UpdateSuccessAction(project)),
        catchError((err) => of(new actions.UpdateFailAction(JSON.stringify(err))))
      );
    })
  );

  @Effect()
  delProjects$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.DELETE),
    map((action: DeleteAction) => action.payload),
    switchMap((project) => {
      console.log(project.id);
      return this.service$.del(project).pipe(
        map(auth => new actions.DeleteSuccessAction(project)),
        catchError((err) => of(new actions.DeleteFailAction(JSON.stringify(err))))
      );
    })
  );

  @Effect({ dispatch: false })
  selectProjects$ = this.actions$.pipe(
    ofType(actions.ActionTypes.SELECT_PROJECT),
    map((action: SelectAction) => action.payload),
    tap((project) => this.router.navigate([`/tasklists/${project.id}`]))
  );

  @Effect()
  invite$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.INVITE),
    map((action: InviteAction) => action.payload),
    switchMap(({projectId, members}) => {
      return this.service$.invite(projectId, members).pipe(
        map(project => (new actions.InviteSuccessAction(project))),
        catchError((err) => of(new actions.InviteFailAction(JSON.stringify(err))))
      );
    })
  );

  constructor(
    private actions$: Actions,
    private store$: Store<fromRoot.State>,
    private service$: ProjectService,
    private router: Router
  ) { }
}

# auth.reducer.ts
    case actions.ActionTypes.LOGIN_SUCCESS: {
      const auth = <Auth>action.payload;
      return {
        ...auth,
        token: auth.token,
        userId: auth.user.id
      };
    }

# src/app/reducers/index.ts

    case actions.ActionTypes.SELECT_PROJECT: {
      const select_actions = action as actions.SelectAction;
      return {...state, selectedId: select_actions.payload.id};
    }
# project.reducer.ts
    case actions.ActionTypes.SELECT_PROJECT: {
      const select_actions = action as actions.SelectAction;
      return {...state, selectedId: select_actions.payload.id};
    }

# project.service.ts    
  invite(projectId: string, users: User[]): Observable<Project> {
    const uri = `${this.config.uri}/${this.domain}/${projectId}`;
    return this.http
    .get(uri)
    .switchMap((project: Project) => {
        const existingMembers = project.members;
        const inviteIds = users.map(user => user.id);
        const newIds = _.union(existingMembers, inviteIds)
      return this.http
        .patch<Project>(uri, JSON.stringify({members: newIds}), {headers: this.headers});
    });
  }
```

## 7-8 实战任务列表信息流

任务列表触发： 点击select时触发， 加载所有的任务列表。

加载出来的集合是查询，有新增，有修改，有删除。有drag&drop。

应用是数据库， reducer是表，构建表的结构。建立 task-list.reducer.ts

后面的建立起来比较方便，复制粘贴，替换即可。

删除一个项目时，应及联删除一个列表，在选择一个项目时，selectedIds也应该被改变。

监听项目的 action. reducer 会接收所有的 action. 

prjActions.ActionTypes.SELECT_PROJECT 这时 payload 携带的是 Project

    const selectedIds = state.ids.filter(id => state.entities[id].projectId === selected.id) 这时state.entities[id]是tasklist，

```typescript
# task-list.action.ts
import { User, TaskList } from '../domain';
import {Action} from '@ngrx/store';
import {type} from '../utils/type.util';

export const ActionTypes = {
  ADD: type('[TaskList] Add'),
  ADD_SUCCESS: type('[TaskList] Add Success'),
  ADD_FAIL: type('[TaskList] Add Fail'),
  UPDATE: type('[TaskList] Update'),
  UPDATE_SUCCESS: type('[TaskList] Update Success'),
  UPDATE_FAIL: type('[TaskList] Update Fail'),
  DELETE: type('[TaskList] Delete'),
  DELETE_SUCCESS: type('[TaskList] Delete Success'),
  DELETE_FAIL: type('[TaskList] Delete Fail'),
  LOAD: type('[TaskList] Load'),
  LOAD_SUCCESS: type('[TaskList] Load Success'),
  LOAD_FAIL: type('[TaskList] Load Fail'),
  SWAP: type('[TaskList] Swap'),
  SWAP_SUCCESS: type('[TaskList] Swap Success'),
  SWAP_FAIL: type('[TaskList] Swap Fail'),
};

export class AddAction implements Action {
  type = ActionTypes.ADD;
  constructor(public payload: TaskList) {}
}

export class AddSuccessAction implements Action {
  type = ActionTypes.ADD_SUCCESS;
  constructor(public payload: TaskList) {}
}

export class AddFailAction implements Action {
  type = ActionTypes.ADD_FAIL;
  constructor(public payload: string) {}
}

export class UpdateAction implements Action {
  type = ActionTypes.UPDATE;
  constructor(public payload: TaskList) {}
}

export class UpdateSuccessAction implements Action {
  type = ActionTypes.UPDATE_SUCCESS;
  constructor(public payload: TaskList) {}
}

export class UpdateFailAction implements Action {
  type = ActionTypes.UPDATE_FAIL;
  constructor(public payload: string) {}
}


export class DeleteAction implements Action {
  type = ActionTypes.DELETE;
  constructor(public payload: TaskList) {}
}

export class DeleteSuccessAction implements Action {
  type = ActionTypes.DELETE_SUCCESS;
  constructor(public payload: TaskList) {}
}

export class DeleteFailAction implements Action {
  type = ActionTypes.DELETE_FAIL;
  constructor(public payload: string) {}
}


export class LoadAction implements Action {
  type = ActionTypes.LOAD;
  constructor(public payload: string) {}
}

export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;
  constructor(public payload: TaskList[]) {}
}

export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;
  constructor(public payload: string) {}
}

export class SwapAction implements Action {
  type = ActionTypes.SWAP;
  constructor(public payload: {src: TaskList; target: TaskList}) {}
}

export class SwapSuccessAction implements Action {
  type = ActionTypes.SWAP_SUCCESS;
  constructor(public payload: TaskList[]) {}
}

export class SwapFailAction implements Action {
  type = ActionTypes.SWAP_FAIL;
  constructor(public payload: string) {}
}

export type Actions = AddAction | AddSuccessAction | AddFailAction | UpdateAction | UpdateSuccessAction | UpdateFailAction | DeleteAction | DeleteSuccessAction | DeleteFailAction | LoadAction | LoadSuccessAction | LoadFailAction | SwapAction | SwapSuccessAction | SwapFailAction;

# project.effects.ts
  @Effect({ dispatch: false })
  loadTaskLists$ = this.actions$.pipe(
    ofType(actions.ActionTypes.SELECT_PROJECT),
    map((action: actions.SelectAction) => action.payload),
    map(project => new listActions.LoadAction(project.id))
  );
  @Effect()
  invite$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.INVITE),
    map((action: actions.InviteAction) => action.payload),
    switchMap(({projectId, members}) => this.service$.invite(projectId, members).pipe(
        map(project => (new actions.InviteSuccessAction(project))),
        catchError((err) => of(new actions.InviteFailAction(JSON.stringify(err))))
    ))
  );
# quote.effects.ts

# task-list.effects.ts
@Injectable()
export class TaskListEffects {

  @Effect()
  loadTaskLists$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.LOAD),
    map((action: actions.LoadAction) => action.payload),
    switchMap(projectId => this.service$.get(projectId).pipe(
        map(taskLists => new actions.LoadSuccessAction(taskLists)),
        catchError((err) => of(new actions.LoadFailAction(JSON.stringify(err))))))
  );

  @Effect()
  addTaskLists$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.ADD),
    map((action: actions.AddAction) => action.payload),
    switchMap(taskList => this.service$.add(taskList).pipe(
        map(tl => new actions.AddSuccessAction(tl)),
        catchError((err) => of(new actions.AddFailAction(JSON.stringify(err))))
    ))
  );

  @Effect()
  updateTaskLists$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.UPDATE),
    map((action: actions.UpdateAction) => action.payload),
    switchMap((taskList) => this.service$.update(taskList).pipe(
        map(tl => new actions.UpdateSuccessAction(tl)),
        catchError((err) => of(new actions.UpdateFailAction(JSON.stringify(err))))
    ))
  );

  @Effect()
  delTaskLists$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.DELETE),
    map((action: actions.DeleteAction) => action.payload),
    switchMap((project) => this.service$.del(project).pipe(
        map(tl => new actions.DeleteSuccessAction(tl)),
        catchError((err) => of(new actions.DeleteFailAction(JSON.stringify(err))))
    ))
  );

  @Effect({ dispatch: false })
  swap$ = this.actions$.pipe(
    ofType(actions.ActionTypes.SWAP),
    map((action: actions.SwapAction) => action.payload),
    switchMap(({src, target}) => this.service$.swapOrder(src, target).pipe(
      map(taskLists => new actions.SwapSuccessAction(taskLists)),
      catchError(err => Observable.of(new actions.SwapFailAction(JSON.stringify(err))))
    ))
  );

  constructor(
    private actions$: Actions,
    private store$: Store<fromRoot.State>,
    private service$: TaskListService,
    private router: Router
  ) { }
}

# task-list.reducer.ts
export interface State {
     ids: string[];
     entities: {[id: string]: TaskList};
     selectedIds: string[];
}

export const initialState: State = {
    ids: [],
    entities: {},
    selectedIds: [],
};

const addTaskList = (state, action) => {
  const taskList = action.payload;
  if (state.entities[taskList.id]) {
    return state;
  }
  const newIds = [...state.ids, taskList.id];
  const newEntities = {...state.entities, [taskList.id]: taskList};
  const newSelectedIds = [...state.selectedIds, taskList.id];
  return {...state, ids: newIds, entities: newEntities, selectedIds: newSelectedIds};
};

const updateTaskList = (state, action) => {
  const taskList = action.payload;
  const newEntities = {...state.entities, [taskList.id]: taskList};
  return {...state, entities: newEntities};
};

const delTaskList = (state, action) => {
  const taskList = action.payload;
  const newIds = state.iods.filter(id => id !== taskList.id);
  const newEntities = newIds.reduce((entities, id: string) => ({...entities, [id]: state.entities[id]}), {});
  const newSelectedIds = state.selectIds.filter(id => id !== taskList.id);
  return {
    ids: newIds,
    entities: newEntities,
    selectedIds: newSelectedIds,
  };
};

const loadTaskLists = (state, action) => {
  const projects = action.payload;
  const incomingIds = projects.map(p => p.id);
  const newIds = _.difference(incomingIds, state.ids);
  const incomingEntities = _.chain(projects)
    .keyBy('id')
    .mapValues(o => o)
    .value();
  const newEntities = newIds.reduce((entities, id: string) => ({ ...entities, [id]: incomingEntities[id] }), {});
  return {
    ids: [...state.ids, ...newIds],
    entities: {...state.entities, ...newEntities},
    selectedIds: incomingIds,
  };
};

const swapTaskLists = (state, action) => {
  const taskList = <TaskList[]>action.payload;
  const updatedEntities = _.chain(taskList)
    .mapValues(o => o)
    .value();
  const newEntities = {...state.entities, ...updatedEntities};
  return {...state, entities: newEntities };
};

const selectPrj = (state, action) => {
  const selected = <Project>action.papload;
  const selectedIds = state.ids.filter(id => state.entities[id].projectId === selected.id);
  return {...state, selectedIds: selectedIds };
};

const delListsByPrj = (state, action) => {
  const project = <Project>action.payload;
  const taskListIds = project.taskLists;
  const remainingIds = _.difference(state.ids, taskListIds);
  const remainingEntities = remainingIds.reduce((entities, id) => ({...entities, [id]: state.entitites}), {});
  return {
    ids: [...remainingIds],
    entities: remainingEntities,
    selectedIds: []
  };
};

export function reducer(state = initialState, action: actions.Actions ): State {
  switch (action.type) {
    case actions.ActionTypes.ADD_SUCCESS: {
      return addTaskList(state, action);
    }
    case actions.ActionTypes.DELETE_SUCCESS: {
      return delTaskList(state, action);
    }
    case actions.ActionTypes.UPDATE_SUCCESS: {
      return updateTaskList(state, action);
    }
    case actions.ActionTypes.LOAD_SUCCESS: {
      return loadTaskLists(state, action);
    }
    case actions.ActionTypes.SWAP_SUCCESS: {
      return swapTaskLists(state, action);
    }
    case prjActions.ActionTypes.SELECT_PROJECT: {
      return selectPrj(state, action);
    }

    case prjActions.ActionTypes.DELETE_SUCCESS: {
      return delListsByPrj(state, action);
    }
    default: {
      return state;
    }
  }
}

export const getIds = (state: State) => state.ids;
export const getEntities = (state: State) => state.entities;
export const getSelectedIds = (state: State) => state.selectedIds;

export const getSelected = createSelector(getSelectedIds, getEntities, (selectedIds, entities) => {
  return selectedIds.map(id => entities[id]);
});

# project-item.component.html
<mat-card (click)="onClick()" >
    <button mat-button type="button" (click)="onEditClick($event)">
    <button mat-button type="button" (click)="onInviteClick($event)">
    <button mat-button type="button" (click)="onDelClick($event)">
# project-item.component.ts  
  @Output() onSelected = new EventEmitter();
  onInviteClick(ev: Event) {
    ev.stopPropagation();
    this.onInvite.emit();
  }
  onEditClick(ev: Event) {
    ev.stopPropagation();
    this.onEdit.emit();
  }
  onDelClick(ev: Event) {
    ev.stopPropagation();
    this.onDel.emit();
  }
  onClick() {
    this.onSelected.emit();
  }

# project-list.component.html
  (onSelected)="selectProject(project)"
# project-list.component.ts
  selectProject(project: Project) {
    this.store$.dispatch(new actions.SelectAction(project));
  }

# src/app/reducers/index.ts
  ...taskLists: fromTaskList.State;
  ...taskLists: fromTaskList.initialState
  ...taskLists: fromTaskList.reducer,
export function logger(reducer: ActionReducer<State>): ActionReducer<State> {
  return function(state: State, action: any): State {
    console.log('state', state);
    console.log('action', action);
    return reducer(state, action);
  };
}
export const metaReducers: MetaReducer<State>[] = !environment.production ? [logger , storeFreeze] : [];
export const getTaskListState = (state: State) => state.taskLists;
export const getTaskLists = createSelector(getTaskListState, fromTaskList.getSelected);
    
@NgModule({
  imports: [
    StoreModule.forRoot(reducers, { metaReducers }),
  ]
})

# new-task-list.component.html
<form [formGroup]="form">
      <input type="text" matInput placeholder="列表名称" formControlName="name">
    <button type="button" mat-raised-button color="primary" (click)="onClick(form)" [disabled]="!form.valid">保存</button>

# new-task-list.component.ts
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) private data,
    private dialogRef: MatDialogRef<NewTaskListComponent>) {
  }
  ngOnInit() {
    this.title = this.data.title;
    this.form = this.fb.group({
      name: [this.data.taskList ? this.data.TaskList : '', Validators.required]
    });
  }
  onClick({value, valid}) {
    if (!valid) {return; }
    this.dialogRef.close(value);
  }

# task-home.component.html
  <app-task-list *ngFor="let list of lists$ | async" class="list-container"
                     (delList)="launchConfirmDialog(list)"
                     (editList)="launchEditListDialog(list)"
<button class="fab-button" mat-fab type="button" (click)="launchNewListDialog($event)">

# task-home.component.ts
  projectId$: Observable<string>;
  lists$: Observable<TaskList[]>;
  constructor(
    private dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private store: Store<fromRoot.State>,
    private route: ActivatedRoute) {
      this.projectId$ = this.route.paramMap.pluck('id');
      this.lists$ = this.store.select(fromRoot.getTaskLists);
    }
  launchConfirmDialog(list: TaskList) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {data: {title: '删除任务列表:', content: '您确认删除该列表么'}});
    dialogRef.afterClosed()
      .take(1)
      .filter(n => n)
      .subscribe(result => this.store.dispatch(new actions.DeleteAction(list)));
  }
  launchEditListDialog(list: TaskList) {
    const dialogRef = this.dialog.open(NewTaskListComponent, {data: {title: '更改列表名称:', taskList: list}});
    dialogRef.afterClosed()
    .take(1)
    .subscribe(result => this.store.dispatch(new actions.UpdateAction({...result, id: list.id})));
}
  launchNewListDialog(ev: Event) {
    const dialogRef = this.dialog.open(NewTaskListComponent, {data: {title: '新建列表:'}});
    dialogRef.afterClosed().subscribe(result => this.store.dispatch(new actions.AddAction(result)));
  }

# task-routing.module.ts
const routes: Routes = [{path: 'tasklists/:id', component: TaskHomeComponent}, ];
```

## 7-9 实战任务 Reducer
task, 增删改查，完成，移动，批量移动 ---- action..

一个action发出后，可能会影响状态，也有可能是先进行effects 回来再影响它的状态。

```typescript
# task.action.ts
export const ActionTypes = {
  ADD: type('[Task] Add'),
  ADD_SUCCESS: type('[Task] Add Success'),
  ADD_FAIL: type('[Task] Add Fail'),
  UPDATE: type('[Task] Update'),
  UPDATE_SUCCESS: type('[Task] Update Success'),
  UPDATE_FAIL: type('[Task] Update Fail'),
  DELETE: type('[Task] Delete'),
  DELETE_SUCCESS: type('[Task] Delete Success'),
  DELETE_FAIL: type('[Task] Delete Fail'),
  LOAD: type('[Task] Load'),
  LOAD_SUCCESS: type('[Task] Load Success'),
  LOAD_FAIL: type('[Task] Load Fail'),
  MOVE: type('[Task] Move'),
  MOVE_SUCCESS: type('[Task] Move Success'),
  MOVE_FAIL: type('[Task] Move Fail'),
  MOVE_ALL: type('[Task] Move All'),
  MOVE_ALL_SUCCESS: type('[Task] Move All Success'),
  MOVE_ALL_FAIL: type('[Task] Move All Fail'),
  COMPLETE: type('[Task] Complete'),
  COMPLETE_SUCCESS: type('[Task] Complete Success'),
  COMPLETE_FAIL: type('[Task] Complete Fail'),
};
export class AddAction implements Action {
  type = ActionTypes.ADD;
  constructor(public payload: Task) {}
}
export class AddSuccessAction implements Action {
  type = ActionTypes.ADD_SUCCESS;
  constructor(public payload: Task) {}
}
export class AddFailAction implements Action {
  type = ActionTypes.ADD_FAIL;
  constructor(public payload: string) {}
}
export class UpdateAction implements Action {
  type = ActionTypes.UPDATE;
  constructor(public payload: Task) {}
}
export class UpdateSuccessAction implements Action {
  type = ActionTypes.UPDATE_SUCCESS;
  constructor(public payload: Task) {}
}
export class UpdateFailAction implements Action {
  type = ActionTypes.UPDATE_FAIL;
  constructor(public payload: string) {}
}
export class DeleteAction implements Action {
  type = ActionTypes.DELETE;
  constructor(public payload: Task) {}
}
export class DeleteSuccessAction implements Action {
  type = ActionTypes.DELETE_SUCCESS;
  constructor(public payload: Task) {}
}
export class DeleteFailAction implements Action {
  type = ActionTypes.DELETE_FAIL;
  constructor(public payload: string) {}
}
export class LoadAction implements Action {
  type = ActionTypes.LOAD;
  constructor(public payload: TaskList[]) {}
}
export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;
  constructor(public payload: Task[]) {}
}
export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;
  constructor(public payload: string) {}
}
export class MoveAction implements Action {
  type = ActionTypes.MOVE;
  constructor(public payload: {taskId: string; taskListId: string}) {}
}
export class MoveSuccessAction implements Action {
  type = ActionTypes.MOVE_SUCCESS;
  constructor(public payload: Task) {}
}
export class MoveFailAction implements Action {
  type = ActionTypes.MOVE_FAIL;
  constructor(public payload: string) {}
}
export class MoveAllAction implements Action {
  type = ActionTypes.MOVE_ALL;
  constructor(public payload: {srcListId: string; targetListId: string}) {}
}
export class MoveAllSuccessAction implements Action {
  type = ActionTypes.MOVE_ALL_SUCCESS;
  constructor(public payload: Task[]) {}
}
export class MoveAllFailAction implements Action {
  type = ActionTypes.MOVE_ALL_FAIL;
  constructor(public payload: string) {}
}
export class CompleteAction implements Action {
  type = ActionTypes.COMPLETE;
  constructor(public payload: Task) {}
}
export class CompleteSuccessAction implements Action {
  type = ActionTypes.COMPLETE_SUCCESS;
  constructor(public payload: Task) {}
}
export class CompleteFailAction implements Action {
  type = ActionTypes.COMPLETE_FAIL;
  constructor(public payload: string) {}
}


export type Actions = AddAction
  | AddSuccessAction | AddFailAction | UpdateAction
  | UpdateSuccessAction | UpdateFailAction | DeleteAction
  | DeleteSuccessAction | DeleteFailAction | LoadAction
  | LoadSuccessAction | LoadFailAction | MoveAction
  | MoveSuccessAction | MoveFailAction | MoveAllAction
  | MoveAllSuccessAction | MoveAllFailAction | CompleteAction
  | CompleteSuccessAction | CompleteFailAction;

# user.action.ts
export interface UserProject {
  user: User;
  projectId: string;
}

export const ActionTypes = {
  ADD:              type('[User] Add User Project'),
  ADD_SUCCESS:      type('[User] Add User Project Success'),
  ADD_FAIL:         type('[User] Add User Project Fail'),
  UPDATE:           type('[User] Update User Project'),
  UPDATE_SUCCESS:   type('[User] Update User Project Success'),
  UPDATE_FAIL:      type('[User] Update User Project Fail'),
  DELETE:           type('[User] Delete User Project'),
  DELETE_SUCCESS:   type('[User] Delete User Project Success'),
  DELETE_FAIL:      type('[User] Delete User Project Fail'),
  LOAD:             type('[User] Load User by Project'),
  LOAD_SUCCESS:     type('[User] Load User by Project Success'),
  LOAD_FAIL:        type('[User] Load User by Project Fail'),
  SEARCH:             type('[User] Search'),
  SEARCH_SUCCESS:     type('[User] Search Success'),
  SEARCH_FAIL:        type('[User] Search Fail'),
};

export class AddAction implements Action {
  type = ActionTypes.ADD;
  constructor(public payload: UserProject) {}
}
export class AddSuccessAction implements Action {
  type = ActionTypes.ADD_SUCCESS;
  constructor(public payload: User) {}
}
export class AddFailAction implements Action {
  type = ActionTypes.ADD_FAIL;
  constructor(public payload: string) {}
}
export class UpdateAction implements Action {
  type = ActionTypes.UPDATE;
  constructor(public payload: Project) {}
}
export class UpdateSuccessAction implements Action {
  type = ActionTypes.UPDATE_SUCCESS;
  constructor(public payload: User[]) {}
}
export class UpdateFailAction implements Action {
  type = ActionTypes.UPDATE_FAIL;
  constructor(public payload: string) {}
}
export class DeleteAction implements Action {
  type = ActionTypes.DELETE;
  constructor(public payload: UserProject) {}
}
export class DeleteSuccessAction implements Action {
  type = ActionTypes.DELETE_SUCCESS;
  constructor(public payload: User) {}
}
export class DeleteFailAction implements Action {
  type = ActionTypes.DELETE_FAIL;
  constructor(public payload: string) {}
}
export class LoadAction implements Action {
  type = ActionTypes.LOAD;
  constructor(public payload: string) {}
}
export class LoadSuccessAction implements Action {
  type = ActionTypes.LOAD_SUCCESS;
  constructor(public payload: User[]) {}
}
export class LoadFailAction implements Action {
  type = ActionTypes.LOAD_FAIL;
  constructor(public payload: string) {}
}
export class SearchAction implements Action {
  type = ActionTypes.SEARCH;
  constructor(public payload: string) {}
}
export class SearchSuccessAction implements Action {
  type = ActionTypes.SEARCH_SUCCESS;
  constructor(public payload: User[]) {}
}
export class SearchFailAction implements Action {
  type = ActionTypes.SEARCH_FAIL;
  constructor(public payload: string) {}
}

export type Actions
  = AddAction
  | AddSuccessAction
  | AddFailAction
  | UpdateAction
  | UpdateSuccessAction
  | UpdateFailAction
  | DeleteAction
  | DeleteSuccessAction
  | DeleteFailAction
  | LoadAction
  | LoadSuccessAction
  | LoadFailAction
  | SearchAction
  | SearchSuccessAction
  | SearchFailAction;

# reducers/index.ts
export interface State {...
  tasks: fromTask.State;
  users: fromUser.State;
}

const initialState: State = {...
  tasks: fromTask.initialState,
  users: fromUser.initialState,
};

const reducers: ActionReducerMap<State> = {...
  tasks: fromTask.reducer,
  users: fromUser.reducer,
};
export const getTaskState = (state: State) => state.tasks;
export const getUserState = (state: State) => state.users;

export const getTasks = createSelector(getTaskState, fromTask.getTasks);
export const getUsers = createSelector(getUserState, fromUser.getUsers);

export const getUserEntities = createSelector(getUserState, fromUser.getEntities);
export const getTasksWithOwners = createSelector(getTasks, getUserEntities, (tasks , userEntities) => {
  return tasks.map(task => {
    return {
      ...task,
    owner: userEntities[task.ownerId],
    participants: task.participantIds.map(id => userEntities[id])
    };
  });
});

export const getTasksByLists = createSelector(getTaskLists, getTasksWithOwners, (lists, tasks) => {
  return lists.map(list => {
    return {
      ...list,
      tasks: tasks.filter(task => task.taskListId === list.id)
    };
  });
});

export const getProjectUsers = (projectId: string) => createSelector(getProjectState, getUserEntities, (state, entities) => {
  return state.entities[projectId].members.map(id => entities[id]);
});

# task.reducer.ts
export interface State {
     ids: string[];
     entities: {[id: string]: Task};
}

export const initialState: State = {
    ids: [],
    entities: {},
};

const addTask = (state, action) => {
  const taskList = action.payload;
  if (state.entities[taskList.id]) {
    return state;
  }
  const newIds = [...state.ids, taskList.id];
  const newEntities = {...state.entities, [taskList.id]: taskList};
  return {...state, ids: newIds, entities: newEntities};
};

const updateTask = (state, action) => {
  const taskList = action.payload;
  const newEntities = {...state.entities, [taskList.id]: taskList};
  return {...state, entities: newEntities};
};

const delTask = (state, action) => {
  const taskList = action.payload;
  const newIds = state.iods.filter(id => id !== taskList.id);
  const newEntities = newIds.reduce((entities, id: string) => ({...entities, [id]: state.entities[id]}), {});
  return {
    ids: newIds,
    entities: newEntities,
  };
};

const loadTasks = (state, action) => {
  const tasks = action.payload;
  const incomingIds = tasks.map(p => p.id);
  const newIds = _.difference(incomingIds, state.ids);
  const incomingEntities = _.chain(tasks)
    .keyBy('id')
    .mapValues(o => o)
    .value();
  const newEntities = newIds.reduce((entities, id: string) => ({ ...entities, [id]: incomingEntities[id] }), {});
  return {
    ids: [...state.ids, ...newIds],
    entities: {...state.entities, ...newEntities},
  };
};

const moveAllTasks = (state, action) => {
  const tasks = <Task[]>action.papload;
  const updatedEntities = tasks.reduce((entities, task) => ({...entities, [task.id]: task}), {});
  return {
    ...state,
    entities: {...state.entities, ...updatedEntities}
  };
};

const delByPrj = (state, action) => {
  const project = <Project>action.payload;
  const taskListIds = project.taskLists;
  const remainingIds = state.ids.filter(id => taskListIds.indexOf(state.entities[id].taskListId) === -1);
  const remainingEntities = remainingIds.reduce((entities, id) => ({...entities, [id]: state.entitites}), {});
  return {
    ids: [...remainingIds],
    entities: remainingEntities,
  };
};

export function reducer(state = initialState, action: actions.Actions ): State {
  switch (action.type) {
    case actions.ActionTypes.ADD_SUCCESS: {
      return addTask(state, action);
    }
    case actions.ActionTypes.DELETE_SUCCESS: {
      return delTask(state, action);
    }
    case actions.ActionTypes.COMPLETE_SUCCESS:
    case actions.ActionTypes.MOVE_SUCCESS:
    case actions.ActionTypes.UPDATE_SUCCESS: {
      return updateTask(state, action);
    }
    case actions.ActionTypes.LOAD_SUCCESS: {
      return loadTasks(state, action);
    }
    case actions.ActionTypes.MOVE_ALL_SUCCESS: {
      return moveAllTasks(state, action);
    }
    case prjActions.ActionTypes.DELETE_SUCCESS: {
      return delByPrj(state, action);
    }
    default: {
      return state;
    }
  }
}

export const getIds = (state: State) => state.ids;
export const getEntities = (state: State) => state.entities;

export const getTasks = createSelector(getIds, getEntities, (ids, entities) => {
  return ids.map(id => entities[id]);
});

# user.reducer.ts
export interface State {
     ids: string[];
     entities: {[id: string]: User};
}

export const initialState: State = {
    ids: [],
    entities: {},
};

const addUser = (state, action) => {
  const user = action.payload;
  const newIds = [...state.ids, user.id];
  const newEntities = { ...state.entities, [user.id]: user };
  return state.entities[user.id] ?
    { ...state, entities: newEntities } : { ...state, ids: newIds, entities: newEntities};
};

const updateUser = (state, action) => {
  const users = <User[]>action.payload;
  const incomingEntities = _.chain(users)
    .keyBy('id')
    .mapValues(o => o)
    .value();
  const newEntities = {...state.entities, ...incomingEntities};
  return {...state, entities: newEntities};
};

const delUser = (state, action) => {
  const user = action.payload;
  const newEntities = { ...state.entities, [user.id]: user };
  return state.entities[user.id] ?
    {...state, entities: newEntities} : state;
};

const loadUsers = (state, action) => {
  const users = action.payload;
  const incomingIds = users.map(p => p.id);
  const newIds = _.difference(incomingIds, state.ids);
  const incomingEntities = _.chain(users)
    .keyBy('id')
    .mapValues(o => o)
    .value();
  const newEntities = newIds.reduce((entities, id: string) => ({ ...entities, [id]: incomingEntities[id] }), {});
  return {
    ids: [...state.ids, ...newIds],
    entities: {...state.entities, ...newEntities},
  };
};

export function reducer(state = initialState, action: actions.Actions ): State {
  switch (action.type) {
    case actions.ActionTypes.ADD_SUCCESS: {
      return addUser(state, action);
    }
    case actions.ActionTypes.DELETE_SUCCESS: {
      return delUser(state, action);
    }
    case actions.ActionTypes.UPDATE_SUCCESS: {
      return updateUser(state, action);
    }
    case actions.ActionTypes.SEARCH_SUCCESS:
    case actions.ActionTypes.LOAD_SUCCESS: {
      return loadUsers(state, action);
    }
    default: {
      return state;
    }
  }
}

export const getIds = (state: State) => state.ids;
export const getEntities = (state: State) => state.entities;

export const getUsers = createSelector(getIds, getEntities, (ids, entities) => {
  return ids.map(id => entities[id]);
});

```
## 7-10 实战任务 Effects

Code:
```typescript
# effects/index.ts
  imports: [EffectsModule.forRoot([...
    TaskListEffects,
    UserEffects,
      TaskEffects
    ])]
# project.effects.ts
  @Effect()
  addProjects$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.ADD),
    map((action: actions.AddAction) => action.payload),
    withLatestFrom(this.store$.select(fromRoot.getAuthState).map(auth => auth.user)), //.debug('auth')),
    switchMap(([project, user]) => {
      const added = {...project, members: [`${user.id}`]};
      return this.service$.add(added).pipe(
        map(prj => new actions.AddSuccessAction(prj)),
        catchError((err) => of(new actions.AddFailAction(JSON.stringify(err))))
      );
    })
  );

  @Effect()
  loadUsers$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.LOAD_SUCCESS),
    map((action: actions.LoadAction) => action.payload),
    switchMap((projects: Project[]) => Observable.from(projects.map(prj => prj.id)).pipe(
        map(projectId => new userActions.LoadAction(projectId))
    ))
  );

  @Effect()
  addUserProject$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.ADD_SUCCESS),
    map((action: actions.AddSuccessAction) => action.payload),
    map(project => project.id),
    withLatestFrom(this.store$.select(fromRoot.getAuthState).map(auth => auth.user), (projectId, user) => {
      return new userActions.AddAction({user: user, projectId: projectId});
    })
  );

  @Effect()
  removeUserProject$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.DELETE_SUCCESS),
    map((action: actions.DeleteSuccessAction) => action.payload),
    map(project => project.id),
    withLatestFrom(this.store$.select(fromRoot.getAuthState).map(auth => auth.user), (projectId, user) => {
      return new userActions.DeleteAction({user: user, projectId: projectId});
    })
  );

  @Effect()
  updateUserProject$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.INVITE_SUCCESS),
    map((action: actions.InviteSuccessAction) => action.payload),
    map(project => new userActions.UpdateAction(project))
  );

# task-list.effects.ts
  @Effect()
  loadTasksInLists$ = this.actions$.pipe(
    ofType(actions.ActionTypes.LOAD),
    map((action: taskActions.LoadAction) => action.payload),
    map(lists => new taskActions.LoadAction(lists))
  );

# task.effects.ts
@Injectable()
export class TaskEffects {

  @Effect()
  loadTasks$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.LOAD),
    map((action: actions.LoadAction) => action.payload),
    switchMap(taskList => this.service$.getByLists(taskList).pipe(
        map(tasks => new actions.LoadSuccessAction(tasks)),
        catchError((err) => of(new actions.LoadFailAction(JSON.stringify(err))))))
  );

  @Effect()
  addTasks$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.ADD),
    map((action: actions.AddAction) => action.payload),
    switchMap(task => this.service$.add(task).pipe(
        map(t => new actions.AddSuccessAction(t)),
        catchError((err) => of(new actions.AddFailAction(JSON.stringify(err))))
    ))
  );

  @Effect()
  updateTasks$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.UPDATE),
    map((action: actions.UpdateAction) => action.payload),
    switchMap((task) => this.service$.update(task).pipe(
        map(t => new actions.UpdateSuccessAction(t)),
        catchError((err) => of(new actions.UpdateFailAction(JSON.stringify(err))))
    ))
  );

  @Effect()
  delTasks$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.DELETE),
    map((action: actions.DeleteAction) => action.payload),
    switchMap((task) => this.service$.del(task).pipe(
        map(t => new actions.DeleteSuccessAction(t)),
        catchError((err) => of(new actions.DeleteFailAction(JSON.stringify(err))))
    ))
  );

  @Effect()
  completeTasks$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.COMPLETE),
    map((action: actions.CompleteAction) => action.payload),
    switchMap((task) => this.service$.complete(task).pipe(
        map(t => new actions.CompleteSuccessAction(t)),
        catchError((err) => of(new actions.CompleteFailAction(JSON.stringify(err))))
    ))
  );

  @Effect()
  move = this.actions$.pipe(
    ofType(actions.ActionTypes.MOVE),
    map((action: actions.MoveAction) => action.payload),
    switchMap(({taskId, taskListId}) => this.service$.move(taskId, taskListId).pipe(
      map(task => new actions.MoveSuccessAction(task)),
      catchError(err => Observable.of(new actions.MoveFailAction(JSON.stringify(err))))
    ))
  );

  @Effect()
  moveAll = this.actions$.pipe(
    ofType(actions.ActionTypes.MOVE_ALL),
    map((action: actions.MoveAllAction) => action.payload),
    switchMap(({srcListId, targetListId}) => this.service$.moveAll(srcListId, targetListId).pipe(
      map(tasks => new actions.MoveAllSuccessAction(tasks)),
      catchError(err => Observable.of(new actions.MoveAllFailAction(JSON.stringify(err))))
    ))
  );

  constructor(
    private actions$: Actions,
    private store$: Store<fromRoot.State>,
    private service$: TaskService,
    private router: Router
  ) { }
}

# user.effects.ts
@Injectable()
export class UserEffects {

  @Effect()
  loadUsers$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.LOAD),
    map((action: actions.LoadAction) => action.payload),
    switchMap(projectId => this.service$.gethUsersByProject(projectId).pipe(
        map(users => new actions.LoadSuccessAction(users)),
        catchError((err) => of(new actions.LoadFailAction(JSON.stringify(err))))))
  );

  @Effect()
  addUserProjectRef$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.ADD),
    map((action: actions.AddAction) => action.payload),
    switchMap(({user, projectId}) => this.service$.addProjectRef(user, projectId).pipe(
        map(u => new actions.AddSuccessAction(u)),
        catchError((err) => of(new actions.AddFailAction(JSON.stringify(err))))
    ))
  );

  @Effect()
  updateUserProjectRef$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.UPDATE),
    map((action: actions.UpdateAction) => action.payload),
    switchMap(project => this.service$.batchUpdateProjectRef(project).pipe(
        map(users => new actions.UpdateSuccessAction(users)),
        catchError((err) => of(new actions.UpdateFailAction(JSON.stringify(err))))
    ))
  );

  @Effect()
  delUserProjectRef$: Observable<Action> = this.actions$.pipe(
    ofType(actions.ActionTypes.DELETE),
    map((action: actions.DeleteAction) => action.payload),
    switchMap(({user, projectId}) => this.service$.removeProjectRef(user, projectId).pipe(
        map(u => new actions.DeleteSuccessAction(u)),
        catchError((err) => of(new actions.DeleteFailAction(JSON.stringify(err))))
    ))
  );

  @Effect()
  search$ = this.actions$.pipe(
    ofType(actions.ActionTypes.SEARCH),
    map((action: actions.SearchAction) => action.payload),
    switchMap(str => this.service$.searchUsers(str).pipe(
      map(taskLists => new actions.SearchSuccessAction(taskLists)),
      catchError(err => Observable.of(new actions.SearchFailAction(JSON.stringify(err))))
    ))
  );

  constructor(
    private actions$: Actions,
    private store$: Store<fromRoot.State>,
    private service$: UserService,
    private router: Router
  ) { }
}
# services.module.ts
import         UserService,
```
## 7-11 实战任务使用 Reducer 和 Effects
invite 改造。给初始值。邀请时不要重复添加

默认当前是执行者


```typescript
# project-list.component.ts
  launchInviteDialog(project: Project) {
    this.store$.select(fromRoot.getProjectUsers(project.id))
      .map(users => this.dialog.open(InviteComponent, {data: {members: [users]}}))
      .switchMap(dialogRef => dialogRef.afterClosed().take(1).filter(n => n))
      .subscribe(val => this.store$.dispatch(new actions.InviteAction({projectId: project.id, members: val})));
  }
# copy-task.component.html
<form [formGroup]="form" (ngSubmit)="onSubmit(form, $event)">
    ...<mat-select placeholder="请选择目标列表" formControlName="targetListId">
      <mat-option *ngFor="let list of lists" [value]="list.id">{{list.name}}</mat-option>
    ...<button type="submit" mat-raised-button color="primary" [disabled]="!form.valid">保存</button>

# copy-task.component.ts
  form: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CopyTaskComponent>
  ) { }
  ngOnInit() {
    this.lists = this.data.lists;
    this.form = this.fb.group({targetListId: [] });
  }

  onSubmit({value, valid}, ev: Event) {
    ev.preventDefault();
    if (!valid) {return; }
    this.dialogRef.close(value.targetListId);
  }
# new-task.component.html
<form [formGroup]="form" (ngSubmit)="onSubmit(form, $event)">
    <input matInput type="text" placeholder="任务内容" formControlName="desc">
    <mat-radio-group formControlName="priority">
    <div class="full-width">
      <app-chips-list label="更改执行者" [multiple]="false" formControlName="owner"></app-chips-list>
    </div>
      <input matInput [matDatepicker]="dueDatepicker" type="text" placeholder="任务截止日期" formControlName="dueDate">
   <div class="full-width">
      <app-chips-list label="更改参与者" [multiple]="false" formControlName="followers"></app-chips-list>
    </div>
      <input matInput [matDatepicker]="reminderDatepicker" type="text" placeholder="提醒日期" formControlName="reminder">
    <textarea matInput placeholder="备注" formControlName="remark"></textarea>
    <button type="submit" mat-raised-button color="primary" [disabled]="!form.valid">保存</button>

# new-task.component.ts
form: FormGroup;
  constructor(
    @Inject(MAT_DIALOG_DATA) private data,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<NewTaskComponent>
  ) { }

  ngOnInit() {
    this.title = this.data.title;
    this.form = this.fb.group({
      desc: [this.data.task ? this.data.task.desc : '', Validators.required],
      priority: [this.data.task ? this.data.task.priority : 3, Validators.required],
      owner: [this.data.task ? [this.data.task.owner] : [this.data.owner]],
      followers: [this.data.task ? [...this.data.task.participants] : []],
      dueDate: [this.data.task ? this.data.task.dueDate : '', ],
      reminder: [this.data.task ? this.data.task.reminder : '', ],
      remark: [this.data.task ? this.data.task.remark : ''],
    });
  }

  onSubmit({value, valid}, ev: Event) {
    ev.preventDefault();
    if (!valid) {
      return;
    }
    this.dialogRef.close({
      ...value,
      ownerId: value.owner.length > 0 ? value.owner[0].id : null,
      participantIds: value.followers.map(f => f.id)
    });
  }
# task-home.component.html
    <app-task-header [header]="list.name"
                     (newTask)="launchNewTaskDialog(list)"
                     (moveAll)="launchCopyTaskDialog(list)"
                     (delList)="launchConfirmDialog(list)"
                     (editList)="launchEditListDialog(list)"
    ></app-task-header>
    <app-quick-task (quickTask)="handleQuickTask($event, list)"></app-quick-task>

# task-home.component.ts
  constructor(...
    private route: ActivatedRoute) {...
      this.lists$ = this.store.select(fromRoot.getTasksByLists);
    }
  launchNewTaskDialog(list) {
    const user$ = this.store.select(fromRoot.getAuthState).map(auth => auth.user);
    user$.take(1)
    .map(user => this.dialog.open(NewTaskComponent, {data: {title: '新建任务:', owner: user}}))
    .switchMap(dialogRef => dialogRef.afterClosed().take(1).filter(n => n))
    .subscribe(val => this.store.dispatch(
      new taskActions.AddAction({...val, taskListId: list.id, completed: false, createDate: new Date()})));
  }
  launchCopyTaskDialog(list) {
    // 传入目标list，排除自己所在的list
    this.lists$.map(l => l.filter(n => n.id !== list.id))
      .map(li => this.dialog.open(CopyTaskComponent, {data: {lists: li}}))
      .switchMap(dialogRef => dialogRef.afterClosed().take(1).filter(n => n))
      .subscribe(val => this.store.dispatch(new taskActions.MoveAllAction({srcListId: list.id, targetListId: val})));
  }
  launchUpdateTaskDialog(task) {
    const dialogRef = this.dialog.open(NewTaskComponent, {width: '250px', data: {title: '修改任务:', task: task}});
    dialogRef.afterClosed()
    .take(1)
    .filter(n => n)
    .subscribe(val => this.store.dispatch(new taskActions.UpdateAction({...task, val})));
  }
  handleQuickTask(desc: string, list) {
    console.log('handle quick task:', desc, list);
    const user$ = this.store.select(fromRoot.getAuthState).map(auth => auth.user);
    user$.take(1).subscribe(user => this.store.dispatch(new taskActions.AddAction({
      desc: desc,
      priority: 3,
      taskListId: list.id,
      ownerId: user.id,
      completed: false,
      createDate: new Date(),
      participantIds: []
    })));
  }

```
# 第8章 Angular 的测试
## 8-1 Angular 测试框架介绍
自动化测试的好处：不会因为修改某个bug进行了重构，导致某个功能就不可用了。不会有回退的现象。

__测试如此简单 __

* 基于Karma和Jasmine的单元测试框架

* 基于Protractor的端到端(e2e)测试框架

* Angular-CLI中提供的测试命令和配置

单元测试---一个函数 或一个类是好用的。输入输出是按期望做的就OK了。

集成测试是需要程序跑起来的才能测试。。

```typescript
describe('测试登录组件：LoginComponent'，()=>
//省略其他
});
```

__测试的基本步骤__

* 命名你的测试包·

* 准备测试环境·

有的测试环境需要前置条件。比如测试UI时，先要将module导入。beforeEach在每个测试里都要把环境搭一下。

* 编写测试用例


```typescript
describe('测试登录组件：LoginComponent'， () => {
    beforeEach(async (() => {
                    TestBed.configureTestingModule({
                            declarations: [LoginComponent],
                            imports: [
                                SharedModule,
                                StoreModule.provideStore(reducer),
                                BrowserAnimationsModule]
                                .compileComponents(); //compile
                            })
                    }))});
```

编写测试用例

```typescript
it('组件模板的元素应该被正确创建'，() => {
    const compiled=fixture.debugElement.nativeElement;
    expect(compiled.querySelector('.card md-card-header md-card-title')
    .innerText).tocontain('登录');
    });
```

expted 期望 x 为 y。

__测试时遇到这样那样的问题__

* Got jasmineRequire is not defined --- 放弃cnpm用原始 npm

* Could not find Angular Material core theme. -- 把karmar的css文件放置进去。

* Observable测试的正确姿势

__实战__

ng g class reducers/auth.reducer --spec true

使用 ng test 进行测试

如果需要 rxjs包在 test.ts中引入 rxjs/Rx 只能在测试中这样做 Rx 包很大。

    import 'rxjs/Rx';

改造 AppCompoennt, 让它通过

TestBed 用测试环境创建组件，得到一个app的实例，应该是一个对象。
```typescript
  it('应该创建应用', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
```

CLI 默认创建一个 app title的测试用例，我们不需要时删除它。

.nativeElement; 渲染之后的DOM节点元素。

karmar 行为驱动的描述语言，像自然语言，适合阅读。

```typescript
# auth.reducer.spec.ts
import { reducer } from './auth.reducer';
import * as fromAuth from './auth.reducer';
import * as actions from '../actions/auth.action';
import { async } from '@angular/core/testing';

describe('测试 AuthReducer', () => {
  describe('未定义Action', () => {
    it('应该返回一个默认状态', async(() => {
      const action = {} as any;
      const result = reducer(undefined, action);
      expect(result).toBeTruthy(fromAuth.initialState);
    }));
  });

  describe('登录成功', () => {
    it('应该返回一个 Err 为 undefined 而 userId 不为空的 Auth 对象', async(() => {
      const action = {
        type: actions.ActionTypes.LOGIN_SUCCESS,
        payload: {
          token: '',
          user: {id: '1', email: 'dev@local.dev'} } 
        } as any;
      const result = reducer(undefined, action);
      expect(result).toBeTruthy(fromAuth.initialState);
    }));
  });

});

# app.component.spec.ts
      imports: [
        MatSidenavModule,
        RouterModule.forRoot([]),
        CoreModule,
      ],
      providers: [ { privide: APP_BASE_HREF, useValue: '/' } ]
# karma.conf.js
    files:[
      { pattern: './src/test.ts', watched: false },
      { pattern: './node_modules/@angular/material/prebuilt-themes/indigo-pink.css' }
    ],
```

## 8-2 单元测试 Service 和 Effects 以及集成测试
测试 Observable , 测试 Http

虚拟一个http环境。测试  effcts.

    ng g s services/auth --spec true

auth.service.ts 中注入了 http 和 BASE_CONFIG ， 我们在测试时也要提供。


__e2e测试__

    ng e2e
  
```typescript

# app.e2e-spec.ts
import { TaskmgrPage } from './app.po';
import { createWriteStream } from 'fs';

function writeScreenShot(data, filename) {
  const stream = createWriteStream(filename);
  stream.write(new Buffer(data, 'base64'));
  stream.end();
}

describe('taskmgr App', () => {
  let page: TaskmgrPage;

  beforeEach(() => {
    page = new TaskmgrPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    page.fillInfo().then(result => writeScreenShot(result, 'sc001.jpg'));
    expect(page.getParagraphText()).toContain('企业协作平台');
  });
});

# app.po.ts
import { browser, by, element } from 'protractor';

export class TaskmgrPage {
  navigateTo() {return browser.get('/'); }

  getParagraphText() {return element(by.css('app-root mat-sidenav-container')).getText(); }

  fillInfo() {
    element(by.id('mat-input-0')).sendKeys('dev');
    element(by.id('mat-input-1')).sendKeys('dev');
    element(by.buttonText('登录')).click();
    return browser.takeScreenshot();
  }
}

# auth.effects.spec.ts
import * as actions from '../actions/auth.action';
import {fakeAsync, TestBed} from '@angular/core/testing';
import {AuthEffects} from './auth.effects';
import {AuthService} from '../services/auth.service';
import {Observable} from 'rxjs/Observable';
import {cold, hot} from 'jasmine-marbles';
import {MyEffects} from './my-effects';


describe('Auth.Effects', () => {
  // let effects: MyEffects;
  // let actions: Observable<any>;
  beforeEach(() => TestBed.configureTestingModule({
    imports: [

    ],
    providers: [
      AuthEffects,
      {
        provide: AuthService,
        useValue: jasmine.createSpyObj('authService', ['login', 'register'])
      }
    ]
  }));
  function setup(methodName: string, params: {returnedAuth: any}) {
    const authService = TestBed.get(AuthService);
    if (params) {
      if (methodName === 'login') {
        authService.login.and.returnValue(params.returnedAuth);
      } else {
        authService.register.and.returnValue(params.returnedAuth);
      }
      return {
        runner: TestBed.get(EffectsRunner),
        authEffects: TestBed.get(AuthEffects)
      };
    }
  }
  it('登录成功发送 SuccessAction', fakeAsync(() => {
    const auth = {
      token: '',
      user: {
        id: '123abc',
        name: 'wang',
        password: '123',
        email: 'wang@163.com'
      }
    };

    const {runner, authEffects} = setup('login', {returnedAuth: Observable.of(auth)});
    const expectedResult = new actions.LoginSuccessAction(auth);
    runner.queue(new actions.LoginAction({email: 'wang@dev.local', password: '123abc'}));
    authEffects.login$.subscribe(_result => expect(_result).toEqual(expectedResult));
  }));
});

# auth.service.spec.ts
import { TestBed, inject } from '@angular/core/testing';

import { AuthService } from './auth.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { User } from '../domain';


describe('AuthService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule]
      providers: [
        {
          provide: 'BASE_CONFIG',
          useValue: {
            uri: 'http://localhost:3000'
          }
        },
        {
          provide: HttpClient,
          useFactory: (mockBackend, options) => {
            return new Http(mockBackend, options);
          }
          deps: [Mockbackend, BaseResponseOptions]
        }
        Mockbackend,
        BaseResponseOptions,
        , AuthService]
    });
  });

  it('注册后应该返回一个 Observable<Auth>', inject([AuthService, Mockbackend ], (service: AuthService) => {
    const mockUser: User = {
      name: 'someuser@dev.local',
      password: '123abc',
      email: 'someuser@dev.local'
    };
    const mockResponse = {
      id: 'obj123abc',
      name: 'someuser@dev.local',
      email: 'someuser@dev.local',
      password: '123abc'
    };
    mockBackend.connections.subscribe(conn => {
      conn.mockResopnse(new Response(new ReponseOptions({
        body: JSON.stringify(mockResponse)
      })));
    });
    service.register(mockUser).subscribe(auth => {
      expect(auth.token).toBeDefined();
      expect(auth.user).toBeDefined();
      expect(auth.user.id).toEqual(mockResponse.id);
    });
  }));
});


```
# 第9章 课程总结

## 9-1 第三方组件的集成和懒加载
日历视图
使用 angular-calendar 组件

```typescript
npm i -P angular-calendar
ng g m my-calendar
ng g c my-calendar/calendar-home -is -it
```


改为 index.ts 缩短导入路径。组织成inline，简化。一般不要超过400行。

懒加载
## 9-2 项目总结

原型构建-组件封装-逻辑抽象-业务剥离

原型构建后， 用 json-server 快速构建模拟后端。

组件封装， 抽离复用部分。

逻辑抽象 越简单越好，因为设计的再好早晚也会过时。

## 文件的组织

目录组织

按角色，按模块，混合形式。

__对象的各种层次__

DomainModel , CacheModel, StateModel, DataModel, ViewModel

DomainModel 在显示时不够用，在视图中可能要使用 ViewModel 多显示一些东西。

## Debug的N种方式

* VScode, WebStorm, Chrome, Log

1. VSCode , install Debugger for Chrome, 端口4200。下断点。 `npm start`

2. WebStorm, run-Edit Configuration - Add Javascript Debug , 设置好端口

3. Chrome Dev Tools , Source - Openfile, app.component.ts 直接设置断点

## 基于 Token 的鉴权
1. Http Post 发送名密码 ， 
2. 服务器端 创建JWT Token 返回给用户， 用户访问的每个请求都会携带 Token
3. 发送受保护的API请求 (在 Authorization Header 中携带 Token)
4. 返回请求数据

## 权限管理
后端负主要责任，前端的权限管理能力并不是很强

__类型__

* ACL -  Access Control List , 例文件系统 ，针对每个对象赋予一个权限
* RBAC - Role Based Access Control

ACL加入Group概念后就=RBAC ，通常意义上ACL针对颗粒度更小。

RBAC 更多基于业务。

__层次__

* API、文件
* 业务
* 可视 前端完成的大部分是可视层次。前端主要是显示或隐藏一些信息。


