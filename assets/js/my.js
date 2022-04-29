async function requestApi() {
  const testing = await fetch("https://opentdb.com/api.php?amount=10&type=multiple")
    .then((e) => {
      if (e.ok) {
        return e.json();
      }
      throw new Error("There are something worng with data Api");
    })
    .then((e) => {
      if (e.response_code != 0) {
        throw new Error("Question is not available");
      }
      return e.results;
    });
  return testing;
}

requestApi()
  .then((data) => {
    // to catch if request have been into data

    let count = 0;
    let gradeOfUser = [];
    allData(data, count, gradeOfUser);

    const btnNext = document.getElementById("button").querySelector(".btnNext");
    btnNext.addEventListener("click", function (e) {
      count++;
      const ans = document.getElementsByClassName("answers")[0];
      ans.innerHTML = "";
      this.setAttribute("type", "hidden");
      allData(data, count, gradeOfUser);
    });
  })
  // handle if request sent error
  .catch((e) => console.error(e));

function allData(data, count, gradeOfUser) {
  const question1 = document.getElementsByClassName("question")[0];
  const number = question1.getElementsByClassName("question-header")[0];
  const text_q = question1.getElementsByClassName("question-text")[0];
  number.innerHTML = `QUESTION ${count + 1}/${data.length}`;
  text_q.innerHTML = `${data[count].question}`;
  //save answers  as array
  let datas = data[count].incorrect_answers;
  datas.push(data[count].correct_answer);

  //randomMultiChoice
  randomAnswer(datas);

  //user choice
  const ans = document.getElementsByClassName("answers")[0];
  //calculate
  const calEachAnswer = Math.round(100 / data.length);
  // temporary var
  let tmp_answered = false;

  ans.addEventListener("click", function (e) {
    if (e.target.className == "hide" && tmp_answered == false) {
      tmp_answered = true;
      const answerUser = e.target.nextElementSibling.innerHTML;
      if (answerUser == data[count].correct_answer) {
        e.target.parentElement.classList.add("activeT");
        gradeOfUser.push(calEachAnswer);
        e.target.previousElementSibling.style.backgroundColor = "green";
      } else {
        gradeOfUser.push(0);
        e.target.previousElementSibling.style.backgroundColor = "red";
        e.target.parentElement.classList.add("active");
      }

      //check alreadt finish Or not
      btnNextOrFinish(count, data, gradeOfUser);
    }
  });
}

function randomAnswer(datas) {
  let tmpAr = [];
  while (tmpAr.length != datas.length) {
    let random = Math.round(Math.random() * 3);
    let tmpCheck = true;
    for (let j = 0; j < tmpAr.length; j++) {
      if (tmpAr[j] == random) tmpCheck = false;
    }
    if (tmpCheck) {
      tmpAr.push(random);
    }
  }
  let answerLi = ``;
  for (let i = 0; i < datas.length; i++) {
    const ans = document.getElementsByClassName("answers")[0];
    let makeP = document.createElement("p");
    let makeLi = document.createElement("li");
    let makeSpan = document.createElement("span");
    let makeSpan1 = document.createElement("input");

    makeLi.appendChild(makeSpan);
    makeLi.appendChild(makeSpan1);
    makeLi.appendChild(makeP);
    makeSpan1.classList.add("hide");
    makeLi.classList.add("answer");
    makeP.innerHTML = `${datas[tmpAr[i]]}`;
    makeSpan.innerHTML = `${(i + 10).toString(36)}`;
    ans.appendChild(makeLi);
  }
}
function btnNextOrFinish(count, data, gradeOfUser) {
  const containerBtn = document.getElementById("button");
  const btnNext = containerBtn.querySelector(".btnNext");
  if (count != data.length - 1) {
    btnNext.setAttribute("type", "button");
  } else {
    const grade = gradeOfUser.reduce((acc, arr) => (acc += arr));
    const testingGrade = document.createElement("p");
    const headerGrade = document.createElement("h3");
    const btnGrade = document.createElement("input");
    const conGrade = document.createElement("div");
    testingGrade.innerHTML = `Your Grade is  <b>${grade} </b>`;
    conGrade.appendChild(headerGrade);
    conGrade.appendChild(testingGrade);
    conGrade.appendChild(btnGrade);

    headerGrade.innerText = "Result Of Quiz";

    // added classes
    conGrade.classList.add("question");
    headerGrade.classList.add("question-header");
    testingGrade.classList.add("question-text");
    btnGrade.setAttribute("value", "START AGAIN");
    btnGrade.setAttribute("type", "button");
    const container = document.getElementsByClassName("container")[0];
    container.innerHTML = "";
    container.append(conGrade);
    conGrade.classList.add("questionAddon");

    const refreshPage = document.getElementsByClassName("questionAddon")[0].querySelector("input");
    refreshPage.addEventListener("click", function (e) {
      location.reload();
    });
  }
}
