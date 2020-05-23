---
description: 'Set up Scrambler''s competitions, moderators, and more.'
---

# Configuring Scrambler

{% hint style="info" %}
 You need to have Manage Server permissions or a registered Moderator role to use this command.
{% endhint %}

```text
s!config <view|enable|disable|events|mods|reset>
```

## Scrambler Moderators

Scrambler moderators are able to use s!config, s!comp, s!manage, and s!prefix. Members with the Manage Server permission are also able to use these commands by default.

To add or remove a role to the moderator list, the syntax is as follows:

```text
s!config mods @Moderator @Helper [...]
```

Any roles/role ID's you list will be toggled as Scrambler moderator roles \(i.e. if @Helper was a moderator before, running this command would remove it from the list\). Of course, when using this command replace "Moderator" and "Helper" with existing roles on your server.

### Resetting moderator roles

To delete all saved Scrambler Moderator roles, simply run this command:

```text
s!config mods reset
```

## Enabling/Disabling Competitions

Competitions can easily be enabled or disabled via the s!config command. Syntax self-explanatory and as follows:

```text
s!config <enable|disable>
```

## Setting up events

Scrambler competitions are highly customizable to your server's needs. One basic form of competition customization is selecting which events to have in your server's competitions. 

To toggle competition events on or off, the syntax is as follows: 

```text
s!config events 3bld fmc redi [...]
```

Scrambler has a multitude of events to choose from, so name as many as you'd like! Do note, however, that most events are enabled by default \(with the exception of 2x2x3, ivy cube, 4BLD, 5BLD, and 2BLD\). 

### Resetting event list

Resetting your event list to default is as simple as:

```text
s!config events reset
```

## Reset all settings

To reset all your Scrambler settings to their default values, simply run this command:

```text
s!config reset
```

