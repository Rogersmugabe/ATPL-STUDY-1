const fs = require("fs");
const path = require("path");

const subjects = [
    "meteorology",
    "airlaw",
    "operational"
];

const dataFolder = path.join(__dirname, "data");

subjects.forEach(function(subject){

    const filePath =
        path.join(
            dataFolder,
            subject + ".json"
        );

    try{

        const rawData =
            fs.readFileSync(
                filePath,
                "utf8"
            );

        const questions =
            JSON.parse(rawData);


        questions.forEach(function(question, index){

            question.id =
                subject +
                "-" +
                String(index + 1).padStart(4, "0");

        });


        fs.writeFileSync(
            filePath,
            JSON.stringify(
                questions,
                null,
                4
            ),
            "utf8"
        );


        console.log(
            "Updated:",
            subject + ".json",
            "-",
            questions.length,
            "questions"
        );

    }catch(error){

        console.error(
            "Error processing",
            subject + ".json"
        );

        console.error(error);

    }

});