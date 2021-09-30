# GitHub Labels

Simple Icons uses labels extensively to categorize issues and contributions. This document aims to explain the labels as well as define rules around how labels are used.

## Notes

- We list various time windows here. If you need an extension for your contribution, you can indicate the time you need in the issue or Pull Request subject to the time window. If the request is reasonable, the deadlines in this document are applied **after** the deadline you set for yourself.
- If you see an issue or Pull Request that exceeded the time windows listed here, feel free to leave a comment reminding the @simple-icons/maintainers to take action.

## Labels

### Good First Issue

The `good first issue` label is intended to make it easier for newcomers to the project to make a first contributions. Issues with this label are expected to not require too much work, allowing newcomers to get familiar with the contribution process without having to worry too much about technical details.

For the first **14 days** after being assigned to an issue, the issue should not be picked up by existing contributors or maintainers. After that, anyone can work on the issue. The `good first issue` label will remain on the issue until it is picked up by someone.

### Awaiting Reply

The `awaiting reply` label is used to indicate that an issue or Pull Request is blocked by a response from a certain person or group. To avoid waiting for a reply that never comes, we follow the following rules when it comes to taking action in the event that there is no reply.

#### Missing Information

We wait **7 days** after the `awaiting reply` label is assigned to an issue or Pull Request with insufficient information before closing it. The issue or Pull Request can be re-opened after a response has been provided.

#### Third Party

We wait **14 days** after the `awaiting reply` label is assigned to an issue or Pull Request when a third party was asked for feedback before resuming work. If the reply is not directly blocking the work (e.g. asking for clarification about a brand color) then work can proceed. If the reply is blocking the work then we wait an additional **14 days** (28 days total), if there's still no reply than we decide how to proceed on a case-by-case basis.

#### All Other Cases

In all other cases, we wait **14 days** after the `awaiting reply` label is assigned before closing the issue or Pull Request. The issue or Pull Request can be re-opened after a response has been provided.

### Changes Requested

The `changes requested` label indicates that a Pull Request needs to be updated before it can be looked at again. To avoid waiting indefinitely for the contributor to update their contribution, and to give everyone a chance to contribute, we follow the following rules in the event a Pull Request is not updated.

#### Minor Changes

**7 days** after minor changes were requested, anyone can comment on the Pull Request reminding the contributor to update their contribution.

**7 days** after the reminder comment, the Pull Request will be closed and marked as `abandoned`. At this point, the work can be picked up by anyone to make a new contribution (we ask you to give credit to the original contributor).

#### Major Changes

**14 days** after major changes were requested, anyone can comment on the Pull Request reminding the contributor to update their contribution.

**14 days** after the reminder comment, the Pull Request will be closed and marked as `abandoned`. At this point, the work can be picked up by anyone to make a new contribution (we ask you to give credit to the original contributor).
