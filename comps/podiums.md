---
description: Posting your podiums quick n' easy.
---

# Posting Podiums

Posting podiums is extremely straightforward with Scrambler. Once results have been submitted and you're ready to reset the competition, just run the following command:

```
s!podium <optional channel>
```

Scrambler will ask you if you're sure you want to post podiums, as tell you that doing so will delete the submissions from the database.

{% hint style="info" %}
You can specify a channel by its name or by mentioning it, otherwise the default is the channel you called the command in.
{% endhint %}

```text
scrambler: Are you sure you want to post podiums for this competition in this channel?
           Doing so will also delete all results for this competition cycle. Y/N
      you: y
scrambler: podium stuff...
```

After confirming you want to post podiums, Scrambler will post and ping the top 3 solvers in each event you've enabled, and delete the times from the database.



