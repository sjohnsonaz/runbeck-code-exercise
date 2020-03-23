# Runbeck Code Exercise

This is a solution to the Code Exercise using React and TypeScript.  Because it is web based, it made sense to create a small RESTful Service to handle the data.  The service is backed by a simple database which stores information on all uploaded files.

The project makes use of several open source libraries I've created.  The service is powered by `sierra`, a simple MVC library.  The client uses `artistry` and `@artistry/react`, which is a full featured style and Component library.

> It is assumed that all files will be CSV or TSV, where there are no embedded commas or tabs inside quotation marks.

## Running the Project

### Prerequisites

1. Install Node.js.  This was tested on version `13.11.0`.
2. Install Typescript globally.  Run `npm install -g typescript`.

### Installation

1. Clone the project into a local folder.
2. Run `npm install`.

### Running

This code contains a RESTful Service, a Single Page Application Client, and a small HTTP Server which will serve all data.  In order to run the project, we must:

1. Build the Service.
2. Build the Client.
3. Run the Service.
4. Run the HTTP Server

For ease of use, there is a single command which does all of this and watches for file changes.

1. Run `npm run watch`.
2. Open and browser and navigate to http://localhost:3001.
3. Example file can be downloaded at http://localhost:3001/example/Example1.txt.

## Exercise Prompt

Write an application (a Console Application is fine) to process a delimited text file. The file will have a header row, then one row per record. The records may be comma-separated or tab-separated. An example file’s contents could be:

    First Name,Middle Name,Last Name
    Jane,Taylor,Doe
    Chris,Lee
    Jose,,Morro

The application should ask the user 3 questions:

1. Where is the file located?
2. Is the file format CSV (comma-separated values) or TSV (tab-separated values)?
3. How many fields should each record contain?

The application should then produce two output files. One file will contain the records (if any) with the correct number of fields. The second will contain the records (if any) with the incorrect number of fields. Neither file should contain the header row. If there are no records for a given output file, do not create the file.

Based on the above sample input, if the user specified a CSV file with 3 fields per record, the following files would be created:
Correctly formatted records:

    Jane,Taylor,Doe
    Jose,,Morro

Incorrectly formatted records:

    Chris,Lee

Post the final source code to your GitHub account and provide the URL.
