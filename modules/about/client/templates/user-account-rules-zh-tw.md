### :orange_book: 用戶帳號細則 - %(appConfig.name)s
---
**%(appConfig.name)s** 是一個自由分享資源的平臺，獲取我們的帳號並不容易，所以您應該儘可能地熟悉我們的帳號規則，如果您違返了站內規則，您的帳號可能會被禁止而且可能會連累到您的邀請人，一旦帳號被禁止，再次加入就變得異常困難，並珍惜您的帳號。

&emsp;

#### :white_small_square: 註冊帳戶
1. 一般情況下不向站外用戶提供公開註冊的加入渠道，所以如果您想加入我們，你只有通過以下幾種辦法：
  * 站點可能會在某些特殊時期內短時間的開啟公開註冊，您可以看準機會快速註冊加入，當前公開註冊狀態為：
  ```javascript
	sign.openSignup = %(signConfig.openSignup)s
  ```
  * 通過向站點捐贈，站點向你傳送官方邀請，然後再行註冊加入並獲得 VIP 用戶身份，[點這裡開始捐贈](/vip/rules)。
  * 在邀請限制開啟的情況下通過站內的好友向您傳送邀請函，然後再行註冊加入。
  
1. 當您收到邀請郵件時，您可以通過郵件中的註冊地址完成註冊，然後通過帳戶啟用郵件中的地址啟用您的帳戶，邀請郵件的有效期為 `%(inviteConfig.expires_str)s` 小時。
1. 註冊連結與啟用連結的有效期為 `%(signConfig.signUpActiveTokenExpires_str)s` 小時。
1. 當前系統僅支援包含下例域名的郵箱地址被邀請或註冊：
```
%(signConfig.emailAllowable[0])s
%(signConfig.emailAllowable[1])s
```

&emsp;

#### :white_small_square: 使用帳戶

1. 如果您忘記帳戶密碼，您可以通過註冊郵件恢復密碼，但 `%(passwordConfig.resetTimeInterval_str)s` 小時內只能恢復一次，且恢復郵件有效期為 `%(passwordConfig.resetTokenExpires_str)s` 小時。
1. 如果您的帳戶超過 `%(signConfig.idle.accountIdleForTime_str)s` 天未登入網站，**我們不會刪除或禁止您的帳戶，但帳戶狀態會變為 `空閒`**，空閒帳戶可以登入瀏覽，但不能上傳下載任何資源，如您需要重新啟用您的帳戶，您必須使用 `%(signConfig.idle.activeIdleAccountBasicScore).2f` 基礎積分，另外每多空閒一天需多付出 `%(signConfig.idle.activeMoreScorePerDay).2f` 積分，同時每一級需多付出 `%(signConfig.idle.activeMoreScorePerLevel).2f` 積分。
1. 當您的帳戶級別達到 `%(signConfig.idle.notIdleSafeLevel)d` 級時，帳戶會被保護，永遠不會變成 `空閒` 狀態。
1. VIP 用戶帳戶永遠不會變成 `空閒` 狀態。
1. 系統對所有下載行為都有分享率的要求，但對新註冊 `%(announceConfig.downloadCheck.checkAfterSignupDays)d` 天內的用戶不做下載行為的分享率檢查，所以新用戶應該在此時間內儘可能的提高自已的分享率。
1. 如果帳戶的 H&R 黑種警告數過多，您將不能上傳下載任何資源，具體請參考 [H&R 黑種細則](/about/manual/hnrRules)。
1. 請遵守資源區、論壇、聊天室等場所的相關規定，否則您的帳號可能會被封禁。
1. 請保護好您的 <mark>passkey</mark>，如果洩露也可能導致您的帳號被封禁。
1. %(appConfig.name)s 嚴禁將帳號共享使用，如果偵測到登入ip異常或使用行為異常，您的帳號可能會被封禁。
1. 如果您的帳號被禁止，這可能會導致您的邀請者帳號也被禁止，目前的連帶禁止開關設定為：
```javascript
invite.banUserInviter = %(inviteConfig.banUserInviter)s
```

&emsp;

#### :white_small_square: 帳戶考核

1. %(appConfig.name)s 為了維持一個高質量的用戶群體，可能會在特定的時間舉行全站用戶增量考核，考核前會傳送站內訊息通知，並在網站首頁上方位置突出顯示。
1. VIP 用戶、管理用戶、註冊日期 `%(announceConfig.downloadCheck.checkAfterSignupDays)d` 天內的新用戶不會參與考核。
1. 考核期間，您的考核進度會在網站首頁上方突出顯示，不參與考核的用戶是看不到相關考核資訊。
1. 考核結束後，系統會自動對未完成考核的帳戶進行封禁。
