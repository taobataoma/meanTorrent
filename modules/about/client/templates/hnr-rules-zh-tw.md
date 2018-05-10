### :orange_book: H&R 黑種細則 - %(appConfig.name)s
---
**%(appConfig.name)s** 提供一個完備的 <mark>H&R</mark> 系統, 帶有<mark>H&R</mark>標識的種子又被使用者稱為黑種，使用者下載黑種時，必須遵循一定的特殊要求，如果操作不當，您會收到警告甚至不能下載上傳任何資源。**%(appConfig.name)s** 的黑種規則如下：

&emsp;

1. 管理員可以隨時對任意種子新增或取消 <mark>H&R</mark> 屬性。
1. 黑種下載完成後，您不能馬上停止上傳，必須達到以下任一條件即可：
  * 做種時間達到 `%(hnrConfig.condition.seedTime_str)s`。
  * 上傳分享率達到 `%(hnrConfig.condition.ratio).2f`。
1. 系統會在使用者上報資料時或每隔 `%(announceConfig.warningCheck.userHnrWarningCheckInterval_str)s` 小時重新整理使用者的 H&R 警告數，每一個未達到上述做種條件的下載記錄將會收到一個警告並同時向使用者傳送警告生效的通知訊息。
1. 當您收到一個警告時，如果種子還處於上傳狀態，您不用理會它，當達到上述做種條件時，警告會自動消失並同時向您傳送警告消失的通知訊息。如果您已停止上傳，您可以重新開啟並開始上傳，直到達到上述做種條件且警告自動消失。
1. 當您累計收到 `%(hnrConfig.forbiddenDownloadMinWarningNumber)d` 個警告時，您將不能下載上傳除警告種子本身外的任何資源，此時您只能等待警告消失後才能繼續下載或上傳。
1. 您也可以使用您的積分來消除警告，目前系統設定消除一個警告需要 `%(hnrConfig.scoreToRemoveWarning).2f` 積分。
1. 當前的警告統計個數會在您的帳戶選單中以角標的形式進行提示，同時在 [帳戶狀態](/status/account) 頁中有更詳細的警告列表，請多加註意。