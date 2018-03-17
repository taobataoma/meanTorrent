### :orange_book: 用户积分细则详细说明 - %(appConfig.name)s
---
%(appConfig.name)s 提供一个 **用户积分** 系统，用户有很多种获取积分的办法，而且积分也有非常大的用处。用户积分也是计算用户等级的基础，不同的用户等级对应不同的访问权限，[这里可以查看有关用户等级的细则详情](/about/manual/userLevelRules)。

&emsp;

#### 积分增加规则
* 每日签到获得 `%(scoreConfig.checkInEveryDay)d` 积分，连续登记，每天额外增加 `%(scoreConfig.checkInConsday)d` 累计积分。

&emsp;

#### 积分扣除规则
* 重新激活长时间未使用的用户帐户，帐户状态由 **非激活** 变为 **正常**, 扣除 `%(signConfig.activeIdleAccountScore)d` 积分。
* 兑换一张邀请函，需要扣除 `%(inviteConfig.scoreExchange)d` 积分。
* 用户每发布一条请求，系统会自动回收 `%(requestsConfig.scoreForAddRequest)d` 积分，如果请求被回应而且被请求者采纳，系统会自动扣除请求者悬赏的积分。
* 移除一条 H&R 警告，需要扣除 `%(hnrConfig.scoreToRemoveWarning)d` 积分
&emsp;

#### 禁止的行为

&emsp;

#### 违规处罚