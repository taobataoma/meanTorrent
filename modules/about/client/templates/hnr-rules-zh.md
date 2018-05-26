### :orange_book: H&R 黑种细则 - %(appConfig.name)s
---
**%(appConfig.name)s** 提供一个完备的 <mark>H&R</mark> 系统, 带有<mark>H&R</mark>标识的种子又被用户称为黑种，用户下载黑种时，必须遵循一定的特殊要求，如果操作不当，您会收到警告甚至不能下载上传任何资源。**%(appConfig.name)s** 的黑种规则如下：

&emsp;

1. 当前 <mark>H&R</mark> 黑种功能开启状态为：
```javascript
hnrConfig.enable = %(hnrConfig.enable)s
```
1. 管理员可以随时对任意种子添加或取消 <mark>H&R</mark> 属性。
1. 黑种下载完成后，您不能马上停止上传，必须达到以下任一条件即可：
  * 做种时间达到 `%(hnrConfig.condition.seedTime_str)s`。
  * 上传分享率达到 `%(hnrConfig.condition.ratio).2f`。
1. 系统会在用户上报数据时或每隔 `%(announceConfig.warningCheck.userHnrWarningCheckInterval_str)s` 小时刷新用户的 H&R 警告数，每一个未达到上述做种条件的下载记录将会收到一个警告并同时向用户发送警告生效的通知消息。
1. 当您收到一个警告时，如果种子还处于上传状态，您不用理会它，当达到上述做种条件时，警告会自动消失并同时向您发送警告消失的通知消息。如果您已停止上传，您可以重新打开并开始上传，直到达到上述做种条件且警告自动消失。
1. 当您累计收到 `%(hnrConfig.forbiddenDownloadMinWarningNumber)d` 个警告时，您将不能下载上传除警告种子本身外的任何资源，此时您只能等待警告消失后才能继续下载或上传。
1. 您也可以使用您的积分来消除警告，目前系统设定消除一个警告需要 `%(hnrConfig.scoreToRemoveWarning).2f` 积分。
1. 当前的警告统计个数会在您的帐户菜单中以角标的形式进行提示，同时在 [帐户状态](/status/account) 页中有更详细的警告列表，请多加注意。