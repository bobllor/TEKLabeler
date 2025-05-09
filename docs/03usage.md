# Main Usage

A file can be uploaded in four ways:

1. The blue button in the middle.
2. The top left folder in the header bar.
3. The shortcut `Ctrl + F`.
4. Dragging the file the main zone.

<p align="center">
    <img src="/docs/usage-images/file-example.png">
</p>
<p align="center">
    <img src="/docs/usage-images/drag-drop-example.png">
</p>

After loading in the Excel file and having a successful load, you will be greeted with rows of cards as depicted below.

<p align="center">
    <img src="/docs/usage-images/loaded-file-example.png">
</p>

There are <u>two routes</u> to take here:

1. Search the RITM in the search bar. If a RITM is found, then the label is generated.
2. Click on a card, which also generates a label.

Regarding the cards, each one contains the following:

- Ticket number (RITM1234567).
- Red/green bar (red = unused, green = used).
- Item Requested (the main item requested).
- The client's name.
- Additional hardware and software requested in the ticket.

<br />
<p align="center">
    <img src="/docs/usage-images/card-example.png" />
</p>

# Incident and Custom Labels

In the event that a label for an incident is needed, a label for a RITM that does not exist in the Excel, or a custom hardware label, then a <u>manual ticket input</u> is needed.

# FAQ

## The program is saying it can't find the ticket!

These are the three common scenarios, ranked from most likely to least likely:

1. *You did not use an updated report*. If you are trying to generate a label from a new ticket, a new report must be re-uploaded to be able to use the newly updated request.
2. *You are using the wrong report*. This can either be due to using a report from the old Service Now, using a wrong report, or the filters are incorrect.*
3. *You are spelling the ticket wrong*. Check the ticket number!

In any case, <u>manual input via custom label</u> is highly encouraged if the above three solutions did not solve the issue.

It is possible that I introduced a bug somewhere. Contact me in that case, through Github @ bobllor.

*In regards to number 2, I made it flexible so that you can filter out the columns as needed. For more information, please check the *Filters* documentation.