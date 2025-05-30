# Getting Started

Before the program is usable, an Excel report file must be uploaded with the right columns.

<p align="center">
    <img src="../docs/usage-images/file-example.png">
</p>
<p align="center">
    <img src="../docs/usage-images/drag-drop-example.png">
</p>

A file can be uploaded in four ways:

1. The blue "Choose a file" button in the middle.
2. The top left folder in the header bar.
3. The shortcut `Ctrl + F`.
4. Dragging and dropping the file into the main content zone.

# Main Usage

After successfully loading in the file, you will be greeted with rows of cards in the main content zone as depicted below.

<p align="center">
    <img src="../docs/usage-images/loaded-file-example.png">
</p>

There are <u>two routes</u> to take in order to start generating the labels:
1. *Search for the RITM* in the search bar. If a RITM is found, then the label is generated.
2. *Click on a card* in the generated rows.

The label will be generated and automatically opened in your browser, at which point you can print out the label.

<p align="center">
    <img src="../docs/usage-images/card-example.png" />
</p>

Regarding the cards, each one contains the following:

1. Ticket number (RITM1234567).
2. Item Requested (the main item requested).
3. The client's name.
4. Additional hardware and software requested in the ticket.

There is a red/green bar underneath the ticket number, which indicates if the card has been opened/interacted with.

# Incident and Custom Labels

In the event that a label for an incident is needed, a label for a RITM that does not exist in the Excel, or a custom hardware label, then a <u>manual ticket input</u> is needed.

There are two ways to access either manual input types:
1. Searching a ticket starting with ***INC*** or ***MAN*** will trigger the navigation to the corresponding form page.
2. Clicking on the ***Incidents*** or ***Custom*** buttons to go to the form pages manually.

You *cannot submit empty fields*, outside of the last optional hardware field.

The inputs for both are the exact same, outside of a few things:
- The final generated label is different for both.
- The initial ticket number must start with **INC** for *Incidents* and **RITM** for *Custom*.

<p align="center">
    <img src="../docs/usage-images/manual-incident-image.png" />
</p>

1. ***Number***: The ticket number, this must start with INC or RITM depending on the page you are on.
2. ***Full name***: The full name of the user. Only the first and last names are kept, i.e. keep it <u>two names</u> max.
3. ***Company name***: The company the client is contracted to.
4. ***Hardware***: The client's requested item, this is ***optional*** and does not effect the submission of the form.

# FAQ

## The program is saying it can't find the ticket!

These are the three common scenarios, ranked from most likely to least likely:

1. *You did not use an updated report*. If you are trying to generate a label from a new ticket, a new report must be re-uploaded to be able to use the newly updated request.
2. *You are using the wrong report*. This can either be due to using a report from the old Service Now, using a wrong report, or the filters are incorrect.*
3. *You are spelling the ticket wrong*. Check the ticket number!

In any case, <u>manual input via custom label</u> is highly encouraged if the above three solutions did not solve the issue.
- The *Hardware* field can be used to "simulate" multiple requested items. 
- I made this with the intention of putting a single item on it, but now I realize that you could actually put multiple- with some sort of delimiter/separator of course.

It is possible that I introduced a bug somewhere. Contact me in that case, through Github @ bobllor.

*In regards to number 2, I made it flexible so that you can filter out the columns as needed. For more information, please check the *Filters* documentation.