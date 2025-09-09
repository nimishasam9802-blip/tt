function to24Hour(hour, min, ampm){
  hour = parseInt(hour);
  min = parseInt(min);
  if(ampm==="PM" && hour<12) hour+=12;
  if(ampm==="AM" && hour===12) hour=0;
  return `${hour.toString().padStart(2,"0")}:${min.toString().padStart(2,"0")}`;
}

const urlParams = new URLSearchParams(window.location.search);
const editId = urlParams.get("id");
const preselectDay = urlParams.get("day");
const formTitle = document.getElementById("formTitle");

let classes = JSON.parse(localStorage.getItem("timetable")||"[]");

if(editId){
  formTitle.textContent="Edit Class";
  const c=classes.find(x=>x.id==editId);
  if(c){
    document.getElementById("title").value=c.title;
    document.getElementById("day").value=c.day;

    let [sh,sm]=c.start.split(":").map(Number);
    let startAmPm=sh>=12?"PM":"AM";
    if(sh===0) sh=12;
    else if(sh>12) sh-=12;
    document.getElementById("startHour").value=sh;
    document.getElementById("startMin").value=sm;
    document.getElementById("startAmPm").value=startAmPm;

    let [eh,em]=c.end.split(":").map(Number);
    let endAmPm=eh>=12?"PM":"AM";
    if(eh===0) eh=12;
    else if(eh>12) eh-=12;
    document.getElementById("endHour").value=eh;
    document.getElementById("endMin").value=em;
    document.getElementById("endAmPm").value=endAmPm;

    document.getElementById("reminder").value=c.reminder;
  }
}else if(preselectDay){
  document.getElementById("day").value=preselectDay;
}

document.getElementById("classForm").addEventListener("submit", (e)=>{
  e.preventDefault();

  const title=document.getElementById("title").value;
  const day=parseInt(document.getElementById("day").value);

  const start=to24Hour(
    document.getElementById("startHour").value,
    document.getElementById("startMin").value,
    document.getElementById("startAmPm").value
  );
  const end=to24Hour(
    document.getElementById("endHour").value,
    document.getElementById("endMin").value,
    document.getElementById("endAmPm").value
  );

  const reminder=document.getElementById("reminder").value;

  if(editId){
    const idx=classes.findIndex(x=>x.id==editId);
    classes[idx]={id:editId,title,day,start,end,reminder};
  }else{
    classes.push({id:Date.now(),title,day,start,end,reminder});
  }

  localStorage.setItem("timetable",JSON.stringify(classes));
  window.location.replace("index.html"); // go back to home
});
