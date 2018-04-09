### :orange_book: User Account Rules Detail - %(appConfig.name)s
---
**%(appConfig.name)s** is a private platform for free sharing of resources. It is not easy to obtain our account, so you should be familiar with our account rules as much as possible. If you violate the rules of the site, your account may be banned and may be affecting your inviter, once the account is banned, becomes very difficult to join again and cherish your account.

&emsp;

#### :white_small_square: Sign up
1. Under normal circumstances, users outside the station are not provided with public registration channels. Therefore, if you want to join us, you only have to adopt the following methods:
  * The site may open public registration restrictions for a short period of time or in certain special periods. You can take advantage of the opportunity to quickly register to join. curr open signup status is:
  ```javascript
	sign.openSignup = %(signConfig.openSignup)s
  ```
  * By donating to the site, the site sends you an official invitation, and then registers and joins as a VIP user.，[Donate at here](/vip/rules)。
  * When the invitation is not restricted, you can send an invitation letter to your friends and then register to join.。
  
1. When you receive the invitation email, you can complete the registration through the registered connection address in the email and activate your account with the address in the account activation email. The invitation email is valid for `%(inviteConfig.expires_str)s` hours.
1. Registration and activation connections are valid for `%(signConfig.signUpActiveTokenExpires_str)s` hours.

&emsp;

#### :white_small_square: Use account

1. If you forget your account password, you can recover your password by registering email, but `%(passwordConfig.resetTimeInterval_str)s` can only be recovered once in s hours, and the recovery email is valid for `%(passwordConfig.resetTokenExpires_str)s` hours.
1. If your account exceeds `%(signConfig.accountIdleForTime_str)s` days without signing in to the site,** we will not delete or block your account, but the account status will change to `idle`**, the idle accounts can log in, but You cannot upload or download any resources. If you need to reactivate your account, you must use the `%(signConfig.activeIdleAccountScore).2f` scores.
1. The system has a requirement of sharing rate for all downloading behaviors, but does not check the sharing rate for users who have newly registered `%(announceConfig.downloadCheck.checkAfterSignupDays)d` days, so the new user should be as much as possible during this time. Improve your own share.
1. If your account has too many H&R warnings, you will not be able to upload and download any resources. Please refer to [H&R rules detail](/about/manual/hnrRules)。
1. Please comply with the relevant provisions of the resource area, forums, chat rooms and other places, or your account may be banned.
1. Please protect your <mark>passkey</mark> and if it is disclosed, your account may be banned.
1. %(appConfig.name)s is forbidden to share the account. If abnormal login ip or abnormal usage behavior is detected, your account may be banned.
1. If your account is banned, this may result in the ban of your inviter's account，The current related ban is set to:
```javascript
invite.banUserInviter = %(inviteConfig.banUserInviter)s
```

&emsp;

#### :white_small_square: Account examination

1. %(appConfig.name)s in order to maintain a high-quality user group, it may be possible to hold an incremental examination of the all users at a specific time. Prior to the examination, the station will send a notification of the message and highlight it at the top of the website's home page.
1. VIP users, management users, and days of registration date '%(announceConfig.downloadCheck.checkAfterSignupDays)' do not participate in the examination.
1. During the examination period, your examination progress will be highlighted at the top of the homepage of the website. Users who do not participate in the examination will not be able to see relevant examination information.
1. After the examination is completed, the system will automatically ban the accounts that have not been completed.