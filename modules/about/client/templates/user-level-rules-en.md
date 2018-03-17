## This is the `USER LEVEL RULES` of %(appConfig.name)s

The rules content is read from template file, it is support `markdown` style.

If you want to change these rules, please modify the .md file at `modules/about/client/templates/user-level-rules-xx.md`.

The `xx` is the language flag, like `zh`,`en` etc.

`sqrt(score number / %(scoreConfig.levelStep)s)`

```javascript
requests: {
      scoreForAddRequest: %(requestsConfig.scoreForAddRequest)d,
      rewardsFormDefaultValue: %(requestsConfig.rewardsFormDefaultValue)d,
      requestExpires: 60 * 60 * 1000 * 24 * 7
    }
```