# About this Program

*TEKLabeler* is a application used to generate labels for printing to:

1. Reduce the errors that the computer image deployer may make and streamline the process of imaging devices.
2. Assist the QA team to ensure proper inspection of the devices before packing and sending them out.
3. Allow the receiving end user know what devices to expect, what software they wanted, and their login information.

For details regarding processes and certain sections of the program, click on any of the tabs above. A rundown of all the available tabs:

- *About*: Documentation regarding what the program is and basic stuff to know.
- *Reports*: Documentation regarding the structure of the report/Excel files.
- *Usage*: Documentation regarding how to use the program.
- *Settings*: Documentation regarding the settings menu.
- *Filters*: Documentation regarding how the filtering process works.
- *Labels*: Documentation regarding the label design and its process.

Each documentation tab has a FAQ section that contains questions and their solutions, if applicable.

If there are any bugs or suggestions, please reach out to me on <font color="red">Github @ bobllor</font>.

# Getting Started

Only <u>Excel files (reports)</u> are accepted in this program.

- These files known as "reports" because they are obtained from ServiceNow's report section, and will be referred to as throughout the documentation.

I created a starting report called ***Labels - Production (Improved)***, and can be searched for in the "Reports" section.

- For more information about the overall format of the report, please visit the *Report* documentation tab.
- Feel free to use your own customized report if needed, the program can dynamically handle the columns.

# Shortcuts

I created key shortcuts for quick access to certain parts of the program:

- `Ctrl + F`: Opens the file selector.
- `Ctrl + O`: Opens the settings.
- `Ctrl + H`: Opens the guide documentation.
- `Ctrl + R`: Hard reloads the program. <font color="red">WARNING</font>: This resets the loaded file.

# Basic Guide Navigation

<p align="center">
    <img src="/docs/about-images/guide-basics-key.png" />
</p>

1. Table of Contents
2. Documentation Tabs
3. Main Content

# FAQ

## Will there be support for CSV file types?

At the moment no, but if it goes out well, then yes I can add it. 

The main issue with CSVs on ServiceNow is that the columns are not human readable. It instead uses UUID as its column names, which requires additional logic in handling manual mapping. This just adds more complexity both for the user and me.

This doesn't account for adding it with the existing Excel parsing, which requires more methodical refactors.

On the bright side, I already know how to implement it. But do I want to do the work for it?... nope. The column name mapping customization would be very useful to add however, and that may come up.