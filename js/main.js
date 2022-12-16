const lectureList = []
let studentList;
let currentLectureFailedStudentList = []
let currentLectureSuccesStudentList = []
// back up of empty tables.All tables are dynamicly created so before every creation we need to reset table. 
var LecturesoriginalHTML = document.getElementById("lectures-Table").innerHTML;
var LectureoriginalHTML = document.getElementById("lecture-Table").innerHTML;
var StudentsoriginalHTML = document.getElementById("students-table").innerHTML;
var StudentoriginalHTML = document.getElementById("student-table").innerHTML;
//search method: search the first and second cell in Active table with studentName and studentId or Lecture Name and Point System
function Search() {
  var input, filter, table, tr, td, i, txtValue;
  active = document.getElementsByClassName("Tables-active")[0];
  table = active.getElementsByTagName("tbody")[0];
  input = active.getElementsByTagName('div')[0].getElementsByTagName('input')[0];
  filter = input.value.toUpperCase();
  tr = table.getElementsByTagName("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].getElementsByTagName("td")[0];
    sndtd = tr[i].getElementsByTagName("td")[1];
    if (td) {
      txtValue = td.textContent || td.innerText;
      txtValuesnd = sndtd.textContent || sndtd.innerText;
      if (txtValue.toUpperCase().indexOf(filter) > -1 || txtValuesnd.indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}
//There are 4 table and 1 form(adding Lecture). when user click side bar's <span>s it hide current active table and bring to screen table what user requested for.
function bringTable(id) {
  hideTables();
  table = document.getElementById(id);
  table.classList.add("Tables-active");
  table.classList.remove("Tables-hidden");

}
function hideTables() {
  table = document.getElementsByClassName("Tables-active")[0];
  table.classList.remove("Tables-active");
  table.classList.add("Tables-hidden");
}
//push new lecture to global lectureList 
function insertLecture(Form) {
  //user input
  form = document.getElementById(Form)
  //for fun
  if ((form.lname.value.toUpperCase() === "WEB DEVELOPMENT AND PROGRAMMING") || (form.lname.value.toUpperCase() === "BEKIR TANER DINÇER") || (form.lname.value.toUpperCase() === "SELAHATTIN AKSOY")) {
    startConfetti();
    setTimeout(stopConfetti, 3000);
  }
  if(form.lname.value === ""){
    alert("Lecture Name does not be empty");
    return -1;
  }
  //if list is empty don't check exist
  if (lectureList.length === 0) {
    lectureList.push(createLecture(form.lname.value, form.pointscale.checked));
  } else {
    let isLectureExist = false;
    filter = form.lname.value.toUpperCase();
    //check lecture is already exist if exist return false
    lectureList.every(element => {
      isLectureExist = (element.name.toUpperCase() === filter)
      return !isLectureExist;
    });
    if (isLectureExist) {
      alert("Lecture already exist");
      return -1;
    } else {
      //if not exist push to Student List
      lectureList.push(createLecture(form.lname.value, form.pointscale.checked));
    }
  }
  createLecturesTable();
}
//Create Table according to Current LectureList
function createLecturesTable() {
  //Get Table
  table = document.getElementById("lectures-Table");
  //Reset Table
  table.innerHTML = LecturesoriginalHTML;
  table = table.getElementsByTagName('tbody')[0];
  // Create Table According to LectureList
  lectureList.forEach(element => {
    newRow = table.insertRow();
    lectureName = newRow.insertCell();
    lecture_point_system = newRow.insertCell();
    deletion = newRow.insertCell();
    if (element.is7PointScale) {
      lecturepointtext = "7 point system"
    } else {
      lecturepointtext = "10 point system"
    }
    //We need to convert it Text Node to add taable
    namenode = document.createTextNode(element.name);
    lecture_point_system_node = document.createTextNode(lecturepointtext);
    lectureName.appendChild(namenode);
    lecture_point_system.appendChild(lecture_point_system_node);
    //trash Image
    var img = document.createElement('img');
    img.src = "/resources/trash-bin.png"
    deletion.appendChild(img)
    deletion.addEventListener("click", deleteLecture)
    //Add Event listener Every row attach to Lecture Object
    newRow.addEventListener("click", lectureRowClick)
  });
}
function lectureRowClick(e) {
  row = e.currentTarget;
  let lecturename = row.cells[0].textContent
  //Find the lecture in lecture Table by name
  for (var i = 0; i < lectureList.length; i++) {
    if (lectureList[i].name === lecturename) {
      clickedLecture = lectureList[i]
    }
  }
  //bring lecture table
  bringTable('Lecture')
  //give our Lecture object as parameter to dynamic Table Create function
  createLectureTable(clickedLecture)
}
function deleteLecture(e) {
  row = e.target.parentElement.parentElement;
  row.removeEventListener("click", lectureRowClick)
  //get the lecture name
  rowname = row.getElementsByTagName("td")[0].textContent;
  for (var i = 0; i < lectureList.length; i++) {
    if (lectureList[i].name === rowname) {
      console.log(lectureList[i].name, rowname)
      lectureList.splice(i, 1);
    }
  }
  //reflesh the table after deletion
  createLecturesTable();
  refleshStudentTable()
}

//Lecture Table:
/* <thead>
<tr>
    <td>Student name</td>
    <td>Student id</td>
    <td>Midterm</td>
    <td>Final</td>
    <td>Grade</td>
    <td>Delete</td>
</tr>
</thead> */
//Lecture Object Model is:
// {
//   name: name,
//   is7PointScale: is7PointScale,
//   studentList: [],
// };

// Create a LectureTable 
function createLectureTable(clickedLecture) {
  // reset variable
  currentLectureFailedStudentList = []
  currentLectureSuccesStudentList = []
  let MeanOfCurrentLectureMidterm = 0;
  let MeanOfCurrentLectureFinal = 0;
  let MeanOfCurrentLecture = 0;
  table = document.getElementById('lecture-Table')
  // reset table
  table.innerHTML = LectureoriginalHTML;
  //give the name of lecture to Header
  header = document.getElementById('Lecture-header');
  header.textContent = clickedLecture.name
  is7PointScale = clickedLecture.is7PointScale;
  table = table.getElementsByTagName('tbody')[0];
  for (var i = 0; i < clickedLecture.studentList.length; i++) {
    student = clickedLecture.studentList[i]
    newRow = table.insertRow();
    studentName = newRow.insertCell();
    studentId = newRow.insertCell();
    midterm = newRow.insertCell();
    final = newRow.insertCell();
    grade = newRow.insertCell();
    deletion = newRow.insertCell();
    var meanofStudent = Math.ceil((student.midtermscore * 0.4) + (student.finalscore * 0.6));
    if (is7PointScale) {
      if ((93 <= meanofStudent) && (meanofStudent <= 100)) {
        grade_note_text = "A"
        currentLectureSuccesStudentList.push(student);
      } else if ((85 <= meanofStudent) && (meanofStudent <= 92)) {
        grade_note_text = "B"
        currentLectureSuccesStudentList.push(student);
      } else if ((77 <= meanofStudent) && (meanofStudent <= 84)) {
        grade_note_text = "C"
        currentLectureSuccesStudentList.push(student);
      } else if ((70 <= meanofStudent) && (meanofStudent <= 76)) {
        grade_note_text = "D"
        currentLectureSuccesStudentList.push(student);
      } else {
        grade_note_text = "F"
        currentLectureFailedStudentList.push(student);
      }
    } else {
      if ((90 <= meanofStudent) && (meanofStudent <= 100)) {
        grade_note_text = "A"
        currentLectureSuccesStudentList.push(student);

      } else if ((80 <= meanofStudent) && (meanofStudent <= 89)) {
        grade_note_text = "B"
        currentLectureSuccesStudentList.push(student);

      } else if ((70 <= meanofStudent) && (meanofStudent <= 79)) {
        grade_note_text = "C"
        currentLectureSuccesStudentList.push(student);

      } else if ((60 <= meanofStudent) && (meanofStudent <= 69)) {
        grade_note_text = "D"
        currentLectureSuccesStudentList.push(student);

      } else {
        grade_note_text = "F"
        currentLectureFailedStudentList.push(student);
      }

    }
    // student Letter Note
    student.grade = grade_note_text;
    studentname_node = document.createTextNode(student.name);
    studentname_Id = document.createTextNode(student.id);
    midterm_node = document.createTextNode(student.midtermscore);
    final_node = document.createTextNode(student.finalscore);
    grade_node = document.createTextNode(grade_note_text);
    studentName.appendChild(studentname_node);
    studentId.appendChild(studentname_Id);
    midterm.appendChild(midterm_node);
    final.appendChild(final_node);
    grade.appendChild(grade_node);
    // create delete cell
    var img = document.createElement('img');
    img.src = "/resources/trash-bin.png"
    deletion.appendChild(img)
    deletion.addEventListener("click", DeleteStudentFromLecture)
    MeanOfCurrentLecture += meanofStudent;
    MeanOfCurrentLectureMidterm += parseInt(student.midtermscore);
    MeanOfCurrentLectureFinal += parseInt(student.finalscore);
    // update if user click student row
    newRow.addEventListener("click", updateStudentRow)
  }
  MeanOfCurrentLecture = (MeanOfCurrentLecture / clickedLecture.studentList.length);
  MeanOfCurrentLectureMidterm = (MeanOfCurrentLectureMidterm / clickedLecture.studentList.length);
  MeanOfCurrentLectureFinal = (MeanOfCurrentLectureFinal / clickedLecture.studentList.length);
  // add a mean row to end of table
  if (MeanOfCurrentLecture || MeanOfCurrentLectureMidterm || MeanOfCurrentLectureFinal) {
    meanrow = table.insertRow();
    nameofrow = meanrow.insertCell();
    meanrow.insertCell();
    meanOfMidterm = meanrow.insertCell();
    meanOfFinal = meanrow.insertCell();
    meanOfGrade = meanrow.insertCell();
    meanOfMidterm_node = document.createTextNode(MeanOfCurrentLectureMidterm.toFixed(2));
    meanOfFinal_node = document.createTextNode(MeanOfCurrentLectureFinal.toFixed(2));
    mean_node = document.createTextNode(MeanOfCurrentLecture.toFixed(2));
    nameofrow.appendChild(document.createTextNode("MeanOfCourse"))
    meanOfGrade.appendChild(mean_node);
    meanOfMidterm.appendChild(meanOfMidterm_node);
    meanOfFinal.appendChild(meanOfFinal_node);
  }
}
// Update Student info in Lecture Table
function updateStudentRow(e) {
  row = e.currentTarget;
  // get all information about Student
  let name = row.cells[0].textContent
  let id = row.cells[1].textContent
  let midterm = row.cells[2].textContent
  let final = row.cells[3].textContent
  // put it form of Student add
  document.getElementById('studentNameInput').value = name;
  document.getElementById('studentIdInput').value = id;
  document.getElementById('studentMidtermInput').value = midterm;
  document.getElementById('studentFinalInput').value = final;
  // scroll up to form 
  var element = document.getElementById("header");
  element.scrollIntoView({ behavior: "smooth" });
}
//Delete Student From Lecture
function DeleteStudentFromLecture(e) {
  //get the lecture name using by header 
  var lectureName = document.getElementById('Lecture-header').textContent;
  // find lecture
  for (var i = 0; i < lectureList.length; i++) {
    if (lectureList[i].name === lectureName) {
      currentLecture = lectureList[i]
    }
  }
  // get student id from row
  row = e.target.parentElement.parentElement;
  row.removeEventListener("click", lectureRowClick)
  rowid = row.getElementsByTagName("td")[1].textContent;
  // find student with Student Id
  for (var i = 0; i < currentLecture.studentList.length; i++) {
    element = currentLecture.studentList[i]
    if (element.id === rowid) {
      currentLecture.studentList.splice(i, 1);
    }
  }
  // reflesh and recreate Lecture Table
  createLectureTable(currentLecture);
  refleshStudentTable()
}
// Read Student add form info and add List
function addStudentToLecture() {
  var lectureName = document.getElementById('Lecture-header').textContent;
  for (var i = 0; i < lectureList.length; i++) {
    if (lectureList[i].name === lectureName) {
      currentLecture = lectureList[i]
    }
  }
  studentname = document.getElementById('studentNameInput').value;
  studentid = document.getElementById('studentIdInput').value;
  midterm = document.getElementById('studentMidtermInput').value;
  final = document.getElementById('studentFinalInput').value;
  isStudentAlreadyExistInClass = false
  isStudentSame = false;
  if(studentname === "" || studentid === "" ){
    alert("Student name or Student ID cannot be empty");
    return -1;
  }
  // Check Student by id if it is already in Lecture 
  currentLecture.studentList.every(element => {
    isStudentAlreadyExistInClass = element.id === studentid;
    // check Student name and Id is same if it is then update Student
    isStudentSame = element.name.toUpperCase() === studentname.toUpperCase();
    return !isStudentAlreadyExistInClass;
  });
  if (isStudentAlreadyExistInClass) {
    if (isStudentSame) {
          // check Student name and Id is same if it is then update Student
-      currentLecture.studentList.forEach(element => {
        if (element.id === studentid) {
          element.midtermscore = midterm;
          element.finalscore = final;
        }
      });
    } else {
      alert("this Student Id Already in use")
    }

  } else {
    currentLecture.studentList.push(createStudent(studentname, studentid, midterm, final))
  }
  createLectureTable(currentLecture);
  refleshStudentTable()

}
// display student by failed or Succesed 
function displayStudents(isSuccesStudentsList) {
  let list;
  if (isSuccesStudentsList) list = currentLectureSuccesStudentList;
  else list = currentLectureFailedStudentList;
  table = document.getElementById('lecture-Table')
  //reset table
  table.innerHTML = LectureoriginalHTML;
  table = table.getElementsByTagName('tbody')[0];
  for (var i = 0; i < list.length; i++) {
    student = list[i]
    newRow = table.insertRow();
    studentName = newRow.insertCell();
    studentId = newRow.insertCell();
    midterm = newRow.insertCell();
    final = newRow.insertCell();
    grade = newRow.insertCell();
    deletion = newRow.insertCell();
    studentname_node = document.createTextNode(student.name);
    studentname_Id = document.createTextNode(student.id);
    midterm_node = document.createTextNode(student.midtermscore);
    final_node = document.createTextNode(student.finalscore);
    grade_node = document.createTextNode(student.grade);
    studentName.appendChild(studentname_node);
    studentId.appendChild(studentname_Id);
    midterm.appendChild(midterm_node);
    final.appendChild(final_node);
    grade.appendChild(grade_node);
    var img = document.createElement('img');
    img.src = "/resources/trash-bin.png"
    deletion.appendChild(img)
    deletion.addEventListener("click", DeleteStudentFromLecture)
  }
}
//get data from lectures's studentslist to create studentList
function refleshStudentList() {
  studentList = new Object();
  for (var i = 0; i < lectureList.length; i++) {
    for (var j = 0; j < lectureList[i].studentList.length; j++) {
      student = lectureList[i].studentList[j]
      lecturename = lectureList[i].name
      isStudentExist = studentList[student.id] // if is not in studentList return falsy statement
      if (isStudentExist) {
        let isLectureAlreadyExist = false // check lecture Already Exist
        studentList[student.id].score.every(element => {
          isLectureAlreadyExist = element.lecture === lecturename
          return !isLectureAlreadyExist;
        });
        if (isLectureAlreadyExist) {
          console.log("lecture Exist")
          continue;
        }
        else {
          //every Student have a list of lecture (score) that the student has registered;
          studentList[student.id].score.push({ lecture: lecturename, midterm: student.midtermscore, final: student.finalscore, grade: student.grade })
        }
      } else {
          //create Student if not exist in StudentList;
        studentList[student.id] = { name: student.name, id: student.id, score: [{ lecture: lecturename, midterm: student.midtermscore, final: student.finalscore, grade: student.grade }] }
      }
    }
  }
}
function refleshStudentTable() {
  refleshStudentList();
  createStudentsTable();
}

function createStudentsTable() {
  table = document.getElementById('students-table')
  //reset table
  table.innerHTML = StudentsoriginalHTML;
  table = table.getElementsByTagName('tbody')[0];
  for (const [key, value] of Object.entries(studentList)) {
    student = value
    newRow = table.insertRow();
    studentName = newRow.insertCell();
    studentId = newRow.insertCell();
    deletion = newRow.insertCell();
    studentname_node = document.createTextNode(student.name);
    studentname_Id = document.createTextNode(student.id);
    studentName.appendChild(studentname_node);
    studentId.appendChild(studentname_Id);
    var img = document.createElement('img');
    img.src = "/resources/trash-bin.png"
    deletion.appendChild(img)
    deletion.addEventListener("click", deleteAllStudent)
    newRow.addEventListener("click", studentrowClick)
  }
}
//delete the Student from  All Lectures that the Student has registered;
function deleteAllStudent(e){
row = e.currentTarget.parentElement;
row.removeEventListener("click", studentrowClick)
studentId = row.getElementsByTagName("td")[1].textContent;
for (var i = 0; i < lectureList.length; i++) {
for (var j = 0; j < lectureList[i].studentList.length; j++) {
  student = lectureList[i].studentList[j]
  console.log(lectureList[i].name)
  console.log(student.name)
  if(student.id === studentId){
    lectureList[i].studentList.splice(j,1)
  }
}}
refleshStudentList();
createStudentsTable();
}
// When User Click Student row see detail of the Student
function studentrowClick(e) {
  //row
  row = e.currentTarget;
  //get Student id from row
  let studentId = row.cells[1].textContent
  let clickedstudent;
  for (const [key, value] of Object.entries(studentList)) {
    if (value.id === studentId) {
      clickedstudent = studentList[key]
    }
  }
  bringTable('StudentTable');
  createStudentsNoteTable(clickedstudent);
}
// Dynamicly create list of Lecture of The Student that we choose by clicking row
function createStudentsNoteTable(clickedstudent) {
  // update header
  header = document.getElementById('Student-header');
  header.textContent = clickedstudent.name
  // update header
  idHeader = document.getElementById('StudentId-header');
  idHeader.textContent = clickedstudent.id
  table = document.getElementById('student-table')
  //reset Student List of Lecture table
  table.innerHTML = StudentoriginalHTML;
  table = table.getElementsByTagName('tbody')[0];
  console.log(clickedstudent)
  for (var i = 0; i < clickedstudent.score.length; i++) {
    lecture = clickedstudent.score[i]
    newRow = table.insertRow();
    lecturename = newRow.insertCell();
    midterm = newRow.insertCell();
    final = newRow.insertCell();
    grade = newRow.insertCell();
    deletion = newRow.insertCell();
    lecturename_node = document.createTextNode(lecture.lecture);
    midterm_node = document.createTextNode(lecture.midterm);
    final_node = document.createTextNode(lecture.final);
    grade_node = document.createTextNode(lecture.grade);
    lecturename.appendChild(lecturename_node);
    midterm.appendChild(midterm_node);
    final.appendChild(final_node);
    grade.appendChild(grade_node);
    var img = document.createElement('img');
    img.src = "/resources/trash-bin.png"
    deletion.appendChild(img)
    deletion.addEventListener("click", deleteLectureFromStudent)
  }
}
// delete lecture from student table
function deleteLectureFromStudent(e){
  let lecture;
  let id = document.getElementById('StudentId-header').textContent;
  row = e.target.parentElement.parentElement;
  row.removeEventListener("click", lectureRowClick)
  rowname = row.getElementsByTagName("td")[0].textContent;
  for (var i = 0; i < lectureList.length; i++) {
    if (lectureList[i].name === rowname) {
      lecture = lectureList[i]
    }
  }
  for (var i = 0; i < lecture.studentList.length; i++) {
    element = lecture.studentList[i]
    if (element.id === id) {
      lecture.studentList.splice(i, 1);
  
    }
  }
  createLecturesTable();
  refleshStudentTable();
  bringTable("StudentsTable");
}
//delete lecture
function deleteLecture(e) {
  row = e.target.parentElement.parentElement;
  row.removeEventListener("click", lectureRowClick)
  rowname = row.getElementsByTagName("td")[0].textContent;
  for (var i = 0; i < lectureList.length; i++) {
    if (lectureList[i].name === rowname) {
      lectureList.splice(i, 1);
    }
  }
  createLecturesTable();
  refleshStudentTable()
}

function createLecture(name, is7PointScale) {
  return {
    name: name,
    is7PointScale: is7PointScale,
    studentList: [],
  };
}
function createStudent(name, id, midtermscore, finalscore) {
  return {
    name: name,
    id: id,
    midtermscore: midtermscore,
    finalscore: finalscore,
    score: []
  }
}



































/// Confetti.js Basicly Confetti Stuff

var maxParticleCount = 150; //set max confetti count
var particleSpeed = 2; //set the particle animation speed
var startConfetti; //call to start confetti animation
var stopConfetti; //call to stop adding confetti
var toggleConfetti; //call to start or stop the confetti animation depending on whether it's already running
var removeConfetti; //call to stop the confetti animation and remove all confetti immediately

(function () {
  startConfetti = startConfettiInner;
  stopConfetti = stopConfettiInner;
  toggleConfetti = toggleConfettiInner;
  removeConfetti = removeConfettiInner;
  var colors = ["DodgerBlue", "OliveDrab", "Gold", "Pink", "SlateBlue", "LightBlue", "Violet", "PaleGreen", "SteelBlue", "SandyBrown", "Chocolate", "Crimson"]
  var streamingConfetti = false;
  var animationTimer = null;
  var particles = [];
  var waveAngle = 0;

  function resetParticle(particle, width, height) {
    particle.color = colors[(Math.random() * colors.length) | 0];
    particle.x = Math.random() * width;
    particle.y = Math.random() * height - height;
    particle.diameter = Math.random() * 10 + 5;
    particle.tilt = Math.random() * 10 - 10;
    particle.tiltAngleIncrement = Math.random() * 0.07 + 0.05;
    particle.tiltAngle = 0;
    return particle;
  }

  function startConfettiInner() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    window.requestAnimFrame = (function () {
      return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function (callback) {
          return window.setTimeout(callback, 16.6666667);
        };
    })();
    var canvas = document.getElementById("confetti-canvas");
    if (canvas === null) {
      canvas = document.createElement("canvas");
      canvas.setAttribute("id", "confetti-canvas");
      canvas.setAttribute("style", "display:block;z-index:999999;pointer-events:none;position:absolute;");
      document.getElementById("header").appendChild(canvas);
      canvas.width = width;
      canvas.height = height;
      window.addEventListener("resize", function () {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }, true);
    }
    var context = canvas.getContext("2d");
    while (particles.length < maxParticleCount)
      particles.push(resetParticle({}, width, height));
    streamingConfetti = true;
    if (animationTimer === null) {
      (function runAnimation() {
        context.clearRect(0, 0, window.innerWidth, window.innerHeight);
        if (particles.length === 0)
          animationTimer = null;
        else {
          updateParticles();
          drawParticles(context);
          animationTimer = requestAnimFrame(runAnimation);
        }
      })();
    }
  }

  function stopConfettiInner() {
    streamingConfetti = false;
  }

  function removeConfettiInner() {
    stopConfetti();
    particles = [];
  }

  function toggleConfettiInner() {
    if (streamingConfetti)
      stopConfettiInner();
    else
      startConfettiInner();
  }

  function drawParticles(context) {
    var particle;
    var x;
    for (var i = 0; i < particles.length; i++) {
      particle = particles[i];
      context.beginPath();
      context.lineWidth = particle.diameter;
      context.strokeStyle = particle.color;
      x = particle.x + particle.tilt;
      context.moveTo(x + particle.diameter / 2, particle.y);
      context.lineTo(x, particle.y + particle.tilt + particle.diameter / 2);
      context.stroke();
    }
  }

  function updateParticles() {
    var width = window.innerWidth;
    var height = window.innerHeight;
    var particle;
    waveAngle += 0.01;
    for (var i = 0; i < particles.length; i++) {
      particle = particles[i];
      if (!streamingConfetti && particle.y < -15)
        particle.y = height + 100;
      else {
        particle.tiltAngle += particle.tiltAngleIncrement;
        particle.x += Math.sin(waveAngle);
        particle.y += (Math.cos(waveAngle) + particle.diameter + particleSpeed) * 0.5;
        particle.tilt = Math.sin(particle.tiltAngle) * 15;
      }
      if (particle.x > width + 20 || particle.x < -20 || particle.y > height) {
        if (streamingConfetti && particles.length <= maxParticleCount)
          resetParticle(particle, width, height);
        else {
          particles.splice(i, 1);
          i--;
        }
      }
    }
  }
})();