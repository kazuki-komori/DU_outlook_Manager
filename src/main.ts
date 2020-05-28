import * as dotenv from "dotenv";

dotenv.config();

export interface ProcessEnv {
    [key: string]: string;
}

declare var process: {
    env: {
        LINE_TOKEN: string
    }
}
const lineToken = process.env.LINE_TOKEN; //LINE notify token
const get_interval = 5; //●分前～現在の新着メールを取得 #--トリガーの時間間隔をこれに合わせる


function send_line(Me){
 const payload = {'message' :   Me};
 let options ={
   "method"  : "post",
   "payload" : payload,
   "headers" : {"Authorization" : "Bearer "+ lineToken}
 };
 this.UrlFetchApp.fetch("https://notify-api.line.me/api/notify", options);
}
dotenv.config({path: "../.env"})

function fetchContactMail() {
 //取得間隔
 const now_time= Math.floor(new Date().getTime() / 1000) ;//現在時刻を変換
 const time_term = now_time - ((60 * get_interval) + 3); //秒にして+3秒しておく

 //検索条件指定
 const strTerms = '(is:unread after:'+ time_term + ')';

 //取得
 const myThreads = GmailApp.search(strTerms);
 const myMsgs = GmailApp.getMessagesForThreads(myThreads);
 const valMsgs = [];
 for(let i = 0; i < myMsgs.length;i++){
  if(myMsgs[i].slice(-1)[0].getFrom() === "komokazu.hjkh7@au.com" || myMsgs[i].slice(-1)[0].getFrom() === "duet@mail.doshisha.ac.jp" || myMsgs[i].slice(-1)[0].getFrom() === "do-class@mail.doshisha.ac.jp"){
    valMsgs[i] = " " + myMsgs[i].slice(-1)[0].getDate().getMonth() + "/"+ myMsgs[i].slice(-1)[0].getDate().getDate()
    + " " + myMsgs[i].slice(-1)[0].getDate().getHours() + ":" + myMsgs[i].slice(-1)[0].getDate().getMinutes()
    + "\n[from]" + myMsgs[i].slice(-1)[0].getFrom()
    + "\n\n[subject]" + myMsgs[i].slice(-1)[0].getSubject()
    + "\n\n[Message]\n"+ myMsgs[i].slice(-1)[0].getPlainBody();
  }
 }

 return valMsgs;
}

function main() {
 const new_Me = fetchContactMail()
 if(new_Me.length > 0){
   for(let i = new_Me.length-1; i >= 0; i--){
     send_line(new_Me[i])
   }
 }
}
