### :orange_book: 做種與下載細則 - %(appConfig.name)s
---
**%(appConfig.name)s** 是一個自由分享資源的平臺，請在做種或下載的過程中，遵守如下的規則，否則可能會受到管理組的嚴厲處罰甚至帳號被禁止。

&emsp;

#### :white_small_square: 上傳與下載

1. 系統對所有下載行為都有分享率的要求，當前要求為 `%(announceConfig.downloadCheck.ratio).2f`， 所以在您釋出後，儘可能延長做種的時間，儘可能多的賺取上傳量與積分。
1. 系統對新註冊 `%(announceConfig.downloadCheck.checkAfterSignupDays)d` 天內的使用者不做下載行為的分享率檢查，所以新使用者應該在此時間內儘可能的提高自已的分享率。
1. 不要在未出種的情況下停止做種，如有特殊情況，請在相關種子下留言說明。
1. 如果您下載的是 H&R 黑種，請仔細閱讀 [黑種相關細則](/about/manual/hnrRules)，並及時處理黑種警告。
1. 每使用者每種最多同時允許 `%(announceConfig.announceCheck.maxLeechNumberPerUserPerTorrent)d` 個下載，`%(announceConfig.announceCheck.maxSeedNumberPerUserPerTorrent)d` 個上傳。
1. 系統可能會在某些時候開啟做種資質檢查，即不允許對非本站下載的種子進行保種，當前設定值為：
```javascript
  announce.seedingInFinishedCheck = %(announceConfig.seedingInFinishedCheck)s
```
1. 為減少紅種的情況出現並確保資料被正確統計，請在退出客戶端時先停止所有種子的上傳或下載。

&emsp;

#### :white_small_square: 流量計算與積分統計

1. 種子釋出者按 `%(salesGlobalConfig.uploader.value.Ur).2f` 倍的上傳量計算。
1. 分流者按正常上傳下載量計算。
1. 所有使用者所有種子上傳下載量享有促銷加成，如遇全侷促銷則享有全侷促銷加成。
1. VIP 使用者的上傳下載量以及做種積分享有額外的加成，詳情請參考 [VIP 使用者權益細則](/about/manual/vipRules)。
1. 對做種人數較少（ < `%(scoreConfig.action.seedSeederAndLife.seederCount)d` 人）的種子保種可獲得額外的積分加成。
1. 對發種時間越久的種子保種可獲得更多的積分加成。
1. 對體積越大的種子種子保種可獲得更高的上傳量加成。
1. 更多積分統計細則請參考 [使用者積分細則](/about/manual/scoreRules)。

&emsp;

#### :white_small_square: 訂閱下載

1. %(appConfig.name)s 支援 RSS 訂閱下載，在種子列表頁，系統已經根據您的檢索條件自動生成了 RSS 訂閱地址，您 可以複製此地址並在客戶端中直接使用。
1. 如您需要訂閱多個型別的資源，您需要複製多個地址到您的客戶端。
1. %(appConfig.name)s 支援 IRC 訂閱下載，如果您的客戶端支援 IRC 訂閱，請根據如下配置自行設定：
```javascript
  ircAnnounce.server = %(ircAnnounceConfig.server)s
  ircAnnounce.port = %(ircAnnounceConfig.port)s
  ircAnnounce.channel = %(ircAnnounceConfig.channel)s
  ircAnnounce.anncounceNick = %(ircAnnounceConfig.nick)s
```

&emsp;

#### :white_small_square: 客戶端限制

* %(appConfig.name)s 禁止一些特定的客戶端軟體訪問，點此檢視 [禁止客戶端列表](/about/black)。

&emsp;

#### :white_small_square: 惡意行為的界定與處罰

1. 使用不允許的客戶端或使用不允許的訪問方式進行上傳或下載。
1. 使用第三方工具篡改上報資料。
1. 其它非正常行為上傳或下載。

&emsp;

<span class="text-danger">** 注意：一旦您的行為被界定為惡意行為，您將可能受到非常嚴厲的處罰，具體請參閱 [禁令與處罰細則](/about/manual/forbidRules)**</span>