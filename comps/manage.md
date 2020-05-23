---
description: Viewing and managing competition results with s!manage
---

# Managing Results

{% hint style="info" %}
You must have the Manage Messages permission to use this command.
{% endhint %}

## Viewing Submissions

To view submissions for a specific event, run this command:

```
s!manage view <event>
```

This will display all the submissions so far along with a timestamp of the submission. 

## Deleting a Submission

To delete a submission, run this command:

```text
s!manage <event> @entrant | userID | username
```

Make sure the _second command argument_ is a valid user mention, user ID, or an existing username. Keep in mind this action is irreversible, so you will have to confirm you want to delete the times before the action is taken.

## Deleting All Submissions

To delete **all submissions from the competition** use this command:

```text
s!manage reset
```

You will be asked to confirm your decision, as this action is _**irreversible**_. 

