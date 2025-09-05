<h1 align="center">TEKLabeler - A ServiceNow IT Asset Management Tool</h1>

*TEKLabeler* is an application used to generate HTML labels to assist with device deployment and provisioning by
utilizing ServiceNow RITM tickets as the primary source of data. These labels contain the items wanted in an order
as requested by the end user.
It features:
- HTML label generation by reading Excel data.
- Customizable filters to handle various data type names dynamically.
- Customizable label word filtering for adding certain words or filters to the label.
- Customizable label features.
- Manual label creation for generation outside of Excel data as needed.

It is powered by Python and React JS.

# Table of Contents

- [License](#license)

# Usage

This application is **only supported on Windows**.

## Installation

The latest release can be found at the [releases page](https://github.com/bobllor/TEKLabeler/releases).

The releases have two files:
1. The executable file.
2. A ZIP file containing the files for the exe. 

To install the executable file:
1. Download the file from the releases page.
2. Install the executable, at the end it will prompt you to launch the application.

The default location it is installed in is `C:\Users\<USERNAME>\AppData\Local\Programs`.

To install the ZIP file:
1. Extract the contents to a folder of your choice.
2. Run `TEKLabeler.exe`.

## Getting Started

WIP

## Updating

To update the application, you can either run the newest installation version via the executable or
replace the files with the contents of the ZIP file.

## Uninstalling

The application is available to uninstall through Windows Programs section.

To uninstall, search for `TEKLabeler` and follow the process.

Remove the files in `C:\Users\<USERNAME>\AppData\Local\Programs\TEKLabeler` afterwards to fully clean up the installation.

For the ZIP file, remove the folder where the contents were extracted.

# License

TEKLabeler is available under the [MIT license](https://opensource.org/license/MIT).