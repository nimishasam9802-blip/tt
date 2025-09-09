const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
const DAY_COLORS = ["#ffadad","#ffd6a5","#fdffb6","#caffbf","#9bf6ff","#a0c4ff"];
const SUBJECT_COLORS = ["#4f46e5","#e63946","#06d6a0","#ffb703","#8d99ae","#f72585","#118ab2"];
let subjectColorMap = JSON.parse(localStorage.getItem("subjectColors")||"{}");

let classes = JSON.parse(localStorage.getItem("timetable")||"[]");
let attendance = JSON.parse(localStorage.getItem("attendance")||"{}");

function saveClasses(){
  localStorage.setItem("timetable",JSON.stringify(classes));
  localStorage.setItem("subjectColors",JSON.stringify(subjectColorMap));
}

function renderTimetable(){
  const container=document.getElementById("timetable");
  container.innerHTML="";
  DAYS.forEach((d,i)=>{
    const dayDiv=document.createElement("div");
    dayDiv.className="day";
    dayDiv.style.background=DAY_COLORS[i];
    dayDiv.innerHTML=`<h3>${d}</h3>`;

    dayDiv.onclick=(e)=>{
      if(e.target.tagName.toLowerCase()==="button") return;
      window.location.href=`add.html?day=${i}`;
    };

    const dayClasses=classes.filter(c=>c.day==i);
    dayClasses.forEach(c=>{
      if(!subjectColorMap[c.title]){
        subjectColorMap[c.title]=SUBJECT_COLORS[Object.keys(subjectColorMap).length % SUBJECT_COLORS.length];
      }
      const div=document.createElement("div");
      div.className="class";
      div.style.background=subjectColorMap[c.title];

      div.innerHTML=`
        <strong>${c.title}</strong><br>
        ${c.start} - ${c.end}
        <div class="controls">
          <button class="edit">Edit</button>
          <button class="delete">Delete</button>
          <button class="attend">Attend</button>
        </div>
      `;

      div.querySelector(".edit").onclick=(ev)=>{
        ev.stopPropagation();
        window.location.href=`add.html?id=${c.id}`;
      };
      div.querySelector(".delete").onclick=(ev)=>{
        ev.stopPropagation();
        classes=classes.filter(x=>x.id!==c.id);
        saveClasses();
        renderTimetable();
      };
      div.querySelector(".attend").onclick=(ev)=>{
        ev.stopPropagation();
        logAttendance(c.id, c.title);
      };

      dayDiv.appendChild(div);
    });
    container.appendChild(dayDiv);
  });
  saveClasses();
}

function logAttendance(id, title){
  attendance[id]=(attendance[id]||0)+1;
  localStorage.setItem("attendance",JSON.stringify(attendance));
  const streak=attendance[id];

  const popup=document.getElementById("attendancePopup");
  popup.textContent=`🎉 You've attended "${title}" ${streak} classes in a row! Good job!`;
  popup.style.display="block";
  setTimeout(()=>popup.style.display="none",3000);
}

function checkReminders(){
  if(Notification.permission!=="granted") return;
  const now=new Date();
  const current=now.getHours()*60+now.getMinutes();
  classes.forEach(c=>{
    const [sh,sm]=c.start.split(":").map(Number);
    const classTime=sh*60+sm;
    if(current===classTime-(+c.reminder)){
      new Notification(`Reminder: ${c.title} starts at ${c.start}`);
    }
  });
}

if("Notification" in window && Notification.permission!=="granted"){
  Notification.requestPermission();
}

renderTimetable();
setInterval(checkReminders,60000);
