// ========================================
// ATPL STUDY PLATFORM
// ========================================


// ========================================
// GLOBAL VARIABLES
// ========================================

let questions = [];

let current = 0;

let status = [];

let quizMode = false;


// ========================================
// SUBJECT NAMES
// ========================================

const subjectNames = {

    meteorology: "Meteorology",

    airlaw: "Air Law",

    operational: "Operational Procedures"

};


// ========================================
// SUBJECT FILES
// ========================================

const subjectFiles = [

    "meteorology",

    "airlaw",

    "operational"

];


// ========================================
// HOME - PRACTICE BUTTON
// ========================================

document.getElementById("practiceBtn").onclick = function(){

    document.getElementById("homeScreen").style.display =
        "none";

    document.getElementById("practiceSetup").style.display =
        "block";

};


// ========================================
// START PRACTICE
// ========================================

document.getElementById("startPracticeBtn").onclick = function(){

    quizMode = false;

    let subjectFile =
        document.getElementById("practiceSubjectSelect").value;


    document.getElementById("practiceSetup").style.display =
        "none";


    document.getElementById("quizScreen").style.display =
        "block";


    loadPracticeQuestions(subjectFile);

};


// ========================================
// PRACTICE BACK BUTTON
// ========================================

document.getElementById("practiceBackBtn").onclick = function(){

    document.getElementById("practiceSetup").style.display =
        "none";

    document.getElementById("homeScreen").style.display =
        "block";

};


// ========================================
// HOME - SUBJECT QUIZ BUTTON
// ========================================

document.getElementById("subjectQuizBtn").onclick = function(){

    document.getElementById("homeScreen").style.display =
        "none";

    document.getElementById("quizSetup").style.display =
        "block";

};


// ========================================
// START SUBJECT QUIZ
// ========================================

document.getElementById("startQuizBtn").onclick = function(){

    quizMode = true;


    let subjectFile =
        document.getElementById("subjectSelect").value;


    let numberOfQuestions =
        document.getElementById("questionCount").value;


    document.getElementById("quizSetup").style.display =
        "none";


    document.getElementById("quizScreen").style.display =
        "block";


    loadSubjectQuiz(
        subjectFile,
        numberOfQuestions
    );

};


// ========================================
// SUBJECT QUIZ BACK BUTTON
// ========================================

document.getElementById("backHomeBtn").onclick = function(){

    document.getElementById("quizSetup").style.display =
        "none";

    document.getElementById("homeScreen").style.display =
        "block";

};


// ========================================
// HOME - COMBINED QUIZ BUTTON
// ========================================

document.getElementById("combinedQuizBtn").onclick = function(){

    document.getElementById("homeScreen").style.display =
        "none";


    document.getElementById("combinedQuizSetup").style.display =
        "block";


    loadCombinedQuestionCount();

};


// ========================================
// COMBINED QUIZ BACK BUTTON
// ========================================

document.getElementById("combinedBackBtn").onclick = function(){

    document.getElementById("combinedQuizSetup").style.display =
        "none";


    document.getElementById("homeScreen").style.display =
        "block";

};


// ========================================
// LOAD COMBINED QUESTION COUNT
// ========================================

async function loadCombinedQuestionCount(){

    let totalQuestions = 0;


    try{

        for(let file of subjectFiles){

            let response =
                await fetch(
                    "data/" + file + ".json"
                );


            let data =
                await response.json();


            totalQuestions += data.length;

        }


        document.getElementById(
            "availableQuestions"
        ).innerHTML =

            "Available questions: <strong>" +
            totalQuestions +
            "</strong>";


        updateCombinedQuestionOptions(
            totalQuestions
        );


    }catch(error){

        console.error(error);


        document.getElementById(
            "availableQuestions"
        ).innerHTML =

            "Unable to load questions.";

    }

}


// ========================================
// UPDATE COMBINED QUESTION OPTIONS
// ========================================

function updateCombinedQuestionOptions(totalQuestions){

    let select =
        document.getElementById(
            "combinedQuestionCount"
        );


    let options =
        select.querySelectorAll("option");


    options.forEach(function(option){

        if(option.value !== "all"){

            let number =
                parseInt(option.value);


            if(number > totalQuestions){

                option.disabled = true;

            }else{

                option.disabled = false;

            }

        }

    });

}


// ========================================
// START COMBINED QUIZ
// ========================================

document.getElementById("startCombinedBtn").onclick = function(){

    let questionCount =
        document.getElementById(
            "combinedQuestionCount"
        ).value;


    loadCombinedQuiz(questionCount);

};


// ========================================
// LOAD PRACTICE QUESTIONS
// ========================================

async function loadPracticeQuestions(subjectFile){

    try{

        let response =
            await fetch(
                "data/" + subjectFile + ".json"
            );


        questions =
            await response.json();

            questions.forEach(function(question){

    question.subject = subjectFile;

});

        // IMPORTANT:
        // Practice mode does NOT randomize.
        // Questions remain in JSON order.


        status =
            new Array(questions.length)
            .fill("notAttempted");


        current = 0;


       document.getElementById("subject").innerHTML =
    subjectNames[subjectFile];

createNavigator();

showQuestion();

await loadSavedProgress(subjectFile);

}catch(error){

        console.error(error);

        alert(
            "Error loading practice questions."
        );

    }

}


// ========================================
// LOAD SUBJECT QUIZ
// ========================================

async function loadSubjectQuiz(
    subjectFile,
    numberOfQuestions
){

    try{

        let response =
            await fetch(
                "data/" + subjectFile + ".json"
            );


        let allQuestions =
            await response.json();

allQuestions.forEach(function(question){

    question.subject = subjectFile;

});
        // RANDOMIZE QUESTIONS

        allQuestions.sort(function(){

            return Math.random() - 0.5;

        });


        // SELECT QUESTIONS

        if(numberOfQuestions === "all"){

            questions =
                allQuestions;

        }else{

            questions =
                allQuestions.slice(
                    0,
                    parseInt(numberOfQuestions)
                );

        }


        status =
            new Array(questions.length)
            .fill("notAttempted");


        current = 0;


        document.getElementById("subject").innerHTML =
            subjectNames[subjectFile] +
            " QUIZ";


        createNavigator();

        showQuestion();


    }catch(error){

        console.error(error);

        alert(
            "Error loading subject quiz."
        );

    }

}


// ========================================
// LOAD COMBINED QUIZ
// ========================================

async function loadCombinedQuiz(
    questionCount
){

    let combinedQuestions = [];


    try{


        // LOAD EVERY SUBJECT

        for(let file of subjectFiles){

            let response =
                await fetch(
                    "data/" + file + ".json"
                );


            let data =
                await response.json();


            // Add subject information

            data.forEach(function(question){

                question.subject = file;

                combinedQuestions.push(question);

            });

        }


        // RANDOMIZE ALL QUESTIONS

        combinedQuestions.sort(function(){

            return Math.random() - 0.5;

        });


        // SELECT NUMBER OF QUESTIONS

        if(questionCount === "all"){

            questions =
                combinedQuestions;

        }else{

            questions =
                combinedQuestions.slice(
                    0,
                    parseInt(questionCount)
                );

        }


        status =
            new Array(questions.length)
            .fill("notAttempted");


        current = 0;

        quizMode = true;


        document.getElementById(
            "combinedQuizSetup"
        ).style.display =
            "none";


        document.getElementById(
            "quizScreen"
        ).style.display =
            "block";


        document.getElementById("subject").innerHTML =
            "COMBINED ATPL QUIZ";


        createNavigator();

        showQuestion();


    }catch(error){

        console.error(error);

        alert(
            "Error loading combined quiz."
        );

    }

}


// ========================================
// CREATE QUESTION NAVIGATOR
// ========================================

function createNavigator(){

    let nav =
        document.getElementById(
            "navigator"
        );


    nav.innerHTML = "";


    questions.forEach(function(
        question,
        index
    ){

        let button =
            document.createElement(
                "button"
            );


        button.innerHTML =
            index + 1;


        button.className =
            "navButton " +
            status[index];


        button.onclick = function(){

            current = index;

            showQuestion();

        };


        nav.appendChild(button);

    });

}


// ========================================
// SHOW QUESTION
// ========================================

function showQuestion(){

    if(!questions.length){

        return;

    }


    document.getElementById(
        "counter"
    ).innerHTML =

        "Question " +
        (current + 1) +
        " of " +
        questions.length;


    document.getElementById(
        "question"
    ).innerHTML =

        questions[current].question;


    let answers =
        document.getElementById(
            "answers"
        );


    answers.innerHTML = "";


    questions[current].options.forEach(
        function(option,index){

            let button =
                document.createElement(
                    "button"
                );


            button.className =
                "option";


            button.innerHTML =
                option;


      button.onclick = async function(){

    let questionStatus;


    if(
        index ===
        questions[current].answer
    ){

        button.classList.add(
            "correct"
        );


        status[current] =
            "correct";


        questionStatus =
            "correct";

    }else{

        button.classList.add(
            "wrong"
        );


        status[current] =
            "wrong";


        questionStatus =
            "wrong";

    }


    // Save progress to Supabase

    await saveProgress(
        questions[current],
        current,
        questionStatus
    );


    createNavigator();

};


            answers.appendChild(
                button
            );

        }
    );

}


// ========================================
// NEXT BUTTON
// ========================================

document.getElementById("nextBtn").onclick = function(){

    if(
        current <
        questions.length - 1
    ){

        current++;

        showQuestion();

    }else{

        if(quizMode){

            showResults();

        }

    }

};


// ========================================
// PREVIOUS BUTTON
// ========================================

document.getElementById("prevBtn").onclick = function(){

    if(current > 0){

        current--;

        showQuestion();

    }

};


// ========================================
// SKIP BUTTON
// ========================================

document.getElementById("skipBtn").onclick = function(){

    status[current] =
        "skipped";


    if(
        current <
        questions.length - 1
    ){

        current++;

        showQuestion();

    }


    createNavigator();

};


// ========================================
// BACK TO MENU FROM QUESTIONS
// ========================================

document.getElementById(
    "questionBackBtn"
).onclick = function(){

    document.getElementById(
        "quizScreen"
    ).style.display =
        "none";


    document.getElementById(
        "practiceSetup"
    ).style.display =
        "none";


    document.getElementById(
        "quizSetup"
    ).style.display =
        "none";


    document.getElementById(
        "combinedQuizSetup"
    ).style.display =
        "none";


    document.getElementById(
        "resultsScreen"
    ).style.display =
        "none";


    document.getElementById(
        "homeScreen"
    ).style.display =
        "block";

};


// ========================================
// SHOW RESULTS
// ========================================

function showResults(){

    let correct = 0;

    let wrong = 0;

    let skipped = 0;


    status.forEach(function(result){

        if(result === "correct"){

            correct++;

        }else if(result === "wrong"){

            wrong++;

        }else if(result === "skipped"){

            skipped++;

        }

    });


    let total =
        questions.length;


    let percentage =
        Math.round(
            (correct / total) * 100
        );


    document.getElementById(
        "quizScreen"
    ).style.display =
        "none";


    document.getElementById(
        "resultsScreen"
    ).style.display =
        "block";


    document.getElementById(
        "resultScore"
    ).innerHTML =

        "<h1>" +
        percentage +
        "%</h1>";


    document.getElementById(
        "resultDetails"
    ).innerHTML =

        "<p>Correct: " +
        correct +
        "</p>" +

        "<p>Wrong: " +
        wrong +
        "</p>" +

        "<p>Skipped: " +
        skipped +
        "</p>" +

        "<p>Total Questions: " +
        total +
        "</p>";

}


// ========================================
// REVIEW ANSWERS
// ========================================

document.getElementById(
    "reviewBtn"
).onclick = function(){

    document.getElementById(
        "resultsScreen"
    ).style.display =
        "none";


    document.getElementById(
        "quizScreen"
    ).style.display =
        "block";


    current = 0;


    showQuestion();

};


// ========================================
// RESULTS HOME BUTTON
// ========================================

document.getElementById(
    "resultsHomeBtn"
).onclick = function(){

    document.getElementById(
        "resultsScreen"
    ).style.display =
        "none";


    document.getElementById(
        "homeScreen"
    ).style.display =
        "block";

};
// ========================================
// SUPABASE AUTHENTICATION
// ========================================


// CREATE ACCOUNT

document.getElementById("signupBtn").onclick =
async function(){

    let email =
        document.getElementById("loginEmail").value.trim();

    let password =
        document.getElementById("loginPassword").value;


    if(!email || !password){

        document.getElementById("loginMessage").innerHTML =
            "Please enter your email and password.";

        return;

    }


    if(password.length < 6){

        document.getElementById("loginMessage").innerHTML =
            "Password must be at least 6 characters.";

        return;

    }


    document.getElementById("loginMessage").innerHTML =
        "Creating account...";


    const { data, error } =
        await supabaseClient.auth.signUp({

            email: email,

            password: password

        });


    if(error){

        console.error(error);

        document.getElementById("loginMessage").innerHTML =
            error.message;

        return;

    }


    document.getElementById("loginMessage").innerHTML =
        "Account created successfully. You can now log in.";

};


// ========================================
// LOGIN
// ========================================

document.getElementById("loginBtn").onclick =
async function(){

    let email =
        document.getElementById("loginEmail").value.trim();

    let password =
        document.getElementById("loginPassword").value;


    if(!email || !password){

        document.getElementById("loginMessage").innerHTML =
            "Please enter your email and password.";

        return;

    }


    document.getElementById("loginMessage").innerHTML =
        "Logging in...";


    const { data, error } =
        await supabaseClient.auth.signInWithPassword({

            email: email,

            password: password

        });


    if(error){

        console.error(error);

        document.getElementById("loginMessage").innerHTML =
            error.message;

        return;

    }


    // Login successful

    document.getElementById("loginScreen").style.display =
        "none";


    document.getElementById("homeScreen").style.display =
        "block";

};
// ========================================
// SAVE ATPL QUESTION PROGRESS
// ========================================

async function saveProgress(
    question,
    questionIndex,
    questionStatus
){

    try{

        const {
            data: { user }
        } = await supabaseClient.auth.getUser();


        if(!user){

            console.log("No logged-in user.");

            return;

        }


        // Make sure this question has a permanent ID

        if(!question.id){

            console.error(
                "Question has no permanent ID:",
                question
            );

            return;

        }


        const questionId =
            question.id;


        const subject =
            question.subject || "unknown";


        // Find existing progress

        const {
            data: existing,
            error: findError
        } =
            await supabaseClient
                .from("progress")
                .select("id")
                .eq("user_id", user.id)
                .eq("question_id", questionId)
                .maybeSingle();


        if(findError){

            console.error(
                "Error finding progress:",
                findError
            );

            return;

        }


        // UPDATE existing record

        if(existing){

            const { error } =
                await supabaseClient
                    .from("progress")
                    .update({

                        subject: subject,

                        question_index:
                            questionIndex,

                        status:
                            questionStatus,

                        updated_at:
                            new Date().toISOString()

                    })
                    .eq(
                        "id",
                        existing.id
                    );


            if(error){

                console.error(
                    "Error updating progress:",
                    error
                );

                return;

            }

        }


        // INSERT new record

        else{

            const { error } =
                await supabaseClient
                    .from("progress")
                    .insert({

                        user_id:
                            user.id,

                        question_id:
                            questionId,

                        subject:
                            subject,

                        question_index:
                            questionIndex,

                        status:
                            questionStatus

                    });


            if(error){

                console.error(
                    "Error saving progress:",
                    error
                );

                return;

            }

        }


        console.log(
            "Progress saved:",
            questionId,
            questionStatus
        );


    }catch(error){

        console.error(
            "Unexpected progress error:",
            error
        );

    }

}
// ========================================
// LOAD SAVED PROGRESS
// ========================================

async function loadSavedProgress(subject){

    try{

        const {
            data: { user }
        } = await supabaseClient.auth.getUser();


        if(!user){

            console.log("No logged-in user.");

            return;

        }


        const {
            data,
            error
        } =
            await supabaseClient
                .from("progress")
                .select("question_id,status")
                .eq("user_id", user.id)
                .eq("subject", subject);


        if(error){

            console.error(
                "Error loading progress:",
                error
            );

            return;

        }


        if(data){

            data.forEach(function(record){

                const index =
                    questions.findIndex(
                        function(question){

                            return (
                                question.id ===
                                record.question_id
                            );

                        }
                    );


                if(index !== -1){

                    status[index] =
                        record.status;

                }

            });

        }


        createNavigator();


        console.log(
            "Progress loaded:",
            subject,
            data ? data.length : 0,
            "records"
        );


    }catch(error){

        console.error(
            "Unexpected progress loading error:",
            error
        );

    }

}