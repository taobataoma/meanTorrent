### :orange_book: 用戶等級細則 - %(appConfig.name)s
---
**%(appConfig.name)s** 提供一個 <mark>用戶等級</mark> 系統, 用戶的等級數是由 <mark>用戶積分</mark> 計算而來, 不同的等級會對應不同的訪問許可權，您要提高用戶等級的唯一途徑就是儘可能多的賺取更多的積分.

&emsp;

#### :white_small_square: 如何計算用戶等級?
1. 用戶積分級別數學計算公式為: `sqrt(score number / %(scoreConfig.levelStep)s)`.
1. 級別`1` 需要積分累計: `1 * 1 * %(scoreConfig.levelStep)s`.
1. 級別`2` 需要積分累計: `2 * 2 * %(scoreConfig.levelStep)s`.
1. 級別`3` 需要積分累計: `3 * 3 * %(scoreConfig.levelStep)s`.
1. 級別`4` 需要積分累計: `4 * 4 * %(scoreConfig.levelStep)s`.
1. 級別`x` 需要積分累計: `x * x * %(scoreConfig.levelStep)s`.

&emsp;

#### :white_small_square: 不同的權益於各用戶等級?
_管理組正在制定相關的級別權益，請保持關注，謝謝！_
