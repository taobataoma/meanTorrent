### :orange_book: 邀請函細則 - %(appConfig.name)s
---
**%(appConfig.name)s** 是一個私有的資源種子共享平臺，一般情況下不向站外用戶提供公開註冊的加入渠道，所以如果您想加入我們，你只有通過以下幾種辦法：
  * 站點可能會在某些特殊時期內短時間開啟公開註冊，您可以看準機會快速註冊加入。
  * 通過向站點捐贈，站點向你傳送官方邀請，然後再行註冊加入並獲得 VIP 用戶身份。
  * 在邀請限制開啟的情況下通過站內的好友向您傳送邀請函，然後再行註冊加入。

本細則只解釋如何向其它用戶傳送普通邀請函並註冊加入。

&emsp;

#### :white_small_square: 如何傳送普通邀請函

1. 如果您想向您的朋友傳送邀請函，您需要先使用站內積分來兌換一張邀請函，然後再傳送給您的朋友，目前兌換一張邀請函需要 `%(inviteConfig.scoreExchange).2f` 積分。
1. 兌換的邀請函有一定的有效期，如果超期，邀請函會自動失效，所以您應該在過期前將邀請函傳送給您的朋友，目前邀請函的有效期設定為 `%(inviteConfig.expires_str)s`。
1. 邀請函必須通過郵件進行傳送，站點可能會指定或排除一些特殊的郵件地址，請注意相關的站內訊息通知。
1. 如果站點關閉邀請傳送功能，您將不能兌換與傳送邀請函，目前的邀請傳送功能狀態為：
```javascript
  invite.openInvite: %(inviteConfig.openInvite)s
```
1. 如果您邀請了朋友，您應該儘可能的向他們提供幫助，如果他們的帳號被禁止，可能導致您的帳號也被禁止，目前連帶禁止功能設定為：
```javascript
invite.banUserInviter = %(inviteConfig.banUserInviter)s
```

&emsp;

#### :white_small_square: 收到邀請函後如何註冊

1. 如果您收到朋友發來的邀請函，您必須在 `%(inviteConfig.expires_str)s` 內點選郵件內的註冊地址完成註冊，否則收到的邀請地址會自動過期。
1. 當前系統僅支援包含下例域名的郵箱地址被邀請或註冊：
```
%(signConfig.emailAllowable[0])s
%(signConfig.emailAllowable[1])s
```
1. 註冊完成後，您可能需要通過註冊郵件內的激活地址完成最後的帳戶啟用操作。
1. 對於剛加入的普通新用戶，您可能需要了解站內的 [用戶帳號細則](/about/manual/userAccountRules) 以及站內的各項規章制度。
