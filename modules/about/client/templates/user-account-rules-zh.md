### :orange_book: 用户帐号细则 - %(appConfig.name)s
---
**%(appConfig.name)s** 是一个自由分享资源的平台，获取我们的帐号并不容易，所以您应该尽可能地熟悉我们的帐号规则，如果您违返了站内规则，您的帐号可能会被禁止而且可能会连累到您的邀请人，一旦帐号被禁止，再次加入就变得异常困难，并珍惜您的帐号。

&emsp;

#### :white_small_square: 注册帐户
1. 一般情况下不向站外用户提供公开注册的加入渠道，所以如果您想加入我们，你只有通过以下几种办法：
  * 站点可能会在某些特殊时期短时间打开公开注册限制，您可以瞅准机会快速注册加入，当前公开注册状态为：
  ```javascript
	sign.openSignup = %(signConfig.openSignup)s
  ```
  * 通过向站点捐赠，站点向你发送官方邀请，然后再行注册加入并获得 VIP 用户身份，[点这里开始捐赠](/vip/rules)。
  * 在邀请限制打开的情况下通过站内的好友向您发送邀请函，然后再行注册加入。
  
1. 当您收到邀请邮件时，您可以通过邮件中的注册连接地址完成注册，然后通过帐户激活邮件中的地址激活您的帐户，邀请邮件的有效期为 `%(inviteConfig.expires_str)s` 小时。
1. 注册连接与激活连接的有效期为 `%(signConfig.signUpActiveTokenExpires_str)s` 小时。
1. 当前系统仅支持包含下例域名的邮箱地址被邀请或注册：
```
%(signConfig.emailAllowable[0])s
%(signConfig.emailAllowable[1])s
```

&emsp;

#### :white_small_square: 使用帐户

1. 如果您忘记帐户密码，您可以通过注册邮件恢复密码，但 `%(passwordConfig.resetTimeInterval_str)s` 小时内只能恢复一次，且恢复邮件有效期为 `%(passwordConfig.resetTokenExpires_str)s` 小时。
1. 如果您的帐户超过 `%(signConfig.idle.accountIdleForTime_str)s` 天未登录网站，**我们不会删除或禁止您的帐户，但帐户状态会变为 `空闲`**，空闲帐户可以登录浏览，但不能上传下载任何资源，如您需要重新激活您的帐户，您必须使用 `%(signConfig.idle.activeIdleAccountBasicScore).2f` 基础积分，另外每多空闲一天需多付出 `%(signConfig.idle.activeMoreScorePerDay).2f` 积分，同时每一级需多付出 `%(signConfig.idle.activeMoreScorePerLevel).2f` 积分。
1. **当您的帐户级别达到 `%(signConfig.idle.notIdleSafeLevel)d` 级时，帐户会被保护，永远不会变成 `空闲` 状态。**
1. 系统对所有下载行为都有分享率的要求，但对新注册 `%(announceConfig.downloadCheck.checkAfterSignupDays)d` 天内的用户不做下载行为的分享率检查，所以新用户应该在此时间内尽可能的提高自已的分享率。
1. 如果帐户的 H&R 黑种警告数过多，您将不能上传下载任何资源，具体请参考 [H&R 黑种细则](/about/manual/hnrRules)。
1. 请遵守资源区、论坛、聊天室等场所的相关规定，否则您的帐号可能会被封禁。
1. 请保护好您的 <mark>passkey</mark>，如果泄露也可能导致您的帐号被封禁。
1. %(appConfig.name)s 严禁将帐号共享使用，如果侦测到登录ip异常或使用行为异常，您的帐号可能会被封禁。
1. 如果您的帐号被禁止，这可能会导致您的邀请者帐号也被禁止，目前的连带禁止开关设置为：
```javascript
invite.banUserInviter = %(inviteConfig.banUserInviter)s
```

&emsp;

#### :white_small_square: 帐户考核

1. %(appConfig.name)s 为了维持一个高质量的用户群体，可能会在特定的时间举行全站用户增量考核，考核前会发送站内消息通知，并在网站首页上方位置突出显示。
1. VIP 用户、管理用户、注册日期 `%(announceConfig.downloadCheck.checkAfterSignupDays)d` 天内的新用户不参与考核。
1. 考核期间，您的考核进度会在网站首页上方突出显示，不参与考核的用户看不到相关考核信息。
1. 考核结束后，系统会自动对未完成考核的帐户进行封禁。