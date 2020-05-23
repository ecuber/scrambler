---
description: Choose which channels Scrambler commands can be used in.
---

# Ignoring Channels

In the context of this guide, if a channel is ignored, Scrambler commands will not work in that channel. Otherwise, Scrambler commands will work as normal.

{% hint style="info" %}
You need the Manage Server permission to use this command.
{% endhint %}

## Toggling one channel

If the channel is not yet ignored, Scrambler will start ignoring it. If it is already ignored, Scrambler will stop ignoring it

```
s!ignore #channelmention
```

{% hint style="info" %}
You have to _mention_ the channels in order for any of the following commands to work.
{% endhint %}

## Toggling multiple channels

For each of the channels mentioned, the same toggle will occur. If the channel is not ignored, it will be ignored and vice versa.

```text
s!ignore #channel #mentions #go #here
```

## Ignoring all channels except for ones specified

This command ignores every channel on the server except for the ones you mention in the channel. This command will disregard any prior restrictions you've set.

```text
s!ignore all #unignored #channels #here
```

{% hint style="danger" %}
If you do not mention any channels, all of them will be ignored! However, s!ignore works regardless of if the channel is ignored or not.
{% endhint %}

## Resetting all restrictions

This command deletes all channel restrictions you've previously set. Scrambler will work in every channel it has permissions to send messages in.

```text
s!ignore reset
```





