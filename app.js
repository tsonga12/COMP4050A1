const express = require("express");
const https = require("https");
const zlib = require('zlib');
const compress = require("compression");
const bodyParser = require("body-parser");
const decompressResponse = require('decompress-response');
const app = express();
app.use(compress());
app.use(bodyParser.urlencoded({extended: true}));
app.set('view engine', 'ejs');
app.use(express.static("public"));

var keyWord;
var newestQuestionsList= new Array(10);
var mostVotedQuestionsList= new Array(10);
var questionTitleList=new Array(10);
var creationDayList=new Array(10);
var scoreList=new Array(10);
var commentsList = new Array(10);
var answersList = new Array(10);
var questionsBodyList = new Array(10);

var questionTitleList2=new Array(10);
var creationDayList2=new Array(10);
var scoreList2=new Array(10);
var commentsList2 = new Array(10);
var answersList2 = new Array(10);
var questionsBodyList2 = new Array(10);


app.get("/", (req,res)=>{

  if(keyWord!= null){
      let chunksForNewestQuestions=[];

      let chunksForMostVotedQuestions=[];
       const newestUrl ="https://api.stackexchange.com/2.2/search?pagesize=10&order=desc&sort=creation&tagged="+keyWord+"&site=stackoverflow&filter=!2vBpbPvTC62b)tq6X2x_Lk2DUOWAhgy(2btm*WV3ba";
       const mostVotedUrl ="https://api.stackexchange.com/2.2/search?pagesize=10&fromdate=1614902400&todate=1615420800&order=desc&sort=votes&tagged="+keyWord+"&site=stackoverflow&filter=!2vBpbPvTC62b)tq6X2x_Lk2DUOWAhgy(2btm*WV3ba";

       const begin = Date.now();
       https.get(newestUrl, (response)=> {
            response= decompressResponse(response);
            response.on("data", (question)=>{
                 chunksForNewestQuestions.push(question)
            }).on("end",()=>{
              let allQuestions  = Buffer.concat(chunksForNewestQuestions);
              newestQuestionsList = JSON.parse(allQuestions);
              loadUpDataForNewestQuestions();
              https.get(mostVotedUrl, (response2)=> {
                   response2= decompressResponse(response2);
                   response2.on("data", (question2)=>{
                        chunksForMostVotedQuestions.push(question2)
                   }).on("end",()=>{
                     let allQuestions  = Buffer.concat(chunksForMostVotedQuestions);
                     mostVotedQuestionsList = JSON.parse(allQuestions);
                     sortMostVotedQuestionsByDate();
                     loadUpDataForMostVotedQuestions();
                     res.render('main', {questionTitle2: questionTitleList2, creationDay2: creationDayList2, voteNum2: scoreList2,questionBody2:questionsBodyList2,
                        answers2: answersList2,comments2: commentsList2, responseTime: Date.now() - begin,questionTitle: questionTitleList, creationDay: creationDayList, voteNum: scoreList,questionBody:questionsBodyList, answers: answersList,comments: commentsList});
                   })
                   })
            })
        })




 }else{
   res.sendFile(__dirname + "/index.html");
 }

})

function sortMostVotedQuestionsByDate(){
  for (var i = 0; i <10 ; i++) {
    let max =i;
    for (var j = i+1; j < 10; j++) {
      if (mostVotedQuestionsList.items[max].creation_date < mostVotedQuestionsList.items[j].creation_date) {
                max = j;
      }
    }
    if (max !== i) {
            let tmp = mostVotedQuestionsList.items[i];
            mostVotedQuestionsList.items[i] = mostVotedQuestionsList.items[max];
            mostVotedQuestionsList.items[max] = tmp;
        }
  }
}


function loadUpDataForNewestQuestions(){
  for (var i = 0; i < 10; i++) {
      questionTitleList[i]=newestQuestionsList.items[i].title;
      creationDayList[i]= newestQuestionsList.items[i].creation_date;
      scoreList[i]=newestQuestionsList.items[i].score;
      questionsBodyList[i]=newestQuestionsList.items[i].body;

      if(newestQuestionsList.items[i].comments!=undefined){
        commentsList[i]=newestQuestionsList.items[i].comments;
      }else{
          commentsList[i]="Not applicable";
      }

      if (newestQuestionsList.items[i].answers!=undefined) {
          answersList[i]= newestQuestionsList.items[i].answers;
      }else {
        answersList[i]="Not applicable";
      }
  }
}

function loadUpDataForMostVotedQuestions(){
  for (var i = 0; i < 10; i++) {
      questionTitleList2[i]=mostVotedQuestionsList.items[i].title;
      creationDayList2[i]= mostVotedQuestionsList.items[i].creation_date;
      scoreList2[i]=mostVotedQuestionsList.items[i].score;
      questionsBodyList2[i]=mostVotedQuestionsList.items[i].body;

      if(mostVotedQuestionsList.items[i].comments!=undefined){
        commentsList2[i]=mostVotedQuestionsList.items[i].comments;
      }else{
          commentsList2[i]="Not applicable";
      }

      if (mostVotedQuestionsList.items[i].answers!=undefined) {
          answersList2[i]= mostVotedQuestionsList.items[i].answers;
      }else {
        answersList2[i]="Not applicable";
      }


  }
}

app.post("/",(req,res)=>{
  keyWord=req.body.keyword;
  res.redirect("/");
})

app.listen(8080,()=>{
     console.log("server is running on port 8080");
})
