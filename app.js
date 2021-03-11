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

var keyWord;
var questionsList= new Array();
var questionTitleList=new Array(20);
var creationDayList=new Array(20);
var scoreList=new Array(20);
var commentsList = new Array();
var answersList = new Array();
var questionsBodyList = new Array(20);


app.get("/", (req,res)=>{

  if(keyWord!= null){
      let chunks=[]
       const url ="https://api.stackexchange.com/2.2/search?fromdate=1614556800&todate=1615075200&order=desc&sort=creation&tagged="+keyWord+"&site=stackoverflow&filter=!-NKU34xLhG5N9D)KWaUu_Wjf.FWepB)_T#";
       const begin = Date.now();
       https.get(url, (response)=> {
            response= decompressResponse(response);
            response.on("data", (question)=>{
                 chunks.push(question)
            }).on("end",()=>{
              let allQuestions  = Buffer.concat(chunks);
              questionsList = JSON.parse(allQuestions);


              loadUpData();
              // console.log(commentsList);
              res.render('main', {questionTitle: questionTitleList, creationDay: creationDayList, voteNum: scoreList,questionBody:questionsBodyList, answers: answersList,comments: commentsList, responseTime: Date.now() - begin});
            })


            })

// items[2].comments[0].body
// items[2].answers[0].comments[0].body

 }else{
   res.sendFile(__dirname + "/index.html");
 }

})

function loadUpData(){
  for (var i = 0; i < 20; i++) {
      questionTitleList[i]=questionsList.items[i].title;
      creationDayList[i]= questionsList.items[i].creation_date;
      scoreList[i]=questionsList.items[i].score;
      questionsBodyList[i]=questionsList.items[i].body;

      if(questionsList.items[i].comments!=undefined){
        commentsList[i]=questionsList.items[i].comments;
      }else{
          commentsList[i]="Not applicable";
      }

      if (questionsList.items[i].answers!=undefined) {
          answersList[i]= questionsList.items[i].answers;
      }else {
        answersList[i]="Not applicable";
      }


  }
}

app.post("/",(req,res)=>{
  keyWord=req.body.keyword;
  console.log(keyWord);
  res.redirect("/");
})

app.listen(3000,()=>{
     console.log("server is running on port 3000")
})
