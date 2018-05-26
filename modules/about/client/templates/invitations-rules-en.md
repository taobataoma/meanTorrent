### :orange_book: Invitations Rules Detail - %(appConfig.name)s
---
**%(appConfig.name)s** is a private torrents resource sharing platform, so we don't provide access to public registries from outside users, so if you want to join us, you have to go through the following ways：
  * The site may open public registration restrictions for a short period of time or in certain special periods. You can take advantage of the opportunity to quickly register to join.
  * By donating to the site, the site sends you an official invitation, and then registers and joins as a VIP user.
  * When the invitation is not restricted, you can send an invitation letter to your friends and then register to join.

**This rule only explains how to send ordinary invitations to other users and register to join.**

&emsp;

#### :white_small_square: How to send regular invitations

1. If you want to send invitations to your friends, you need to use scores to exchange an invitation before sending it to your friends. Currently exchange an invitation requires `%(inviteConfig.scoreExchange).2f` scores.
1. The invitation has a certain period of validity. If it expires, the invitation will automatically expire, so you should send an invitation letter to your friend before it expires. The current invitation is set to `%(inviteConfig.expires_str)s`.
1. The invitation letter must be sent via email. We may specify or exclude some special email addresses. Please pay attention to the message notifications.
1. If the site closes the invitation sending feature, you will not be able to exchange and send invitations. The current invitation delivery status is:
```javascript
  invite.openInvite: %(inviteConfig.openInvite)s
```
1. If you invite friends, you should help them as much as possible. If their account is forbidden, your account may also be banned. The current related ban is set to:
```javascript
invite.banUserInviter = %(inviteConfig.banUserInviter)s
```
1. If you have made outstanding contributions to the site, the site will occasionally send you a limited number of invitations to reward you for your contribution.
1. At the end of each month, the system will award scores to users who have successfully sent invitations. the score number limit is the percentage `%(scoreConfig.transferToInviter.transRatio)f` of the monthly got of the invited users, the current award function enable status is：
```javascript
scoreConfig.transferToInviter.enable = %(scoreConfig.transferToInviter.enable)s
```

&emsp;

#### :white_small_square: How to register after receiving the invitation

1. If you receive an invitation from a friend, you must click the registered connection address within the `%(inviteConfig.expires_str)s` to complete the registration, otherwise the invitation will expire automatically.
1. The current system only supports email addresses that contain the following domain names to be invited or registere:
```
%(signConfig.emailAllowable[0])s
%(signConfig.emailAllowable[1])s
```
1. After registration is complete, you may need to complete the last account activation by registering the connection address in the email.
1. For new ordinary users who just joined, you may need to understand the [user account rules detail](/about/manual/userAccountRules) and various rules and regulations within the site.