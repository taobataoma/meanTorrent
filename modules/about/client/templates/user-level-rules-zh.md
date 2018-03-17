### :orange_book: 用户等级细则详细说明 - %(appConfig.name)s
---
%(appConfig.name)s 提供一个 **用户等级** 系统, 用户的等级数是由 **用户积分** 计算而来, 不同的等级会对应不同的访问权限，您要提高用户等级的唯一途径就是尽可能多的赚取更多的积分.

&emsp;

#### 如何计算用户等级?
1. 用户积分级别数学计算公式为: `sqrt(score number / %(scoreConfig.levelStep)s)`.
1. 级别`1` 需要积分累计: `1 * 1 * %(scoreConfig.levelStep)s`.
1. 级别`2` 需要积分累计: `2 * 2 * %(scoreConfig.levelStep)s`.
1. 级别`3` 需要积分累计: `3 * 3 * %(scoreConfig.levelStep)s`.
1. 级别`4` 需要积分累计: `4 * 4 * %(scoreConfig.levelStep)s`.
1. 级别`x` 需要积分累计: `x * x * %(scoreConfig.levelStep)s`.

&emsp;

#### 如何使用用户等级?
_管理组正在制定相关的级别权益，请保持关注，谢谢！_
