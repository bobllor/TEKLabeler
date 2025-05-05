# Usage

## Overview

I created a custom report filter just for this reason, and can be searched by its title **Label - Production Improved**.
- If you need to edit the columns, go ahead. The program does not care what order the columns are in, but you have to put in new filters if you do so.

<font color="red">WARNING</font>: There are FOUR/FIVE* columns that <u>cannot be missing</u> from the report. It does not matter in what order, but it <u>MUST</u> exist somewhere.

- Number (RITM number)
- Full Name (consultant's name)
- Short Description (the main requested item)
- Customer name (the company the consultant works for)

If the **split name** option is enabled, then the "Full Name" column is replaced with two columns- "First Name" and "Last Name". The option can be found in the Settings tab.

- This allows you to use reports with the "First Name" and "Last Name" columns.
- The program will refuse the file if it does not contain the two columns above.

## Usage

There are <u>two ways</u> to use this program:

1. Search the RITM in the search bar, if found then the label will be generated.
2. Click on the card itself, which also generates the label.

After a file is loaded, you will be met with a selection of cards to choose from.

On each card contains the following:

- Ticket number (RITM1234567)
- Red/green bar (red = unused, green = used)
- Item Requested (the main item requested)
- The client's name
- Additional hardware and software requested in the ticket

<br />
<p align="center">
    <img src="/docs/main-images/card-example.png" />
</p>

This can be used to determine which card is associated with what user.

## FAQ

### The program is saying it can't find the ticket!

There are three solutions, ranked from most likely to least likely:

1. *You did not use an updated report*. If you are trying to generate a label from a new ticket, a new report must be re-uploaded to be able to use the newly updated request.
2. *You are using the wrong report*. This can either be due to using a report from the old Service Now, using a wrong report, or the filters are incorrect.*
3. *You are spelling the ticket wrong*. Check the ticket number!

It is possible that I introduced a bug somewhere. Contact me in that case, either through Github, Discord, real life, anything.

*In regards to number 2, I made it flexible so that you can filter out the columns as needed. For more information, please check the SETTINGS documentation.

### I need to create an incident or custom label!

You can either click the navigation bar in the header (INCIDENTS/CUSTOM), to create a ticket manually, or you can type the respective keywords `INC1234567`/`MAN1234567` to trigger the manual input.

For more information on them, visit the MANUAL INPUT documentation.